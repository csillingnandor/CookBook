import { Ingredient } from "./Ingredient";

export type Difficulty = "könnyű" | "közepes" | "nehéz";
export type PriceLevel = "olcsó" | "megfizethető" | "drága";


export interface Recipe {
  id: number;
  title: string;
  description: string;
  image?: string;

  ingredients: Ingredient[];
  instructions: string[];

  category: string;

  // ÚJ ADATOK
  time?: number;              // percekben, pl. 45
  difficulty?: Difficulty;    // "könnyű" | "közepes" | "nehéz"
  priceLevel?: PriceLevel;    // "olcsó" | "megfizethető" | "drága"
}

