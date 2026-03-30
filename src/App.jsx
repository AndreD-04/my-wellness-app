import { useState } from 'react'
import './App.css'

function App() {
  const [recipe, setRecipe] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchRecipe = async () => {
    // TheMealDB is free and doesn't require a complex API Key for random lookups
    const url = `https://www.themealdb.com/api/json/v1/1/random.php`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.meals) return;

      const newRecipe = data.meals[0];

      // Mapping TheMealDB attributes to your wellness app categories
      const recipeCuisine = newRecipe.strArea || "International";
      const recipeType = newRecipe.strCategory || "Main Dish";
      // TheMealDB doesn't provide exact minutes, so we'll use a placeholder or skip
      const recipeTag = newRecipe.strTags ? newRecipe.strTags.split(',')[0] : "Healthy";

      // Check if any attribute is in the banList
      const isBanned = banList.includes(recipeCuisine) || 
                       banList.includes(recipeType) || 
                       banList.includes(recipeTag);

      if (isBanned) {
        console.log(`Skipping "${newRecipe.strMeal}" due to ban list.`);
        await fetchRecipe(); 
      } else {
        // We reshape the data slightly so the rest of your app keeps working
        const formattedRecipe = {
          title: newRecipe.strMeal,
          image: newRecipe.strMealThumb,
          cuisine: recipeCuisine,
          type: recipeType,
          tag: recipeTag
        };
        
        setRecipe(formattedRecipe);
        setHistory((prev) => [formattedRecipe, ...prev]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const addToBanList = (attr) => {
    if (attr && !banList.includes(attr)) {
      setBanList([...banList, attr]);
    }
  };

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
              <button key={index} className="ban-item-btn" onClick={() => removeFromBanList(item)}>
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
              <img src={recipe.image} alt={recipe.title} style={{ width: '100%', borderRadius: '10px' }} />
              <div className="attribute-buttons">
                <button onClick={() => addToBanList(recipe.type)}>{recipe.type}</button>
                <button onClick={() => addToBanList(recipe.cuisine)}>{recipe.cuisine}</button>
                <button onClick={() => addToBanList(recipe.tag)}>{recipe.tag}</button>
              </div>
            </div>
          ) : (
            <div className="recipe-card">
              <p>Click discover to start!</p>
            </div>
          )}
          <button className="discover-btn" onClick={fetchRecipe}>Discover!</button>
        </div>

        {/* RIGHT: History */}
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
