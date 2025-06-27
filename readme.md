# Natours application

Built using Node.js, Express, mongoDB, mongoose

## 🚀 Key Features

- **Stripe Integration & Webhooks**

  - Secure online payments with Stripe Checkout.
  - Automated, real-time payment verification and booking updates via Stripe webhooks.

- **Redis Caching fpr Promotion Service**

  - Handles high-traffic promo campaigns with fast, atomic in-memory operations.
  - Prevents MongoDB bottlenecks and ensures accurate, real-time promo code validation.

- **Centralized Error Handling**

  - Robust error management using custom `AppError` and `catchAsync` utilities.
  - Differentiates between operational and programming errors for clear, secure responses in both development and production.
  - Ensures consistent, maintainable, and user-friendly error handling across the entire app.

- **Authentication with JWT in Cookies**

  - Secure user authentication using JWT tokens stored in HTTP-only cookies.
  - Protects routes and ensures only authorized users can access sensitive features.

- **Basic Automated Testing**
  - Using Jest to test backend logic and APIs.
  - Selenium-based tests for end-to-end user flows.

---
