/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	// distDir: 'dist'
	trailingSlash: true,
	experimental: {
		typedRoutes: true,
	},
	basePath: "/eiketsu-taisen-tool",
};

export default nextConfig;
