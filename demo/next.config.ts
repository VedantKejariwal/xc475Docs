import type { NextConfig } from "next";

// Tell Turbopack that this standalone demo is the project root. Otherwise a
// parent lockfile on a developer's machine can make it watch their whole home.
const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
};

export default nextConfig;
