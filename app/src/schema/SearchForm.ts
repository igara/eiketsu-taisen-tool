import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const SearchFormSchema = yup.object().shape({
	color: yup.array().of(yup.string()),
	period: yup.array().of(yup.string()),
	cost: yup.array().of(yup.string()),
	unitType: yup.array().of(yup.string()),
	skill: yup.array().of(yup.string()),
	stratRange: yup.array().of(yup.string()),
	searchWord: yup.string().trim(),
	favoriteNo: yup.array().of(yup.string()),
	isFavorite: yup.string<"true">().trim(),
});

export type SearchFormData = yup.InferType<typeof SearchFormSchema>;

export const SearchFormResolver = yupResolver(SearchFormSchema);
