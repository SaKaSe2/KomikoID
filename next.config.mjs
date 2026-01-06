/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // Image optimization - optimized for mobile
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '*.komiko.id',
        pathname: '/storage/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Mobile-first device sizes
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Lower quality for faster loading on mobile
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Enable SWC minification
  swcMinify: true,

  // Reduce bundle size
  modularizeImports: {
    'lodash': {
      transform: 'lodash/{{member}}',
    },
  },

  // API Rewrites for development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },

  // Comprehensive security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy (disable unused features)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: http://localhost:8000 https://*.komiko.id; connect-src 'self' http://localhost:8000 https://*.komiko.id;",
          },
        ],
      },
    ];
  },

  // Experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['react-icons', 'lodash'],
  },
};

export default nextConfig;

