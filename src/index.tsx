import { render } from 'preact';
import { RecipeList } from "./components/RecipeList";
import { recipes } from "./data/Recipes";

import './style.css';


export function App() {
	return (
		<div>
		  <RecipeList recipes={recipes} />
		</div>
	  );
}


render(<App />, document.getElementById('app'));
