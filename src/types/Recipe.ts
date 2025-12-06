import { Ingredient } from "./Ingredient";
import { Difficulty, PriceLevel } from "./recipeMeta";




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

