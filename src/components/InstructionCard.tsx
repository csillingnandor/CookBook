import "./InstructionCard.css";

interface InstructionCardProps {
  index: number;
  text: string;
}
/**
 * @remarks Elkészítési lépés kártya komponens, amely megjeleníti a lépés számát és a hozzá tartozó szöveget.
 * @param index a lépés indexe
 * @param text a lépés szövege
 * @returns 
 */
export const InstructionCard = ({ index, text }: InstructionCardProps) => {
  return (
    <div className="instruction-card">
      <div className="instruction-card__step">Lépés {index + 1}</div>
      <p className="instruction-card__text">{text}</p>
    </div>
  );
};
