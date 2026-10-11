import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The kit ships TypeScript source from the workspace.
  transpilePackages: ["liquid-glass-kit"],
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

export default nextConfig;
