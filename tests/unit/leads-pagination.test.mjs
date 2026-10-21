import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('8 & 9 & 10 & 14: Leads, Contact Messages, and Pagination Contracts', () => {
  // Helper replicating useDemoLeadsApi pagination parser
  function parsePaginatedResponse(data, headers) {
    const totalCount = parseInt(headers.get('x-total-count') || '0', 10);
    const totalPages = parseInt(headers.get('x-total-pages') || '1', 10);
    const currentPage = parseInt(headers.get('x-current-page') || '0', 10);
    const pageSize = parseInt(headers.get('x-page-size') || '10', 10);

    const items = Array.isArray(data) ? data : (data?.content || []);

    return {
      items,
      pagination: {
        totalElements: isNaN(totalCount) ? items.length : totalCount,
        totalPages: isNaN(totalPages) ? 1 : totalPages,
        currentPage: isNaN(currentPage) ? 0 : currentPage,
        pageSize: isNaN(pageSize) ? 10 : pageSize,
      }
    };
  }

  it('9 & 14. Demo leads maps full DTO fields correctly and extracts pagination headers', () => {
    const mockHeaders = new Headers({
      'x-total-count': '42',
      'x-total-pages': '5',
      'x-current-page': '0',
      'x-page-size': '10',
    });

    const mockData = [
      {
        id: 101,
        fullName: 'Jane Doe',
        email: 'jane@enterprise.com',
        phone: '+1 555-0199',
        company: 'Acme Corp',
        country: 'United States',
        preferredDate: '2026-10-25',
        preferredTimeSlot: '14:00 - 15:00 UTC',
        message: 'Interested in enterprise cloud migration',
        status: 'PENDING',
        createdAt: '2026-10-17T10:00:00Z',
      }
    ];

    const result = parsePaginatedResponse(mockData, mockHeaders);

    assert.equal(result.items.length, 1);
    const lead = result.items[0];
    assert.equal(lead.id, 101);
    assert.equal(lead.fullName, 'Jane Doe');
    assert.equal(lead.email, 'jane@enterprise.com');
    assert.equal(lead.company, 'Acme Corp');
    assert.equal(lead.preferredDate, '2026-10-25');
    assert.equal(lead.preferredTimeSlot, '14:00 - 15:00 UTC');
    assert.equal(lead.status, 'PENDING');

    assert.equal(result.pagination.totalElements, 42);
    assert.equal(result.pagination.totalPages, 5);
    assert.equal(result.pagination.currentPage, 0);
    assert.equal(result.pagination.pageSize, 10);
  });

  it('8 & 14. Contact messages maps inquiry DTO fields correctly', () => {
    const mockHeaders = new Headers({
      'x-total-count': '15',
      'x-total-pages': '2',
      'x-current-page': '0',
      'x-page-size': '10',
    });

    const mockData = [
      {
        id: 5,
        fullName: 'Rajesh Patel',
        email: 'rajesh@fintech.in',
        phone: '+91 98765 43210',
        subject: 'Partnership Inquiry',
        message: 'Looking to integrate payment gateways',
        status: 'UNREAD',
        createdAt: '2026-10-17T11:30:00Z',
      }
    ];

    const result = parsePaginatedResponse(mockData, mockHeaders);

    assert.equal(result.items.length, 1);
    const msg = result.items[0];
    assert.equal(msg.id, 5);
    assert.equal(msg.fullName, 'Rajesh Patel');
    assert.equal(msg.subject, 'Partnership Inquiry');
    assert.equal(msg.message, 'Looking to integrate payment gateways');
    assert.equal(msg.status, 'UNREAD');
    assert.equal(result.pagination.totalElements, 15);
  });

  it('10. Empty dataset returns clean empty array and zero total count', () => {
    const mockHeaders = new Headers({
      'x-total-count': '0',
      'x-total-pages': '0',
      'x-current-page': '0',
      'x-page-size': '10',
    });

    const result = parsePaginatedResponse([], mockHeaders);

    assert.equal(result.items.length, 0);
    assert.deepEqual(result.items, []);
    assert.equal(result.pagination.totalElements, 0);
    assert.equal(result.pagination.totalPages, 0);
  });
});
