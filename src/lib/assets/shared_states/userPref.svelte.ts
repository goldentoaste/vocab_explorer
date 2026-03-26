export const CreeDialects = [
	"Plains Cree",
	"Swamp Cree",
	"Woods Cree",
	"East Cree",
];

export type CreeDialect = typeof CreeDialects[number];

export const UserPref = $state<{
	format: "SRO" | "Syllabics";
	longVowelRep: "circumflex" | "macrons";
	useDialectMarker: boolean;
	dialect: CreeDialect;
}>({
	format: "Syllabics",
	longVowelRep: "circumflex",
	useDialectMarker: false,
	dialect: "Plains Cree",
});
