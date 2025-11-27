import "./InstructionCard.css";

interface InstructionCardProps {
  index: number;
  text: string;
}

export const InstructionCard = ({ index, text }: InstructionCardProps) => {
  return (
    <div className="instruction-card">
      <div className="instruction-card__step">Lépés {index + 1}</div>
      <p className="instruction-card__text">{text}</p>
    </div>
  );
};
