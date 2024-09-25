/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	// distDir: 'dist'
	trailingSlash: true,
	experimental: {
		typedRoutes: true,
	},
};

export default nextConfig;
