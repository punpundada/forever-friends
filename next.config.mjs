/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
		serverComponentsExternalPackages: ["@node-rs/argon2"],
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          pathname: '/**',
          port:"",
        },
      ],
      domains:['images.unsplash.com']
    },
	}
};

export default nextConfig;
