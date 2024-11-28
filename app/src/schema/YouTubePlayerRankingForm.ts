import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import * as yup from "yup";

export const YouTubePlayerRankingFormSchema = yup.object().shape({
	date_from: yup
		.string()
		.required("日付は必須です")
		.matches(/^\d{4}-\d{2}-\d{2}$/, "正しい日付形式で入力してください")
		.test("isValidDate", "無効な日付です", (value) => {
			return dayjs(value).isValid();
		})
		.test(
			"isThanOrEqual2022_03_11",
			"2022年3月11日以降の日付を選択してください",
			(value) => {
				return dayjs(value) >= dayjs("2022-03-11");
			},
		),
	date_to: yup
		.string()
		.required("日付は必須です")
		.matches(/^\d{4}-\d{2}-\d{2}$/, "正しい日付形式で入力してください")
		.test("isValidDate", "無効な日付です", (value) => {
			return dayjs(value).isValid();
		})
		.test("isNotFuture", "未来の日付は選択できません", (value) => {
			return dayjs(value) <= dayjs();
		}),
	player_name: yup.string().optional(),
});

export type YouTubePlayerRankingFormData = yup.InferType<
	typeof YouTubePlayerRankingFormSchema
>;

export const YouTubePlayerRankingFormResolver = yupResolver(
	YouTubePlayerRankingFormSchema,
);
