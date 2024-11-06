declare module "*.wasm" {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const value: any;
	export default value;
}

declare module "*?url" {
	const src: string;
	export default src;
}
