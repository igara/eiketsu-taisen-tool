import { youtubeDeckDB } from "@/sqlite/youtube_deck/node_db";
import { NextResponse } from "next/server";

export async function GET() {
	const res = await youtubeDeckDB.selectFrom("decks").selectAll().execute();

	return NextResponse.json(res);
}
