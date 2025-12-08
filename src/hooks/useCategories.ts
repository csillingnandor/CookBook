import { useEffect, useState } from "preact/hooks";

const CATEGORIES_STORAGE_KEY = "receptkonyv_categories";
const SELECTED_CATEGORY_KEY = "receptkonyv_selectedCategory";

// A "Összes" nem kerül a localStorage-be, csak logikai default
const ALL_CATEGORY_NAME = "Összes";

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(ALL_CATEGORY_NAME);

  // kategóriák + kiválasztott kategória betöltése
  useEffect(() => {
    let loadedCategories: string[] = [];

    const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (storedCategories) {
      try {
        loadedCategories = JSON.parse(storedCategories) as string[];
        setCategories(loadedCategories);
      } catch {
        loadedCategories = [];
        setCategories([]);
      }
    } else {
      setCategories([]);
    }

    const storedSelected = localStorage.getItem(SELECTED_CATEGORY_KEY);

    if (
      storedSelected &&
      (storedSelected === ALL_CATEGORY_NAME ||
        loadedCategories.includes(storedSelected))
    ) {
      setSelectedCategory(storedSelected);
    } else {
      setSelectedCategory(ALL_CATEGORY_NAME);
    }
  }, []);

  // kategóriák mentése
  useEffect(() => {
    localStorage.setItem(
      CATEGORIES_STORAGE_KEY,
      JSON.stringify(categories)
    );

    // ha a jelenlegi selectedCategory már nem létezik a listában,
    // tegyük vissza "Összes"-re és mentsük
    if (
      selectedCategory !== ALL_CATEGORY_NAME &&
      !categories.includes(selectedCategory)
    ) {
      setSelectedCategory(ALL_CATEGORY_NAME);
      localStorage.setItem(SELECTED_CATEGORY_KEY, ALL_CATEGORY_NAME);
    }
  }, [categories, selectedCategory]);

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setCategories((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );
  };

  const selectCategory = (name: string) => {
    setSelectedCategory(name);
    localStorage.setItem(SELECTED_CATEGORY_KEY, name);
  };

  const deleteCategory = (name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
  };


  return {
    categories,        
    selectedCategory,  
    addCategory,
    selectCategory,
    deleteCategory,
    ALL_CATEGORY_NAME,
  };
}
