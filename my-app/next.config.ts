import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // allow dev access from the LAN IP (silences the cross-origin warning)
  allowedDevOrigins: ["192.168.18.112"],
};

export default nextConfig;

// Only initialize Cloudflare dev bindings in development — the static
// import + unconditional call that was here before would also run during
// production builds, which could cause side-effects on the build host.
if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare").then(({ initOpenNextCloudflareForDev }) => {
    initOpenNextCloudflareForDev();
  });
}
