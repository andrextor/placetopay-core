# Placetopay Core

[![npm version](https://img.shields.io/badge/npm-1.0.0-blue.svg)](https://www.npmjs.com/)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![typescript](https://img.shields.io/badge/typescript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A lightweight, type-safe, and stateless SDK for integrating Placetopay services across multiple applications. Built with **TypeScript** and **Zod** for robust data validation, ensuring that your integration catches errors before they reach the API.

## Features

- **Framework Agnostic:** Works in Node.js, Bun, and modern browsers.
- **Type-Safe:** Full TypeScript support with auto-generated types and interfaces.
- **Data Validation:** Uses Zod schemas to validate payloads strictly before sending requests.
- **Stateless:** Credentials are provided at instantiation; no hidden global state.
- **Built-in Mocks:** Includes factory utilities to simulate API responses for your own test suites.

## Installation

```bash
npm install placetopay-core
# or
pnpm add placetopay-core
# or
yarn add placetopay-core
```

## Quick Start

Initialize the client with your credentials. You can optionally override the baseUrl for development or testing environments.

```typescript
import { PlacetopayCore } from 'placetopay-core';

const p2p = new PlacetopayCore({
  login: process.env.P2P_LOGIN || 'YOUR_LOGIN',
  secretKey: process.env.P2P_SECRET_KEY || 'YOUR_SECRET_KEY',
  // Optional: defaults to production URL if omitted
  baseUrl: '[https://checkout-test.placetopay.com](https://checkout-test.placetopay.com)' 
});
```

## Services

### 1. WebCheckout (Redirect)

Handle standard redirections for payments.

Create a Session

```typescript
try {
  const session = await p2p.checkout.createSession({
    payer: {
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      document: '123456789',
      documentType: 'CC',
      mobile: '3001234567'
    },
    payment: {
      reference: 'ORDER_12345',
      description: 'Payment for subscription',
      amount: {
        currency: 'COP',
        total: 50000,
      }
    },
    returnUrl: '[https://mysite.com/response/ORDER_12345](https://mysite.com/response/ORDER_12345)',
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0...'
  });

  console.log('Redirect User to:', session.processUrl);
  console.log('Request ID:', session.requestId);
} catch (error) {
  console.error('Validation or API Error:', error);
}
```

Query Session Status

```typescript
const result = await p2p.checkout.getSession(session.requestId);

if (result.status.status === 'APPROVED') {
  console.log('Payment Approved!');
}
```

### 2. Gateway (Direct API)

Process payments directly (TPV/API) without redirection. Ideal for PCI-compliant environments.

Process a Transaction

```typescript
const transaction = await p2p.gateway.process({
  payment: {
    reference: 'Direct_001',
    description: 'Direct charge',
    amount: { currency: 'USD', total: 100 }
  },
  instrument: {
    card: {
      number: '4111111111111111',
      cvv: '123',
      expiration: '12/26',
      installments: 1
    }
  },
  payer: {
    name: 'Jane',
    surname: 'Doe',
    email: 'jane@example.com'
  },
  ipAddress: '127.0.0.1',
  userAgent: 'Mozilla/5.0'
});

console.log('Auth Code:', transaction.authorization);
```

Get Information (Bank List, etc.)

```typescript
const info = await p2p.gateway.information({
  locale: 'es_CO',
  payment: {
    amount: { currency: 'COP', total: 10000 }
  }
});

console.log('Available Banks:', info.bankList);
```

### 3. Payment Links

Create and manage hosted payment links.

Create a Link

```typescript
const link = await p2p.paymentLink.create({
  name: 'Premium Subscription',
  description: 'Valid for 1 month',
  reference: 'SUB-001',
  expirationDate: '2026-12-31 23:59:59',
  paymentExpiration: 60, // Minutes
  payment: {
    amount: { currency: 'COP', total: 25000 }
  },
  locale: 'es'
});

console.log('Send this link to user:', link.url);
```

## Testing & Mocks

One of the strongest features of placetopay-core is the inclusion of typed Mocks. You can use these factories in your own test suite (Jest, Vitest, Mocha) to simulate PlacetoPay responses without making real network requests.

Available Mocks:

- `CheckoutMock`
- `GatewayMock`
- `PaymentLinkMock`
- `StatusMock`

Example: Testing your own Order Service

```typescript
import { CheckoutMock } from 'placetopay-core';
import { myOrderService } from './my-order-service';

// Simulate a successful WebCheckout session creation
const mockResponse = CheckoutMock.createSession({
  requestId: 99999,
  processUrl: '[https://checkout-test.placetopay.com/session/mock/99999](https://checkout-test.placetopay.com/session/mock/99999)'
});

// Use this mock to test your internal logic
const result = myOrderService.handlePaymentResponse(mockResponse);
expect(result.success).toBe(true);
```

Example: Simulating a Rejected Transaction

```typescript
import { GatewayMock } from 'placetopay-core';

// Create a rejected transaction response
const mockRejection = GatewayMock.rejected("Insufficient Funds");

console.log(mockRejection.status.message); // "Insufficient Funds"
console.log(mockRejection.status.reason);  // "51"
```

## Architecture

The SDK is built on three pillars:

1. Schemas (Zod): All inputs are validated against strict schemas before leaving the client. This reduces debugging time by catching invalid types (e.g., missing fields, wrong currency formats) instantly.

2. Services: Logic is separated into domain-specific services (`Checkout`, `Gateway`, `PaymentLink`) that share a common BaseService for HTTP transport.

3. AuthHelper: Automatically handles the WSSE authentication requirements (Nonce, Seed, TranKey) for every request.

## Development

Prerequisites:

- Node.js 20+

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm build
```

## License

This project is licensed under the MIT License.
