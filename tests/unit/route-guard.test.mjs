import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('3 & 4: Route Guards and Navigation Protection', () => {
  // Pure logic implementation of app/middleware/auth.global.ts
  function evaluateNavigation(toPath, isAuthenticated) {
    const isPublic = toPath === '/login' || toPath === '/';

    if (!isAuthenticated && !isPublic) {
      return {
        action: 'redirect',
        destination: `/login?redirect=${encodeURIComponent(toPath)}`,
      };
    }

    if (isAuthenticated && toPath === '/login') {
      return {
        action: 'redirect',
        destination: '/admin',
      };
    }

    return {
      action: 'proceed',
      destination: toPath,
    };
  }

  it('3. Protected route (/admin, /admin/leads, etc.) without authentication redirects to login with redirect param', () => {
    const protectedRoutes = [
      '/admin',
      '/admin/leads',
      '/admin/enquiries',
      '/admin/settings',
      '/admin/pricing',
    ];

    for (const route of protectedRoutes) {
      const decision = evaluateNavigation(route, false);
      assert.equal(decision.action, 'redirect');
      assert.equal(decision.destination, `/login?redirect=${encodeURIComponent(route)}`);
    }
  });

  it('4. Protected route with valid session allows user to proceed', () => {
    const protectedRoutes = [
      '/admin',
      '/admin/leads',
      '/admin/enquiries',
    ];

    for (const route of protectedRoutes) {
      const decision = evaluateNavigation(route, true);
      assert.equal(decision.action, 'proceed');
      assert.equal(decision.destination, route);
    }
  });

  it('Authenticated user attempting to visit /login is redirected back to /admin', () => {
    const decision = evaluateNavigation('/login', true);
    assert.equal(decision.action, 'redirect');
    assert.equal(decision.destination, '/admin');
  });

  it('Unauthenticated user visiting /login proceeds cleanly without redirect loop', () => {
    const decision = evaluateNavigation('/login', false);
    assert.equal(decision.action, 'proceed');
    assert.equal(decision.destination, '/login');
  });
});
