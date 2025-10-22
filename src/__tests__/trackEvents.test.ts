import {
  trackPageView,
  trackButtonClick,
  trackFormSubmission,
  trackCustomEvent,
} from '../utils/trackEvents';

describe('Track Events Utilities', () => {
  beforeEach(() => {
    (window as any).dataLayer = [];
  });

  afterEach(() => {
    delete (window as any).dataLayer;
  });

  describe('trackPageView', () => {
    it('should send page view event', () => {
      trackPageView('home');

      expect(window.dataLayer).toContainEqual({
        event: 'page_view',
        page: 'home',
      });
    });
  });

  describe('trackButtonClick', () => {
    it('should send button click event', () => {
      trackButtonClick('Subscribe Button');

      expect(window.dataLayer).toContainEqual({
        event: 'button_click',
        button_name: 'Subscribe Button',
      });
    });
  });

  describe('trackFormSubmission', () => {
    it('should send form submission event', () => {
      trackFormSubmission('contact-form');

      expect(window.dataLayer).toContainEqual({
        event: 'form_submission',
        form_id: 'contact-form',
      });
    });
  });

  describe('trackCustomEvent', () => {
    it('should send custom event with properties', () => {
      trackCustomEvent('user_action', {
        category: 'engagement',
        label: 'video_play',
        value: 1,
      });

      expect(window.dataLayer).toContainEqual({
        event: 'user_action',
        category: 'engagement',
        label: 'video_play',
        value: 1,
      });
    });

    it('should handle empty properties', () => {
      trackCustomEvent('simple_event', {});

      expect(window.dataLayer).toContainEqual({
        event: 'simple_event',
      });
    });
  });
});
