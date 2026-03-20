import type { WordDef } from "$lib/components/word_def_item/WordDefinitionItem.svelte";

export const testCreeWordDef: WordDef = {
    primaryText: "nipâw",
    alterativeText: "ᓂᐹᐤ",
    wordType: "Verb",
    descriptions: [
        "He or she sleeps sleeps sleeps sleeps sleeps sleeps",
        "He or she is sleeping"
    ],
    // If your app supports French or another secondary language for definitions:
    alternativeDescription: [
        "Il ou elle dort"
    ],
    detailWord_Ling: "VAI (Verb Animate Intransitive)",
    morphs: [
        { description: "Verb stem (to sleep)", word: "nipâ-" },
        { description: "3rd person singular suffix", word: "-w" }
    ],
    alternativeMorphs: [
        { description: "Verb stem (to sleep)", word: "ᓂᐹ-" },
        { description: "3rd person singular indicative suffix", word: "-ᐤ" }
    ],
    audioKey: "cree_nipaw_01",
    imageSrc: [
        "/assets/images/verbs/sleeping.jpg"
    ]
};