import type { WordDef } from "$lib/components/word_def_item/WordDefinitionItem.svelte";

export const testCreeWordDef: WordDef = {
    primaryText: "nipâw",

    wordType: "Verb",
    descriptions: [
        "He or she sleeps sleeps sleeps sleeps sleeps sleeps",
        "He or she is sleeping"
    ],
    // If your app supports French or another secondary language for definitions:

    detailWord_Ling: "VAI (Verb Animate Intransitive)",
    morphs: [
        { description: "Verb stem (to sleep)", word: "kinipân" },
        { description: "3rd person singular suffix", word: "ê-nipâyâhk" }
    ],

    audioKey: "cree_nipaw_01",
    imageSrc: [
        "/assets/images/verbs/sleeping.jpg"
    ]
};