import { Recipe } from "../types/Recipe";
import { InstructionCard } from "./InstructionCard";
import "./InstructionList.css";

interface InstructionListProps {
  recipe: Recipe | null;
}

/**
 * @remarks Elkészítési lépések listája komponens, amely megjeleníti egy recept elkészítési lépéseit.
 * @param recipe A recept objektum, amely tartalmazza az elkészítési lépéseket
 * @returns 
 */

export const InstructionList = ({ recipe }: InstructionListProps) => {
  if (!recipe || !recipe.instructions || recipe.instructions.length === 0) {
    return null;
  }

  return (
    <div className="instruction-list">
      <h2>Elkészítés</h2>
      <div className="instruction-list__items">
        {recipe.instructions.map((text, idx) => (
          <InstructionCard key={idx} index={idx} text={text} />
        ))}
      </div>
    </div>
  );
};
