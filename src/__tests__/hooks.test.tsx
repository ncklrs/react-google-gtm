import React from 'react';
import { useGTMClick } from '../hooks/useGTMClick';
import { useGTMForm } from '../hooks/useGTMForm';

describe('GTM Hooks', () => {
  describe('useGTMClick', () => {
    it('should be defined', () => {
      expect(useGTMClick).toBeDefined();
      expect(typeof useGTMClick).toBe('function');
    });
  });

  describe('useGTMForm', () => {
    it('should be defined', () => {
      expect(useGTMForm).toBeDefined();
      expect(typeof useGTMForm).toBe('function');
    });
  });
});
