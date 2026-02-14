/** @type {import('next').NextConfig} */

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
  {
    // Content Security Policy - adjust as needed for your app
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline/eval in dev
      "style-src 'self' 'unsafe-inline'", // Tailwind uses inline styles
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  
  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
  },
  
  // Disable x-powered-by header to hide Next.js fingerprint
  poweredByHeader: false,
};

module.exports = nextConfig;
