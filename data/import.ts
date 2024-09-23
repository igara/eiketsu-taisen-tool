import fs from "node:fs";

const main = async () => {
	const result = await fetch("https://eiketsu-taisen.net/datalist/api/base");
	const json = await result.json();
	fs.writeFileSync("base.json", JSON.stringify(json, null, 2));
};
main();
