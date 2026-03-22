export const UserPref = $state<{
    format: "SRO" | "Syllabics",
    longVowelRep: "circumflex" | "macrons",
    useDialectMarker: boolean
}>({
    format: "Syllabics",
    longVowelRep: "circumflex",
    useDialectMarker: false
})