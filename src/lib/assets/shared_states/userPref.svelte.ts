import { onMount, untrack } from "svelte";

export const CreeDialects = [
	"Plains Cree",
	"Swamp Cree",
	"Woods Cree",
	"East Cree",
];

export type CreeDialect = typeof CreeDialects[number];

export const UserPref = $state<{
	format: "SRO" | "Syllabics";
	longVowelRep: "Circumflex" | "Macrons";
	useDialectMarker: boolean;
	dialect: CreeDialect;
}>({
	format: "Syllabics",
	longVowelRep: "Circumflex",
	useDialectMarker: false,
	dialect: "Plains Cree",
});


$effect.root(() => {
	$effect(() => {
		const local = localStorage.getItem("userPref");
		if (local) {
			try {
				const parsed = JSON.parse(local);
				untrack(() => {
					Object.assign(UserPref, parsed);
				})
			} catch (e) {
				console.error("Failed to parse user preferences from localStorage", e);
			}
		}
	});

	$effect(() => {
		localStorage.setItem("userPref", JSON.stringify(UserPref));
	});
})