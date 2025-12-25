## Icone Pay SDK

A lightweight TypeScript SDK for the Icone Pay payment service. It validates payloads with `zod` before reaching the API so you get actionable errors early.

### Installation

```bash
npm install icone-pay-sdk zod
```

### Quick Start

```ts
import { IconePaySDK } from "icone-pay-sdk";

const client = new IconePaySDK("YOUR_API_KEY");

// Live mode (default)
const result = await client.initPayment({
  mode: "live", // Optional, defaults to "live"
  action: "checkout",
  successUrl: "https://merchant.app/success",
  cancelUrl: "https://merchant.app/cancel",
  currency: "usd",
  amount: 100,
  referenceId: "INV-001",
  items: [
    {
      name: "T-shirt",
      quantity: 1,
      unitPrice: 100,
    },
  ],
  fees: [
    {
      name: "Processing Fee",
      amount: "4",
      tpye: "percentage"
    },
    {
      name: "Processing Fee 2",
      amount: "10",
      tpye: "fixed"
    }
  ]
});

// Test mode
const testResult = await client.initPayment({
  mode: "test",
  action: "checkout",
  successUrl: "https://merchant.app/success",
  cancelUrl: "https://merchant.app/cancel",
  currency: "usd",
  amount: 100,
  referenceId: "INV-001",
  items: [
    {
      name: "T-shirt",
      quantity: 1,
      unitPrice: 100,
    },
  ],
});

if (result.error) {
  console.error(result.message);
} else {
  console.log("Redirect customer to:", result.url);
}
```

### API

- `new IconePaySDK(apiKey: string, options?: { baseUrl?: string; fetchFn?: typeof fetch })`  
  Creates a client. Supply a custom `fetchFn` if your runtime does not provide `fetch`.

- `initPayment(payload)`  
  Validates `payload` with the `initPaymentSchema` and initiates a payment. The `mode` field in the payload (optional, defaults to `"live"`) determines the endpoint:
  - `mode: "test"`: Uses `/api/test-payment` endpoint for testing
  - `mode: "live"` or omitted: Uses `/init-payment` endpoint for production payments
  Resolves with `{ error, message, url }`.

### Types

`initPaymentSchema`, `InitPaymentParams`, and `InitPaymentResponse` are exported from `src/types`.

