import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
		remotePatterns: [
			{ protocol: "https", hostname: "l6npf9rjvqqf6owa.public.blob.vercel-storage.com", pathname: "/**" },
		],
	},
};

export default nextConfig;
