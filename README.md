
```markdown
# react-google-gtm

`react-google-gtm` is a React package for integrating Google Tag Manager with your application. It provides a simple way to load the GTM script and push events to the `dataLayer`.

## Installation

```bash
npm install react-google-gtm
```

## Usage

### Adding the Google Tag Manager Script

```tsx
import React from 'react';
import { GoogleTagManager } from 'react-google-gtm';

const App: React.FC = () => {
  return (
    <>
      <GoogleTagManager gtmId="GTM-XXXXXX" />
      {/* Your app content */}
    </>
  );
};

export default App;
```

### Sending Events

```tsx
import { sendGTMEvent } from 'react-google-gtm';

const handleClick = () => {
  sendGTMEvent({
    event: 'button_click',
    button_name: 'Subscribe Now'
  });
};

const Button: React.FC = () => (
  <button onClick={handleClick}>Subscribe Now</button>
);
```

## API

### `GoogleTagManager`

**Props:**
- `gtmId` (string): The Google Tag Manager ID to be used.

### `sendGTMEvent`

**Parameters:**
- `eventData` (object): The event data to be pushed to the `dataLayer`.

**Example:**

```ts
sendGTMEvent({ event: 'page_view', page: 'home' });
```

## Event Tracking Utility Functions

```
trackPageView(page: string)
```

Tracks a page view event.

- `page` (string): The name of the page being viewed.

```
trackButtonClick(buttonName: string)
```

Tracks a button click event.

- `buttonName` (string): The name of the button being clicked.

```
trackFormSubmission(formId: string)
```

Tracks a form submission event.

- `formId` (string): The ID of the form being submitted.

```
trackCustomEvent(eventName: string, properties: Record<string, any>)
```

Tracks a custom event.

- `eventName` (string): The name of the custom event.
- `properties` (object): Additional properties for the event.


## Contributing

Contributions are welcome! Please submit issues or pull requests on [GitHub](https://github.com/your-repo/react-google-gtm).

## License

MIT License
```
