import { Recipe } from "../types/Recipe";
import { InstructionCard } from "./InstructionCard";
import "./InstructionList.css";

interface InstructionListProps {
  recipe: Recipe | null;
}

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
