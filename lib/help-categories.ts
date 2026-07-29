export type HelpCategory =
  | "adomany"
  | "csapat"
  | "gyujtes"
  | "ideiglenes"
  | "setaltatas"
  | "diak";

export const HELP_CATEGORIES: { value: HelpCategory; label: string }[] = [
  { value: "adomany", label: "Adományozás / kérdésem van" },
  { value: "csapat", label: "Legyél része a csapatnak (önkéntesség)" },
  { value: "gyujtes", label: "Szervezz gyűjtést" },
  { value: "ideiglenes", label: "Vállalj ideiglenes befogadást" },
  { value: "setaltatas", label: "Sétáltass" },
  { value: "diak", label: "Diákoknak (közösségi szolgálat)" },
];
