import { render } from 'preact';

import { RecipeApp } from "./components/RecipeApp";

import './style.css';


export function App() {
	return <RecipeApp />;
}


render(<App />, document.getElementById('app'));
