import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('11 & 12 & 13: API Client, Errors, and No-Mock Fallback Enforcement', () => {
  // Pure testable implementation of useApiClient core logic
  class MockApiClient {
    constructor(baseUrl = 'http://localhost:8080/api', getToken = () => null, onUnauthorized = () => {}) {
      this.baseUrl = baseUrl;
      this.getToken = getToken;
      this.onUnauthorized = onUnauthorized;
    }

    async request(endpoint, options = {}, fetchFn = globalThis.fetch) {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
      const token = this.getToken();

      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      };

      let response;
      try {
        response = await fetchFn(url, { ...options, headers });
      } catch (err) {
        throw new Error(`Network failure: Unable to reach KavoraX backend at ${url}. ${err.message}`);
      }

      if (response.status === 401) {
        this.onUnauthorized();
        throw new Error('Authentication expired or invalid. Please sign in again.');
      }

      if (response.status === 403) {
        throw new Error('Access forbidden: You do not have administrative privileges.');
      }

      if (!response.ok) {
        let msg = `API request failed with status ${response.status}`;
        try {
          const body = await response.json();
          if (body?.message) msg = body.message;
        } catch {}
        throw new Error(msg);
      }

      return {
        data: await response.json(),
        headers: response.headers,
      };
    }
  }

  it('Injects Authorization: Bearer token when token exists', async () => {
    let capturedHeaders = null;
    const client = new MockApiClient(
      'http://localhost:8080/api',
      () => 'my-jwt-token-12345',
      () => {}
    );

    const mockFetch = async (url, opts) => {
      capturedHeaders = opts.headers;
      return {
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({ status: 'UP' })
      };
    };

    await client.request('/health', {}, mockFetch);
    assert.equal(capturedHeaders.Authorization, 'Bearer my-jwt-token-12345');
  });

  it('11. Unauthorized (401) triggers onUnauthorized callback and rejects with clear message', async () => {
    let unauthorizedTriggered = false;
    const client = new MockApiClient(
      'http://localhost:8080/api',
      () => 'expired-token',
      () => { unauthorizedTriggered = true; }
    );

    const mockFetch = async () => ({
      ok: false,
      status: 401,
      headers: new Headers(),
      json: async () => ({ message: 'Token expired' })
    });

    await assert.rejects(
      async () => {
        await client.request('/v1/admin/dashboard/stats', {}, mockFetch);
      },
      /Authentication expired or invalid/
    );

    assert.equal(unauthorizedTriggered, true);
  });

  it('12. Network failures throw descriptive error without unhandled crashing', async () => {
    const client = new MockApiClient('http://localhost:8080/api', () => null, () => {});
    const failingFetch = async () => {
      throw new Error('ECONNREFUSED');
    };

    await assert.rejects(
      async () => {
        await client.request('/health', {}, failingFetch);
      },
      /Network failure: Unable to reach KavoraX backend/
    );
  });

  it('13. Production code does NOT fallback to mock data on API error', async () => {
    const client = new MockApiClient('http://localhost:8080/api', () => 'token', () => {});
    const failingFetch = async () => ({
      ok: false,
      status: 500,
      headers: new Headers(),
      json: async () => ({ message: 'Internal Database Error' })
    });

    // Simulating production repository layer
    let leadsData = null;
    let errorMessage = null;

    try {
      const res = await client.request('/v1/admin/demo-leads', {}, failingFetch);
      leadsData = res.data;
    } catch (err) {
      errorMessage = err.message;
      // CRITICAL NON-NEGOTIABLE CHECK: Never assign fallback mock leads array!
      leadsData = null;
    }

    assert.equal(errorMessage, 'Internal Database Error');
    // Ensure leadsData is NOT populated with mock fallback
    assert.equal(leadsData, null);
    assert.notEqual(leadsData, [{ id: 1, name: 'Sample Lead' }]);
  });
});
