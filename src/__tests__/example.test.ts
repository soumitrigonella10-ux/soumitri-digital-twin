// ========================================
// Simple Unit Tests
// Basic test setup for utilities
// ========================================

import { describe, it, expect } from 'vitest';

// Example test for utility functions
import { validateWithSchema, productSchema } from '@/lib/validation';

describe('Validation Utilities', () => {
  describe('validateWithSchema', () => {
    it('should validate valid product data', () => {
      const validProduct = {
        id: 'test-product',
        name: 'Test Product',
        category: 'skincare',
        actives: ['niacinamide'],
        cautionTags: [],
      };

      const result = validateWithSchema(productSchema, validProduct);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should reject invalid product data', () => {
      const invalidProduct = {
        id: '',
        name: '',
        category: 'skincare',
      };

      const result = validateWithSchema(productSchema, invalidProduct);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });
});

describe('Date Utilities', () => {
  it('should handle date operations correctly', () => {
    const testDate = new Date('2026-02-01');
    expect(testDate.getFullYear()).toBe(2026);
    expect(testDate.getMonth()).toBe(1); // February is month 1 (0-indexed)
    expect(testDate.getDate()).toBe(1);
  });
});