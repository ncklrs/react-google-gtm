import {
  mockGTM,
  restoreGTM,
  getAllEvents,
  getLastEvent,
  getEventsByName,
  clearEvents,
  wasEventSent,
  getEventCount,
} from '../testing';

describe('Testing Utilities', () => {
  beforeEach(() => {
    mockGTM();
  });

  afterEach(() => {
    restoreGTM();
  });

  it('should mock GTM dataLayer', () => {
    expect(window.dataLayer).toBeDefined();
    expect(Array.isArray(window.dataLayer)).toBe(true);
  });

  it('should track all events', () => {
    window.dataLayer.push({ event: 'test1', data: 'value1' });
    window.dataLayer.push({ event: 'test2', data: 'value2' });

    const events = getAllEvents();
    expect(events).toHaveLength(2);
    expect(events[0].event).toBe('test1');
    expect(events[1].event).toBe('test2');
  });

  it('should get last event', () => {
    window.dataLayer.push({ event: 'first' });
    window.dataLayer.push({ event: 'second' });
    window.dataLayer.push({ event: 'third' });

    const lastEvent = getLastEvent();
    expect(lastEvent?.event).toBe('third');
  });

  it('should filter events by name', () => {
    window.dataLayer.push({ event: 'page_view', page: '/' });
    window.dataLayer.push({ event: 'click', button: 'A' });
    window.dataLayer.push({ event: 'page_view', page: '/about' });

    const pageViews = getEventsByName('page_view');
    expect(pageViews).toHaveLength(2);
    expect(pageViews[0].page).toBe('/');
    expect(pageViews[1].page).toBe('/about');
  });

  it('should clear all events', () => {
    window.dataLayer.push({ event: 'test1' });
    window.dataLayer.push({ event: 'test2' });

    expect(getAllEvents()).toHaveLength(2);

    clearEvents();

    expect(getAllEvents()).toHaveLength(0);
  });

  it('should check if event was sent', () => {
    window.dataLayer.push({ event: 'test_event', data: 'value' });

    expect(wasEventSent('test_event')).toBe(true);
    expect(wasEventSent('other_event')).toBe(false);
    expect(wasEventSent('test_event', { data: 'value' })).toBe(true);
    expect(wasEventSent('test_event', { data: 'wrong' })).toBe(false);
  });

  it('should count events by name', () => {
    window.dataLayer.push({ event: 'click' });
    window.dataLayer.push({ event: 'click' });
    window.dataLayer.push({ event: 'click' });
    window.dataLayer.push({ event: 'view' });

    expect(getEventCount('click')).toBe(3);
    expect(getEventCount('view')).toBe(1);
    expect(getEventCount('none')).toBe(0);
  });
});
