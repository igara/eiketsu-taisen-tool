/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	// distDir: 'dist'
	trailingSlash: true,
	experimental: {
		typedRoutes: true,
	},
	basePath: "/eiketsu-taisen-tool",
	images: {
		unoptimized: true,
	},
	webpack: (config, { isServer, dev }) => {
		config.resolve.fallback = { fs: false };

		config.output.webassemblyModuleFilename =
			isServer && !dev
				? "../static/wasm/[modulehash].wasm"
				: "static/wasm/[modulehash].wasm";

		config.experiments = {
			...config.experiments,
			asyncWebAssembly: true,
			syncWebAssembly: true,
			layers: true,
		};

		config.module.rules.push({
			test: /.*\.wasm$/,
			type: "asset/resource",
			generator: {
				filename: "static/wasm/[name].[contenthash][ext]",
			},
		});

		return config;
	},
};

export default nextConfig;
