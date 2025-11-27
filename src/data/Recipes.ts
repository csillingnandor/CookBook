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
  ],
  instructions: [
    "A csirkét megtisztítjuk és feldaraboljuk.",
    "A hagymát apróra vágjuk és üvegesre pirítjuk.",
    "Hozzáadjuk a paprikát, majd a csirkét, fűszerezzük és puhára főzzük.",
    "A végén belekeverjük a tejfölt és még egyszer felforraljuk."
  ]
}
,
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
  },

  /* ÚJ RECEPTEK INNENTŐL -------------------------- */

  {
    id: 4,
    title: "Lasagne",
    description: "Paradicsomos-húsos rakott tészta, olasz módra.",
    image: "https://picsum.photos/300/180?random=4",
    ingredients: [
      { name: "Darálthús", amount: 400, unit: "g" },
      { name: "Paradicsomszósz", amount: 300, unit: "ml" },
      { name: "Lasagne lap", amount: 12, unit: "db" }
    ]
  },

  {
    id: 5,
    title: "Caesar saláta",
    description: "Ropogós saláta csirkével és parmezánnal.",
    image: "https://picsum.photos/300/180?random=5",
    ingredients: [
      { name: "Római saláta", amount: 1, unit: "fej" },
      { name: "Csirkemell", amount: 200, unit: "g" },
      { name: "Parmezán", amount: 30, unit: "g" }
    ]
  },

  {
    id: 6,
    title: "Margherita pizza",
    description: "Olvasztott mozzarella friss bazsalikommal.",
    image: "https://picsum.photos/300/180?random=6",
    ingredients: [
      { name: "Mozzarella", amount: 150, unit: "g" },
      { name: "Paradicsomszósz", amount: 4, unit: "ek" },
      { name: "Bazsalikom", amount: 5, unit: "levél" }
    ]
  },

  {
    id: 7,
    title: "Rántott sajt",
    description: "Klasszikus magyar kedvenc.",
    image: "https://picsum.photos/300/180?random=7",
    ingredients: [
      { name: "Trappista sajt", amount: 4, unit: "szelet" },
      { name: "Zsemlemorzsa", amount: 70, unit: "g" },
      { name: "Tojás", amount: 2, unit: "db" }
    ]
  }
];

