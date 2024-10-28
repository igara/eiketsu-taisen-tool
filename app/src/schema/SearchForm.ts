import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const SearchFormSchema = yup.object().shape({
	color: yup.array().of(yup.string()),
	period: yup.array().of(yup.string()),
	appear: yup.array().of(yup.string()),
	cost: yup.array().of(yup.string()),
	unitType: yup.array().of(yup.string()),
	skill: yup.array().of(yup.string()),
	power: yup.array().of(yup.string()),
	intelligentzia: yup.array().of(yup.string()),
	stratCost: yup.array().of(yup.string()),
	stratRange: yup.array().of(yup.string()),
	searchWord: yup.string().trim(),
	favoriteNo: yup.array().of(yup.string()),
	isDisplayFavorite: yup.string<"true">().trim(),
	isDisableSearchForm: yup.string<"true">().trim(),
	isDisableOption: yup.string<"true">().trim(),
});

export type SearchFormData = yup.InferType<typeof SearchFormSchema>;

export const SearchFormResolver = yupResolver(SearchFormSchema);
