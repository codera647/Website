import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // allow dev access from the LAN IP (silences the cross-origin warning)
  allowedDevOrigins: ["192.168.18.112"],
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
