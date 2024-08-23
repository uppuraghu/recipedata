// Rep.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import AddedRecipes from "./x";

const Rep = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [page, setPage] = useState(1);
  const [addedRecipes, setAddedRecipes] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const recipesPerPage = 8;

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const response = await axios.get("https://dummyjson.com/recipes");
    setRecipes(response.data.recipes);
  };

  const searchHandler = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayPage = (pageNum) => {
    if (pageNum > 0 && pageNum <= Math.ceil(filteredRecipes.length / recipesPerPage)) {
      setPage(pageNum);
    }
  };

  const addRecipe = (recipe) => {
    if (!addedRecipes.some((r) => r.id === recipe.id)) {
      setAddedRecipes([...addedRecipes, recipe]);
    }
  };

  const removeRecipe = (id) => {
    setAddedRecipes(addedRecipes.filter((recipe) => recipe.id !== id));
  };

  const RecipeDetails = ({ recipe }) => (
    <div className="recipe-details">
      <h3>Ingredients:</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3>Instructions:</h3>
      <ul>
        {recipe.instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ul>
      <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setSelectedRecipe(null)}>Close</button>
    </div>
  );

  const paginatedRecipes = filteredRecipes.slice(
    (page - 1) * recipesPerPage,
    page * recipesPerPage
  );

  return (
    <div className="recipe-container">
      <h1>PERK UP CAFE</h1><br/>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={searchHandler}
        className="search-input"
      />
      <button
        className="bg-purple-500 text-white px-4 py-2 rounded"
        onClick={() => setShowCart(!showCart)}
      >
        {showCart ? "Hide Cart" : "Show Cart"}
      </button>
      {showCart && <AddedRecipes addedRecipes={addedRecipes} removeRecipe={removeRecipe} />}
      <div className="recipes-grid">
        {paginatedRecipes.map((eachrecipe) => (
          <div key={eachrecipe.id} className="recipe-card">
            <img
              src={eachrecipe.image}
              height={220}
              width={220}
              alt={eachrecipe.name}
              className="recipe-image"
            />
            <h2>{eachrecipe.name}</h2>
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setSelectedRecipe(eachrecipe)}>See More..</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => addRecipe(eachrecipe)}>ADD</button>
          </div>
        ))}
      </div>
      {selectedRecipe && (
        <div className="selected-recipe-modal">
          <RecipeDetails recipe={selectedRecipe} />
        </div>
      )}
      <div className="pagination">
        <span
          className={page === 1 ? "firstPage" : ""}
          onClick={() => displayPage(page - 1)}
        >
          ◀
        </span>
        {[...Array(Math.ceil(filteredRecipes.length / recipesPerPage))].map((_, i) => (
          <span
            key={i}
            className={page === i + 1 ? "page__selected" : ""}
            onClick={() => displayPage(i + 1)}
          >
            {i + 1}
          </span>
        ))}
        <span
          className={page === Math.ceil(filteredRecipes.length / recipesPerPage) ? "lastPage" : ""}
          onClick={() => displayPage(page + 1)}
        >
          ▶
        </span>
      </div>
    </div>
  );
};

export default Rep