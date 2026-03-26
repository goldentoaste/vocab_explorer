
import { creeWords, englishWords } from "$lib/assets/content/itwewinaScrapedDictionary";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "../../$types";

export const load: PageLoad = async ({ params }) => {
    const word = params.word;
    const isCreeWord = word in creeWords;
    if (!( isCreeWord)) {
        return error(
            404,
            `Word "${word}" not found in either Cree dictionaries. Only Cree words are supported in the word map.`,
        );
    }

    return {
        creeWord: creeWords[word]
    };
};
    