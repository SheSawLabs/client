import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // ChunkLoadError 방지를 위한 설정
  experimental: {
    optimizePackageImports: ["@tanstack/react-query"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "cdn.fastcampus.co.kr",
      },
    ],
    unoptimized: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "/styles")],
    prependData: `@import "/styles/utils/_variable.scss"; @import "/styles/utils/_mixin.scss";`,
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: {
        loader: "@svgr/webpack",
        options: {
          svgoConfig: {
            plugins: [
              {
                name: "removeViewBox",
                active: false,
              },
            ],
          },
        },
      },
    });

    // ChunkLoadError 방지를 위한 webpack 최적화
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            // 공통 라이브러리들을 안정적인 청크로 분리
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              chunks: 'all',
              enforce: true,
            },
            // React Query를 별도 청크로 분리
            reactQuery: {
              test: /[\\/]node_modules[\\/]@tanstack[\\/]react-query/,
              name: 'react-query',
              priority: 20,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      };

      // 런타임 청크를 안정적으로 유지
      config.optimization.runtimeChunk = {
        name: 'runtime',
      };
    }

    config.externals = [...config.externals, "canvas", "jsdom"];
    return config;
  },
};

export default nextConfig;
