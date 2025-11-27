import { Ingredient } from "./Ingredient";

export interface Recipe {
  id: number;
  title: string;
  description: string;
  image?: string;
  ingredients: Ingredient[];

  // ÚJ: opcionális elkészítési lépések
  instructions?: string[];
}
