import { GeneralTableBody } from "@/components/TableBody/GeneralTableBody";

export default function Home() {
	return (
		<main>
			<div className="overflow-y-auto h-[calc(100dvh-102px)]">
				<table className="w-full table-fixed border-collapse">
					<thead className="sticky z-50 top-0 bg-white dark:bg-black">
						<tr>
							<th className="w-[80px] text-left p-[4px]">
								勢力
								<br />
								時代
								<br />
								【コスト】
							</th>

							<th className="w-[110px] text-left p-[4px]">
								名前
								<br />
								武力 / 知力
								<br />
								特技
							</th>

							<th className="text-left p-[4px]">
								計略名
								<br />
								効果時間
								<br />
								【必要士気】
								<br />
								説明
							</th>
						</tr>
					</thead>

					<tbody>
						<GeneralTableBody />
					</tbody>
				</table>
			</div>
		</main>
	);
}
