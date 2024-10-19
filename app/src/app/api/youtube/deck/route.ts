// import { youtubeDeckDB } from "@/app/sqlite/youtube_deck/db";
import { NextResponse } from "next/server";

export async function GET() {
	// const res = await youtubeDeckDB.selectFrom("decks").selectAll().execute();

	// console.log(res);

	return NextResponse.json({
		name: "Mikev",
	});
}
