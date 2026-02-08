# Placetopay Core

[![npm version](https://img.shields.io/badge/npm-1.0.0-blue.svg)](https://www.npmjs.com/)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![typescript](https://img.shields.io/badge/typescript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A lightweight, type-safe, and stateless SDK for integrating Placetopay services across multiple applications. Built with **TypeScript** and **Zod** for robust data validation.

## Features

- **Framework Agnostic:** Works in Node.js, Bun, and modern browsers.
- **Type-Safe:** Full TypeScript support with auto-generated types.
- **Data Validation:** Uses Zod to validate payloads before sending requests.
- **Stateless:** Credentials are provided at instantiation; no hidden global state.
- **Fluent Interface:** Intuitive and easy-to-use API structure.
- **Modern Build:** Supports both ESM and CommonJS.

## Installation

```bash
npm install placetopay-core
# or
pnpm add placetopay-core
# or
yarn add placetopay-core

## Quick Start

```bash
import { PlacetopayCore } from 'placetopay-core';

// 1. Initialize the client
const p2p = new PlacetopayCore({
  login: process.env.P2P_LOGIN,
  secretKey: process.env.P2P_SECRET_KEY,
  baseUrl: '[https://checkout-test.placetopay.com/api/session](https://checkout-test.placetopay.com/api/session)' // Optional
});

// 2. Create a session (Checkout)
const session = await p2p.checkout.createSession({
  payer: {
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com',
    document: '123456789',
    documentType: 'CC'
  },
  payment: {
    reference: 'ORDER_123',
    description: 'Product Purchase',
    amount: {
      currency: 'COP',
      total: 50000
    }
  },
  returnUrl: '[https://myapp.com/response](https://myapp.com/response)',
  ipAddress: '127.0.0.1',
  userAgent: 'Mozilla/5.0...'
});

console.log(session.processUrl);

```

## Architecture

The package centralizes common logic for all Placetopay APIs:

Authentication: Automatic generation of nonce, seed, and tranKey.

Error Handling: Pre-request validation to catch missing fields early.

## Development

Prerequisites
Node.js 21+
pnpm (recommended)

## License

This project is licensed under the MIT License.
