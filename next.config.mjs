/** @type {import('next').NextConfig} */
const nextConfig = {
  // We rely on `tsc`/the type checker during build but skip eslint to avoid
  // failing the Vercel build on style nits.
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

export default nextConfig;
