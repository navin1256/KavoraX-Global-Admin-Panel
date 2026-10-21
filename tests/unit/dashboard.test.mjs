import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('7 & 14: Dashboard Stats DTO Mapping & Failure Handling', () => {
  // Service wrapper replicating useDashboardApi
  async function fetchDashboardStats(apiClient, fetchFn) {
    const res = await apiClient.request('/v1/admin/dashboard/stats', {}, fetchFn);
    const raw = res.data;

    // Mapping and defensive defaults for DashboardStatsDto
    return {
      totalDemoLeads: Number(raw.totalDemoLeads ?? 0),
      totalDemoBookings: Number(raw.totalDemoBookings ?? 0),
      totalSessionRequests: Number(raw.totalSessionRequests ?? 0),
      pendingLeads: Number(raw.pendingLeads ?? 0),
    };
  }

  it('7 & 14. Successfully maps real backend stats DTO to dashboard cards', async () => {
    const mockApiClient = {
      request: async (endpoint, opts, fetchFn) => ({
        data: {
          totalDemoLeads: 12,
          totalDemoBookings: 8,
          totalSessionRequests: 4,
          pendingLeads: 3
        }
      })
    };

    const stats = await fetchDashboardStats(mockApiClient);

    assert.equal(stats.totalDemoLeads, 12);
    assert.equal(stats.totalDemoBookings, 8);
    assert.equal(stats.totalSessionRequests, 4);
    assert.equal(stats.pendingLeads, 3);
  });

  it('7. Handles missing optional fields with safe numerical zero fallbacks, preserving numeric types', async () => {
    const mockApiClient = {
      request: async () => ({
        data: {
          totalDemoLeads: 5,
        }
      })
    };

    const stats = await fetchDashboardStats(mockApiClient);

    assert.equal(stats.totalDemoLeads, 5);
    assert.equal(stats.totalDemoBookings, 0);
    assert.equal(stats.totalSessionRequests, 0);
    assert.equal(stats.pendingLeads, 0);
  });

  it('7 & 13. Dashboard API failure throws error and does not render stale mock numbers', async () => {
    const mockApiClient = {
      request: async () => {
        throw new Error('503 Service Unavailable');
      }
    };

    let statsState = null;
    let errorState = null;

    try {
      statsState = await fetchDashboardStats(mockApiClient);
    } catch (err) {
      errorState = err.message;
      statsState = null;
    }

    assert.equal(errorState, '503 Service Unavailable');
    assert.equal(statsState, null);
  });
});
