// script.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const recipesContainer = document.getElementById('recipesContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const APP_ID = "b4cfd87a";
    const APP_KEY = "c6b6c23d0e685fa07c105ab8ef02a2e5";
    
    loadingIndicator.style.display = 'none';

    let currentPage = 0;
    const resultsPerPage = 10;

    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== '') {
            currentPage = 0; // Reset current page when performing a new search
            fetchRecipes(searchTerm);
        }
    });

    async function fetchRecipes(searchTerm) {
        try {
            // Show loading indicator when fetching recipes
            loadingIndicator.style.display = 'block';

            const response = await fetch(`https://api.edamam.com/search?q=${searchTerm}&app_id=${APP_ID}&app_key=${APP_KEY}&from=${currentPage * resultsPerPage}&to=${(currentPage + 1) * resultsPerPage}`);
            const data = await response.json();
            displayRecipes(data.hits);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            recipesContainer.innerHTML = 'Failed to fetch recipes. Please try again later.';
        } finally {
            // Hide loading indicator once recipes are loaded or in case of an error
            loadingIndicator.style.display = 'none';
        }
    }

    function displayRecipes(hits) {
        // Remove any existing "Load More" button
        const existingLoadMoreBtn = recipesContainer.querySelector('.load-more-btn');
        if (existingLoadMoreBtn) {
            existingLoadMoreBtn.remove();
        }
    
        if (hits.length === 0) {
            recipesContainer.innerHTML = 'No recipes found.';
            return;
        }
    
        hits.forEach(hit => {
            const recipe = hit.recipe;
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
    
            const recipeImage = document.createElement('img');
            recipeImage.src = recipe.image;
            recipeImage.alt = recipe.label;
    
            const recipeContent = document.createElement('div');
            recipeContent.classList.add('recipe-content');
    
            const recipeTitle = document.createElement('h2');
            recipeTitle.textContent = recipe.label;
    
            const recipeIngredients = document.createElement('p');
            recipeIngredients.textContent = `Ingredients: ${recipe.ingredientLines.join(', ')}`;
    
            const recipeLink = document.createElement('a');
            recipeLink.href = recipe.url;
            recipeLink.textContent = 'View Recipe';
            recipeLink.target = '_blank';
    
            recipeContent.appendChild(recipeTitle);
            recipeContent.appendChild(recipeIngredients);
            recipeContent.appendChild(recipeLink);
    
            recipeCard.appendChild(recipeImage);
            recipeCard.appendChild(recipeContent);
    
            recipesContainer.appendChild(recipeCard);
        });
    
        // If there are more results available, show a "Load More" button
        if (hits.length >= resultsPerPage) {
            const loadMoreBtn = document.createElement('button');
            loadMoreBtn.textContent = 'Load More';
            loadMoreBtn.classList.add('load-more-btn');
            loadMoreBtn.addEventListener('click', () => {
                currentPage++;
                fetchRecipes(searchInput.value.trim());
            });
            recipesContainer.appendChild(loadMoreBtn);
        }
    }
    
});
