import { Recipe } from "../types/Recipe";

export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Paprikás csirke",
    description: "Klasszikus magyar étel tejföllel.",
    image: "https://picsum.photos/300/180?random=1",
    ingredients: [
      { name: "Csirke", amount: 1, unit: "kg" },
      { name: "Paprika", amount: 2, unit: "db" },
      { name: "Hagyma", amount: 1, unit: "db" }
    ]
  },
  {
    id: 2,
    title: "Gulyásleves",
    description: "Híres magyar leves sok hússal.",
    image: "https://picsum.photos/300/180?random=2",
    ingredients: [
      { name: "Marhahús", amount: 500, unit: "g" },
      { name: "Burgonya", amount: 3, unit: "db" },
      { name: "Sárgarépa", amount: 2, unit: "db" }
    ]
  },
  {
    id: 3,
    title: "Palacsinta",
    description: "Egyszerű és gyors desszert.",
    image: "https://picsum.photos/300/180?random=3",
    ingredients: [
      { name: "Liszt", amount: 250, unit: "g" },
      { name: "Tej", amount: 300, unit: "ml" },
      { name: "Tojás", amount: 2, unit: "db" }
    ]
  }
];
