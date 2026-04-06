export interface Element {
  number: number;
  symbol: string;
  name: string;
  atomic_mass: string;
  category: string;
  group: number;
  period: number;
  phase: string;
  summary: string;
  appearance: string | null;
  melt: number | null;
  boil: number | null;
  density: number | null;
  discovered_by: string | null;
  named_by: string | null;
  color: string;
  xpos: number;
  ypos: number;
}

export type ElementCategory = 
  | "diatomic nonmetal"
  | "noble gas"
  | "alkali metal"
  | "alkaline earth metal"
  | "metalloid"
  | "polyatomic nonmetal"
  | "post-transition metal"
  | "transition metal"
  | "lanthanide"
  | "actinide"
  | "unknown";
