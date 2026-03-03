/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

// Security headers configuration
const securityHeaders = [
  {
    // Prevent MIME type sniffing
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Prevent clickjacking by disallowing framing
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    // Enable XSS filter in browsers (legacy, but still useful)
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    // Control referrer information sent with requests
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Only allow HTTPS connections after first visit (1 year)
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    // Restrict what resources/APIs the browser can use
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // Content Security Policy is set dynamically in middleware.ts
  // (nonce-based in production, unsafe-inline/eval in dev for HMR)
];

const nextConfig = {
  reactStrictMode: true,
  
  // Apply security headers to all routes except PDF API (which sets its own)
  async headers() {
    return [
      {
        source: '/((?!api/pdf).*)',
        headers: securityHeaders,
      },
    ];
  },
  
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  
  // Disable x-powered-by header to hide Next.js fingerprint
  poweredByHeader: false,
};

module.exports = withSentryConfig(nextConfig, {
  // ── Sentry Build Options ──────────────────────────────────
  // Suppress noisy source-map upload logs
  silent: !process.env.CI,

  // Upload source maps so stack traces are readable in the dashboard
  widenClientFileUpload: true,

  // Tree-shake Sentry debug code in production
  disableLogger: true,

  // Automatically instrument server components, API routes, and middleware
  autoInstrumentServerFunctions: true,
  autoInstrumentMiddleware: true,
  autoInstrumentAppDirectory: true,
});
