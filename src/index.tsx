import { render } from "preact";
import { RecipeApp } from "./components/RecipeApp";
import "./style.css";

// Service Worker regisztráció
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        console.log("Service Worker regisztrálva");
      })
      .catch((err) => {
        console.error("SW regisztráció hiba:", err);
      });
  });
}

export function App() {
  return <RecipeApp />;
}

render(<App />, document.getElementById("app")!);
