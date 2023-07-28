// Check if the 'favouritesList' exists in local storage and create it if not present
if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

// Function to fetch meals from the API based on the search input value
async function fetchMealsFromApi(url, value) {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}

// Function to show a list of meals based on the search input value
function showMealList() {
    let inputValue = document.getElementById("my-search").value;
    let favouritesList = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";
    let meals = fetchMealsFromApi(url, inputValue);
    meals.then(data => {
        if (data.meals) {
            data.meals.forEach((element) => {
                let isFav = favouritesList.includes(element.idMeal);
                html += `
            <div id="card" class="card mb-3" style="width: 20rem;">
              <img src="${element.strMealThumb}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${element.strMeal}</h5>
                <div class="d-flex justify-content-between mt-5">
                  <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                  <button id="main${element.idMeal}" class="btn btn-outline-light ${isFav ? 'active' : ''}" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%">
                    <i class="fa-solid ${isFav ? 'fa-heart' : 'fa-heart-empty'}" style="color: red;"></i>

                  </button>
                </div>
              </div>
            </div>
          `;
            });
        } else {
            html += `
          <div class="page-wrap d-flex flex-row align-items-center">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-md-12 text-center">
                  <span class="display-1 d-block">404</span>
                  <div class="mb-4 lead">
                    The meal you are looking for was not found.
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        }
        document.getElementById("main").innerHTML = html;
    });
}

// Function to show full meal details in the main section
async function showMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    await fetchMealsFromApi(url, id).then(data => {
      let meal = data.meals[0];
      html += `
        <div id="meal-details" class="mb-5">
          <div id="meal-header" class="text-center">
            <h2>${meal.strMeal}</h2>
            <p>Category: ${meal.strCategory}</p>
          </div>
          <div id="meal-thumbail" class="text-center">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          </div>
          <div id="details" class="mt-3">
            <h5>Ingredients:</h5>
            <ul>
              ${getIngredientsList(meal)}
            </ul>
            <h5>Instructions:</h5>
            <p id="meal-instruction">${meal.strInstructions}</p>
          </div>
        </div>
      `;
    });
    document.getElementById("main").innerHTML = html;
  }
  
  function getIngredientsList(meal) {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredientsList += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
      }
    }
    return ingredientsList;
  }
  

// Function to show all favorite meals in the favorites body
async function showFavMealList() {
    let favouritesList = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    if (favouritesList.length == 0) {
      html += `
        <div class="page-wrap d-flex flex-row align-items-center">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-12 text-center">
                <span class="display-1 d-block">No Favorites Yet</span>
                <div class="mb-4 lead">
                  Your favorite meals list is currently empty.
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      for (let id of favouritesList) {
        await fetchMealsFromApi(url, id).then(data => {
          let meal = data.meals[0];
          html += `
            <div id="favCard${id}" class="card mb-3" style="width: 20rem;">
              <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
              <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
                <div class="d-flex justify-content-between mt-5">
                  <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${id})">More Details</button>
                  <button id="fav${id}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${id})" style="border-radius: 50%;">
                    <i class="fa-solid fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        });
      }
    }
    document.getElementById("favourites-body").innerHTML = html;
  }

// Function to add or remove meals to/from the favorites list
function addRemoveToFavList(id) {
    let favouritesList = JSON.parse(localStorage.getItem("favouritesList"));
    let isFav = favouritesList.includes(id);
    if (isFav) {
        favouritesList = favouritesList.filter(item => item !== id);
        alert("Your meal has been removed from your favorites list");
        
        // Remove the favorite meal card from the favorites body
        let favCard = document.getElementById("favCard" + id);
        if (favCard) {
            favCard.remove();
        }
    } else {
        favouritesList.push(id);
        alert("Your meal has been added to your favorites list");
    }
    localStorage.setItem("favouritesList", JSON.stringify(favouritesList));
    showMealList();
    showFavMealList();
}
