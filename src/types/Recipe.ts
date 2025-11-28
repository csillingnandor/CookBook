import { Ingredient } from "./Ingredient";

export interface Recipe {
  id: number;
  title: string;
  description: string;
  image?: string;
  ingredients: Ingredient[];
  instructions?: string[];
  category?: string;   
}
