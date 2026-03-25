


export interface CreeWord {
    primaryText: string; // Cree word, in SRO. Using Circumflex long vowels.
    wordType: "Noun" | "Verb"; // this is Cree more of a Noun, or more of a Verb?
    detailedWordType: string; // such as NI-3, VII-2n, NA-1, IPV

    // descriptions are multiple definitions for a word
    // For example, mîcisow (eat) has the following defs
    // 1. s/he eats, s/he has a meal
    // 2. it feeds (e.g. bird)
    // 3. it chews its cud (e.g. ruminant), it grazes
    // 4. s/he has a food supply, s/he subsists
    // 5. s/he has a ritual meal, s/he partakes of a feast
    // 6. You eat.
    // 7. He eats.
    // 8. I had eaten.
    descriptions: string[];

    // Forms of the word, ex (I eat: nimîcison) (we (but not you) eats: ê-mîcisoyâhk)
    morphs: { semantic: string; creeMorph: string }[];


    // not used for now.
    audioKey?: string;

    // public src of related images to this word.
    imageSrc?: string[];
}


export interface EnglishWord {
    primaryText: string; // the literal word
    wordType: "Noun" | "Verb" | "Adjective";

    // list of definition of an English word
    // example, body can mean the following
    // human body
    // body text
    // car part
    descriptions: string[];

    // cree words that are related to meanings of this English word
    creeWords: string[];
}