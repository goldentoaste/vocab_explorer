
import { creeWords, englishWords } from "$lib/assets/content/itwewinaScrapedDictionary";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
	const word = params.word;
	const isEnglishWord = word in englishWords;
	const isCreeWord = word in creeWords;
	if (!(isEnglishWord || isCreeWord)) {
		return error(
			404,
			`Word "${word}" not found in either English or Cree dictionaries.`,
		);
	}

	return {
		wordType: isEnglishWord ? "english" : "cree",
		engWord: englishWords[word],
		creeWord: creeWords[word]
	};
};
