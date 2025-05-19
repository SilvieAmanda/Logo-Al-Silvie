import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module?.rules?.push({
      test: /gif\.worker\.js$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[hash].[ext]",
          publicPath: "/_next/static/workers/",
          outputPath: "static/workers/",
        },
      },
    });
    return config;
  },
};

export default nextConfig;
