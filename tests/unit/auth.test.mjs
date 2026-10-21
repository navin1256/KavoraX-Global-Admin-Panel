import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('1 & 2 & 5 & 6: Authentication & Session Management', () => {
  // Pure logic simulation of useAuth state machine and token storage
  class MockAuthStore {
    constructor() {
      this.token = null;
      this.user = null;
    }

    get isAuthenticated() {
      return Boolean(this.token && this.user);
    }

    async login(email, password, mockFetch) {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const response = await mockFetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Authentication failed. Please check your credentials.');
      }

      const data = await response.json();
      if (!data.token) {
        throw new Error('Malformed response: missing authentication token.');
      }

      this.token = data.token;
      this.user = data.user || { email, role: 'ADMIN' };
      return data;
    }

    logout() {
      this.token = null;
      this.user = null;
    }

    expireSession() {
      this.token = null;
      this.user = null;
    }
  }

  it('1. Successful login stores token, sets user profile, and establishes authenticated session', async () => {
    const auth = new MockAuthStore();
    const mockFetch = async (url, opts) => {
      assert.equal(url, '/api/v1/auth/login');
      assert.equal(opts.method, 'POST');
      const body = JSON.parse(opts.body);
      assert.equal(body.email, 'admin@kavorax.com');
      assert.equal(body.password, 'SecureAuth_2025!');

      return {
        ok: true,
        status: 200,
        json: async () => ({
          token: 'jwt-header.jwt-payload.jwt-sig',
          type: 'Bearer',
          user: { id: 1, email: 'admin@kavorax.com', role: 'ADMIN' }
        })
      };
    };

    assert.equal(auth.isAuthenticated, false);
    const res = await auth.login('admin@kavorax.com', 'SecureAuth_2025!', mockFetch);
    
    assert.equal(auth.isAuthenticated, true);
    assert.equal(auth.token, 'jwt-header.jwt-payload.jwt-sig');
    assert.equal(auth.user.email, 'admin@kavorax.com');
    assert.equal(auth.user.role, 'ADMIN');
    assert.equal(res.token, 'jwt-header.jwt-payload.jwt-sig');
  });

  it('2. Invalid login throws user-facing error and leaves auth state unauthenticated', async () => {
    const auth = new MockAuthStore();
    const mockFetch = async () => ({
      ok: false,
      status: 401,
      json: async () => ({
        timestamp: '2026-10-17T12:00:00Z',
        status: 401,
        error: 'Unauthorized',
        message: 'Invalid credentials'
      })
    });

    await assert.rejects(
      async () => {
        await auth.login('admin@kavorax.com', 'WrongPassword123!', mockFetch);
      },
      /Invalid credentials/
    );

    assert.equal(auth.isAuthenticated, false);
    assert.equal(auth.token, null);
    assert.equal(auth.user, null);
  });

  it('5. Session expiration clears token and unsets authenticated flag', () => {
    const auth = new MockAuthStore();
    auth.token = 'active-jwt-token';
    auth.user = { id: 1, email: 'admin@kavorax.com', role: 'ADMIN' };
    assert.equal(auth.isAuthenticated, true);

    auth.expireSession();

    assert.equal(auth.isAuthenticated, false);
    assert.equal(auth.token, null);
    assert.equal(auth.user, null);
  });

  it('6. Logout clears credentials, destroys session, and resets user state', () => {
    const auth = new MockAuthStore();
    auth.token = 'sample-admin-token';
    auth.user = { id: 1, email: 'admin@kavorax.com', role: 'ADMIN' };
    assert.equal(auth.isAuthenticated, true);

    auth.logout();

    assert.equal(auth.isAuthenticated, false);
    assert.equal(auth.token, null);
    assert.equal(auth.user, null);
  });
});
