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

  time?: number;              
  difficulty?: Difficulty;    
  priceLevel?: PriceLevel;    
}

