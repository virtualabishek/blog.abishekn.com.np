---
slug: esewa-vs-khalti-secure-payment-flow-nepal
title: "eSewa vs Khalti: how I keep Nepali payments honest"
authors: [virtualabishek]
date: "2026-01-06"
description: " Explore the mostly used online payment gateways of Nepal: Esewa and Khalti and learned that anyone can change the payment amount in the browser. If we rely on that number, someone can buy a Rs 1000 item for Rs 1. Here is how I keep things honest with eSewa and Khalti."
tags: [technical, security, backend, payments]
---

I explored the mostly used online payment gateways of Nepal: Esewa and Khalti and learned that anyone can change the payment amount in the browser. If we rely on that number, someone can buy a Rs 1000 item for Rs 1. Here is how I keep things honest with eSewa and Khalti.

## Why the paranoia?

Browsers are editable. Inputs can be changed, scripts can be rerun, URLs can be faked. The only place that should decide whether money actually moved is your backend, not the page.

## eSewa: signed forms with HMAC

- eSewa V2 gives you a secret key. You build a small string that includes the amount, product id, and that secret, then hash it with HMAC-SHA256.
- You post the amount plus that signature to eSewa. On their side, they recompute the same hash. If it matches, the request is legit; if a user tampered with the amount, it fails.
- After payment, eSewa redirects back with Base64 encoded JSON. I decode it, recompute the signature with my secret, and only then mark the order as paid. Anything that fails this check is logged and rejected.

## Khalti: server-to-server with a pidx

- Khalti V2 is more API-first. My backend calls their API with `Authorization: Key <secret>` and the amount in paisa. Khalti responds with a `pidx` and a redirect URL.
- The user pays on Khalti. When they come back with `?pidx=...`, I do not trust that alone. I call Khalti again and ask, "What is the status of this pidx?" Only their response flips the order to PAID.

## Quick comparison

| What | eSewa (V2) | Khalti (V2) |
| --- | --- | --- |
| Setup | HTML form + signature | Backend API call |
| Trust anchor | HMAC-SHA256 signature | Bearer token + pidx lookup |
| Final check | Recompute signature locally | Ask Khalti server for status |

## What I actually do in code

1. When a user clicks Checkout, I fetch the merchant keys from a safe store (vault/env) and never expose them to the frontend.
2. For eSewa, I sign the payload with HMAC-SHA256 before redirecting; on callback I decode, re-sign, and compare.
3. For Khalti, I create the `pidx` server-side, redirect the user, and on callback I immediately call Khalti's verify endpoint.
4. Only after these checks do I update the order to PAID. Anything mismatched becomes an audit log entry.

## Takeaways

- Never trust frontend amounts or statuses.
- Keep secrets off the browser; everything sensitive happens on the backend.
- Always verify after redirect: re-sign for eSewa, lookup for Khalti. Those two steps have saved me from fake Rs 1 checkouts.

