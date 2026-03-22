

export interface CreeFormatTransOpt {
    format: "SRO" | "Syllabics";
    longVowelRep: "circumflex" | "macrons"; // Circumflex: angled/carrot, Macrons, flat bar
    useDialectMarker: boolean;
}

/**
 *
 * @param text The base form, using circumflex, no dialect indicator, SRO
 * @param options
 */
export function CreeFormatTranslate(text: string, options: CreeFormatTransOpt) {
    if (options.format === "SRO") {
        if (options.longVowelRep === "macrons") {
            text = circumflexToMacrons(text);
        }
        if (options.useDialectMarker) {
            text = applyDialectMarkers(text);
        }
        return text;
    }

    if (options.format === "Syllabics") {
        text = text.replace('-', ''); // Q: can hyphens be safely dropped?
        return SRO2Syllabic(text);
    }

    return text;
}



const CMTranslations = {
    "î": "ī",
    "â": "ā",
    "ê": "ē",
    "ô": "ō",
}
function circumflexToMacrons(text: string) {
    return translate(text, CMTranslations);
}

const DialectTranslations = {
    "y": "ý"
}
function applyDialectMarkers(text: string) {
    return translate(text, DialectTranslations)
}

function translate(text: string, translation: Record<string, string>) {
    // https://stackoverflow.com/a/15604206/12471420
    let re = new RegExp(Object.keys(translation).join("|"), "gi");

    return text.replace(re, (sub) => {
        return translation[sub];
    })
}



/**
 * translate SRO to cree syllabics, using references from
 * https://resources.atlas-ling.ca/media//Plains-Cree-Syllabic-Chart-Basic.pdf
 * https://resources.atlas-ling.ca/media/Syllabic_Chart_Swampy-Cree_N-dialect-1.pdf
 *
 *
 * Logics used for conversion:
 * 0. Convert 1 syllable at a time.
 * 1. Find prefix, consume as many non-vowel character as possible.
 * 2. Vowel is always a single char.
 * 3. Combine prefix and vowel to look up in conversion table.
 *      + if no match, just return SRO as is.
 * 4. Finals, Consume as many chars as possible, as long as they are in finals table still.
 * 5. Join all syllables
 */
function SRO2Syllabic(sro: string) {
    // currently the system supports only to Plains Cree, but can be converted to other dialects.
    // assumptions made about the language seems to hold, from sampling few other dialects.

    let idx = 0;
    let length = sro.length;

    const out: string[] = [];

    while (idx < length) {
        let start = idx;


        // match until not a vowel
        while (idx < length && !vowels.has(sro[idx])) {
            idx += 1;
        }

        // if (idx === length) {
        //     // this is unexpected, the given string probably has syntax error.
        //     out.push(sro.slice(start, idx));
        //     break; // so lets return as is.
        // }

        if (idx !== length) {
            idx += 1;
        }


        // now, we have any number of consonances, and maybe end with vowel
        // lets try to check for finals and consume as many of them as possible
        // note that the range we are processing is always [start, idx), ending exclusive.
        while (start < idx) {
            const textInRange = sro.slice(start, idx);

            if (conversionTable.has(textInRange)) {
                // the chars in range is a valid, we are done
                out.push(conversionTable.get(textInRange) ?? textInRange);
                break;
            }

            // text is not a match yet, lets try matching finals at the beginning
            for (let i = maxFinalPrefixLength; i >= 1; i--) {
                if (start + i > length) {
                    continue;
                }

                const finalMatch = finals.get(sro.slice(start, start + i));
                if (finalMatch) {
                    out.push(finalMatch);
                    start += i;
                    break;
                }
            }

            out.push(sro[start]);
        }





        // start = idx;
        // // now, consume as many as possible to get final.
        // while (idx < length && finals.has(sro.slice(start, idx + 1))) {
        //     idx += 1;
        // }

        // // now 2 final cases
        // // idx = start => do nothing, no final match

        // // idx > start => [start, idx) matches a finals
        // if (idx > start) {
        //     syllabic += finals.get(sro.slice(start, idx)) ?? sro.slice(start, idx);
        // }

        // done! Fully consumed a syllable.
    }
    return out.join("");
}



const vowels = new Set([
    "ê", "i", "î", "o", "ô", "a", "â"
]);

const finals = new Map<string, string>([
    // https://www.compart.com/en/unicode/block/U+1400
    // https://en.wikipedia.org/wiki/List_of_Unicode_characters
    // note these chars are taken from the "Unified Canadian Aboriginal Syllabics"
    // unicode block, not to be confused with other similar looking unicode.
    ['w', 'ᐤ'],
    ['p', 'ᑊ'],
    ['t', 'ᐟ'],
    ['k', 'ᐠ'],
    ['c', 'ᐨ'],
    ['m', 'ᑦ'],
    ['n', 'ᐣ'],
    ['s', 'ᐢ'],
    ['y', 'ᕀ'],
    ['l', 'ᓫ'],
    ['r', 'ᕑ'],
    ['h', 'ᐦ'],
    ['hk', 'ᕽ']
]);

const maxFinalPrefixLength = Math.max(...(finals.keys().map(key => parseInt(key.length))));

const conversionTable = new Map<string, string>([
    // vowels
    ['ê', 'ᐁ'],
    ['i', 'ᐃ'],
    ['î', 'ᐄ'],
    ['o', 'ᐅ'],
    ['ô', 'ᐆ'],
    ['a', 'ᐊ'],
    ['â', 'ᐋ'],

    // W prefix
    ['wê', 'ᐍ'],
    ['wi', 'ᐏ'],
    ['wî', 'ᐑ'],
    ['wo', 'ᐓ'],
    ['wô', 'ᐕ'],
    ['wa', 'ᐗ'],
    ['wâ', 'ᐙ'],

    // P prefix
    ['pê', 'ᐯ'],
    ['pi', 'ᐱ'],
    ['pî', 'ᐲ'],
    ['po', 'ᐳ'],
    ['pô', 'ᐴ'],
    ['pa', 'ᐸ'],
    ['pâ', 'ᐹ'],

    // T prefix
    ['tê', 'ᑌ'],
    ['ti', 'ᑎ'],
    ['tî', 'ᑏ'],
    ['to', 'ᑐ'],
    ['tô', 'ᑑ'],
    ['ta', 'ᑕ'],
    ['tâ', 'ᑖ'],

    // K prefix
    ['kê', 'ᑫ'],
    ['ki', 'ᑭ'],
    ['kî', 'ᑮ'],
    ['ko', 'ᑯ'],
    ['kô', 'ᑰ'],
    ['ka', 'ᑲ'],
    ['kâ', 'ᑳ'],
    ['kwê', 'ᑵ'], // note, unique to plains cree, exception to the pattern

    // C prefix
    ['cê', 'ᒉ'],
    ['ci', 'ᒋ'],
    ['cî', 'ᒌ'],
    ['co', 'ᒍ'],
    ['cô', 'ᒎ'],
    ['ca', 'ᒐ'],
    ['câ', 'ᒑ'],

    // M prefix
    ['mê', 'ᒣ'],
    ['mi', 'ᒥ'],
    ['mî', 'ᒌ'],
    ['mo', 'ᒧ'],
    ['mô', 'ᒨ'],
    ['ma', 'ᒪ'],
    ['mâ', 'ᒫ'],

    // n prefix
    ['nê', 'ᓀ'],
    ['ni', 'ᓂ'],
    ['nî', 'ᓃ'],
    ['no', 'ᓄ'],
    ['nô', 'ᓅ'],
    ['na', 'ᓇ'],
    ['nâ', 'ᓈ'],

    // s prefix
    ['sê', 'ᓭ'],
    ['si', 'ᓯ'],
    ['sî', 'ᓰ'],
    ['so', 'ᓱ'],
    ['sô', 'ᓲ'],
    ['sa', 'ᓴ'],
    ['sâ', 'ᓵ'],

    // y prefix
    ['yê', 'ᔦ'],
    ['yi', 'ᔨ'],
    ['yî', 'ᔩ'],
    ['yo', 'ᔪ'],
    ['yô', 'ᔫ'],
    ['ya', 'ᔭ'],
    ['yâ', 'ᔮ'],

])