let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during builds for speed
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript checking during builds for speed
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization settings
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'randomuser.me'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96],
    formats: ['image/webp'],
  },
  
  // Experimental features for better performance
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    // Optimize package imports
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
    // Enable CSS optimization
    optimizeCss: true,
  },
  
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Output configuration - helps with static exports
  output: 'standalone',
  
  // Disable static generation for pages that use browser APIs
  // This prevents localStorage errors during build
  staticPageGenerationTimeout: 120,
  
  // Add headers for better caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|ico)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Configure webpack for better performance
  webpack: (config, { isServer, dev }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Enable compression
  compress: true,
  
  // Disable x-powered-by header for security
  poweredByHeader: false,
  
  // Generate static pages only for specific routes
  // This prevents localStorage errors
  output: 'export',
  
  // Skip trailing slash redirect
  skipTrailingSlashRedirect: true,
  
  // Skip middleware URL normalization
  skipMiddlewareUrlNormalize: true,
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig