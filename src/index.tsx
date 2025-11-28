import { render } from 'preact';
import { recipes } from "./data/Recipes";
import { RecipeApp } from "./components/RecipeApp";

import './style.css';


export function App() {
	return <RecipeApp recipes={recipes} />;
}


render(<App />, document.getElementById('app'));
