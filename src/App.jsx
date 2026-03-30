import { useState } from 'react'
import './App.css'

function App() {
  const [recipe, setRecipe] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]); // STRETCH: History state
  
  const API_KEY = '3b6ec44bc4a041a3afbb1c34a2be82f8'; 

  const fetchRecipe = async () => {
    const url = `https://api.spoonacular.com/recipes/random?number=1&apiKey=${API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      const newRecipe = data.recipes[0];

      // Prepare attributes for checking
      const recipeCuisine = newRecipe.cuisines[0] || "Healthy";
      const recipeType = newRecipe.dishTypes[0] || "Main Dish";
      const recipeTime = `${newRecipe.readyInMinutes} min`;

      // REQUIRED: Check if any attribute is in the banList
      const isBanned = banList.includes(recipeCuisine) || 
                       banList.includes(recipeType) || 
                       banList.includes(recipeTime);

      if (isBanned) {
        console.log("Banned item detected, retrying...");
        fetchRecipe(); 
      } else {
        setRecipe(newRecipe);
        // STRETCH: Add to history
        setHistory((prev) => [newRecipe, ...prev]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addToBanList = (attr) => {
    if (attr && !banList.includes(attr)) {
      setBanList([...banList, attr]);
    }
  };

  // REQUIRED: Function to remove from ban list when clicked
  const removeFromBanList = (attr) => {
    setBanList(banList.filter((item) => item !== attr));
  };

  return (
    <div className="App">
      <h1>Veni Vici: Wellness Discovery</h1>
      
      <div className="container">
        {/* LEFT: Ban List */}
        <div className="sidebar">
          <h3>Banned Attributes</h3>
          <p className="hint">Click to unban</p>
          <div className="ban-list">
            {banList.map((item, index) => (
              <button key={index} onClick={() => removeFromBanList(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* MIDDLE: Discovery Area */}
        <div className="main-view">
          {recipe ? (
            <div className="recipe-card">
              <h2>{recipe.title}</h2>
              <img src={recipe.image} alt={recipe.title} />
              <div className="attribute-buttons">
                <button onClick={() => addToBanList(recipe.dishTypes[0])}>{recipe.dishTypes[0]}</button>
                <button onClick={() => addToBanList(recipe.cuisines[0] || "Healthy")}>{recipe.cuisines[0] || "Healthy"}</button>
                <button onClick={() => addToBanList(`${recipe.readyInMinutes} min`)}>{recipe.readyInMinutes} min</button>
              </div>
            </div>
          ) : (
            <div className="recipe-card">
              <p>Click discover to start!</p>
            </div>
          )}
          <button className="discover-btn" onClick={fetchRecipe}>Discover!</button>
        </div>

        {/* RIGHT: History (Stretch Feature) */}
        <div className="history-sidebar">
          <h3>History</h3>
          <div className="history-list">
            {history.map((item, index) => (
              <div key={index} className="history-item">
                <img src={item.image} width="50" alt="history" />
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;