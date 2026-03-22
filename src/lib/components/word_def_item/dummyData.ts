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



export const seeDefinitions: WordDef[] = [
    {
        primaryText: "wâpiw",
        wordType: "Verb",
        descriptions: ["He/she sees", "He/she has eyesight", "He/she can see"],
        detailWord_Ling: "VAI (Verb Animate Intransitive)",
        morphs: [
            { description: "root for sight/light", word: "wâpi-" },
            { description: "3rd person singular suffix", word: "-w" }
        ],
        audioKey: "wapiw_01"
    },
    {
        primaryText: "wâpahtam",
        wordType: "Verb",
        descriptions: ["He/she sees it (inanimate)", "Looking at a book, a house, or the weather"],
        detailWord_Ling: "VTI (Verb Transitive Inanimate)",
        morphs: [
            { description: "root for sight", word: "wâpa-" },
            { description: "inanimate transitive final", word: "-ht" },
            { description: "3rd person singular", word: "-am" }
        ],
        audioKey: "wapahtam_01"
    },
    {
        primaryText: "wâpamêw",
        wordType: "Verb",
        descriptions: ["He/she sees him/her (animate)", "Looking at a person, an animal, or the sun"],
        detailWord_Ling: "VTA (Verb Transitive Animate)",
        morphs: [
            { description: "root for sight", word: "wâpa-" },
            { description: "animate transitive final", word: "-m" },
            { description: "3rd person animate object suffix", word: "-êw" }
        ],
        audioKey: "wapamew_01"
    }
];