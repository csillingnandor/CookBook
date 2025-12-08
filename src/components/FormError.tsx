import "./RecipeForm.css";

interface FormErrorProps {
  message?: string;
}
/**
 * @remarks Egyszerű hibaüzenet megjelenítő komponens űrlapokhoz.
 * @param message A megjelenítendő hibaüzenet
 * @returns 
 */
export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return <div className="form-error">{message}</div>;
};
