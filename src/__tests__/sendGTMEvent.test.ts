import { sendGTMEvent, configureGTM } from '../sendGTMEvent';

describe('sendGTMEvent', () => {
  beforeEach(() => {
    // Reset dataLayer before each test
    (window as any).dataLayer = [];
    // Reset config
    configureGTM({ debug: false });
  });

  afterEach(() => {
    // Clean up
    delete (window as any).dataLayer;
  });

  it('should push event to dataLayer', () => {
    const eventData = { event: 'test_event', data: 'test' };
    sendGTMEvent(eventData);

    expect(window.dataLayer).toContainEqual(eventData);
  });

  it('should warn when dataLayer is not initialized', () => {
    delete (window as any).dataLayer;
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    sendGTMEvent({ event: 'test_event' });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Google Tag Manager dataLayer is not initialized.'
    );

    consoleWarnSpy.mockRestore();
  });

  it('should log events in debug mode', () => {
    configureGTM({ debug: true });
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const eventData = { event: 'test_event', data: 'test' };

    sendGTMEvent(eventData);

    expect(consoleLogSpy).toHaveBeenCalledWith('[GTM Debug]', eventData);

    consoleLogSpy.mockRestore();
  });

  it('should not log events when debug is false', () => {
    configureGTM({ debug: false });
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    sendGTMEvent({ event: 'test_event' });

    expect(consoleLogSpy).not.toHaveBeenCalled();

    consoleLogSpy.mockRestore();
  });

  it('should handle complex event data', () => {
    const complexEvent = {
      event: 'purchase',
      ecommerce: {
        transaction_id: '12345',
        value: 99.99,
        currency: 'USD',
        items: [
          { item_id: 'SKU123', item_name: 'Product 1', price: 99.99 }
        ]
      }
    };

    sendGTMEvent(complexEvent);

    expect(window.dataLayer).toContainEqual(complexEvent);
  });
});

describe('configureGTM', () => {
  it('should update configuration', () => {
    configureGTM({ debug: true });
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    (window as any).dataLayer = [];
    sendGTMEvent({ event: 'test' });

    expect(consoleLogSpy).toHaveBeenCalled();

    consoleLogSpy.mockRestore();
  });
});
