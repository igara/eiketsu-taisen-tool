import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const YouTubeCardRankingFormSchema = yup.object().shape({
	date_from: yup.date().required(),
	date_to: yup.date().required(),
	general_name: yup.string().optional(),
});

export type YouTubeCardRankingFormData = yup.InferType<
	typeof YouTubeCardRankingFormSchema
>;

export const YouTubeCardRankingFormResolver = yupResolver(
	YouTubeCardRankingFormSchema,
);
