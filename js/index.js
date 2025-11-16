const patterns = {
  name: /^[A-Za-z ]{3,20}$/,
  email: /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/,
  phone: /^(010|011|012|015)[0-9]{8}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
};
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const phoneInput = document.getElementById("phoneInput");
const passInput = document.getElementById("passwordInput");
const rePassInput = document.getElementById("rePasswordInput");
const nameMsg = document.getElementById("nameMsg");
const emailMsg = document.getElementById("emailMsg");
const phoneMsg = document.getElementById("phoneMsg");
const passwordMsg = document.getElementById("passwordMsg");
const rePasswordMsg = document.getElementById("rePasswordMsg");
const signupBtn = document.getElementById("signupBtn");
//-----------------regex
function validateInputs() {
  patterns.name.test(nameInput.value) ? nameMsg.classList.add("d-none") : nameMsg.classList.remove("d-none");
  patterns.email.test(emailInput.value) ? emailMsg.classList.add("d-none") : emailMsg.classList.remove("d-none");
  patterns.phone.test(phoneInput.value) ? phoneMsg.classList.add("d-none") : phoneMsg.classList.remove("d-none");
  patterns.password.test(passInput.value) ? passwordMsg.classList.add("d-none") : passwordMsg.classList.remove("d-none");
  passInput.value === rePassInput.value && rePassInput.value !== "" ? rePasswordMsg.classList.add("d-none") : rePasswordMsg.classList.remove("d-none");

  signupBtn.disabled = !(
    patterns.name.test(nameInput.value) &&
    patterns.email.test(emailInput.value) &&
    patterns.phone.test(phoneInput.value) &&
    patterns.password.test(passInput.value) &&
    passInput.value === rePassInput.value
  );
}

//----------------------------/valid
[nameInput, emailInput, phoneInput, passInput, rePassInput].forEach(input => 
  input.addEventListener("input", validateInputs)
);

  //------------------------close all 
  function closeAll() {
    sideNav.classList.remove("open");
    blackList.classList.remove("open");
    searchSection.style.display = "none";
    mealsGrid.innerHTML = "";
    signupForm.style.display = "none";
    mealOverlay.style.display = "none";
    toggleBtn.classList.remove("fa-xmark");
    toggleBtn.classList.add("fa-bars");
  }

  //---------------- pars to xmark 
  toggleBtn.addEventListener("click", () => {
    sideNav.classList.toggle("open");
    blackList.classList.toggle("open");
    if(sideNav.classList.contains("open")) {
      toggleBtn.classList.remove("fa-bars");
      toggleBtn.classList.add("fa-xmark");
    } else {
      toggleBtn.classList.remove("fa-xmark");
      toggleBtn.classList.add("fa-bars");
    }
  });

  // -------- Search --------
  linkSearch.addEventListener("click", () => {
    closeAll();
    searchSection.style.display = "block";
  });

  searchByName.addEventListener("input", () => {
    const query = searchByName.value.trim();
    if(query) displayMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    else mealsGrid.innerHTML = "";
  });

  searchByLetter.addEventListener("input", () => {
    const letter = searchByLetter.value.trim();
    if(letter) displayMeals(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    else mealsGrid.innerHTML = "";
  });

  async function displayMeals(url) {
    mealsGrid.innerHTML = "<p>Loading...</p>";
    const res = await fetch(url);
    const data = await res.json();
    const meals = data.meals;
    if(!meals) {
      mealsGrid.innerHTML = "<p>No meals found.</p>";
      return;
    }
    mealsGrid.innerHTML = meals.map(meal => `
      <div class="col-md-3 col-sm-6 mb-3">
        <div class="meal-card" data-id="${meal.idMeal}">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <div class="overlay"><h4>${meal.strMeal}</h4></div>
        </div>
      </div>
    `).join("");
  }

  // ------------------ Categories 
  linkCategories.addEventListener("click", async () => {
    closeAll();
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    const data = await res.json();
    const categories = data.categories;
    mealsGrid.innerHTML = categories.map(cat => `
      <div class="col-md-3 col-sm-6 mb-3">
        <div class="category-card" data-name="${cat.strCategory}" data-instructions="${cat.strCategoryDescription}">
          <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}" />
          <div class="overlay">
            <h4>${cat.strCategory}</h4>
            <p>${cat.strCategoryDescription ? cat.strCategoryDescription.split(" ").slice(0,20).join(" ")+" ..." : ""}</p>
          </div>
        </div>
      </div>
    `).join("");

    document.querySelectorAll(".category-card").forEach(card => {
      card.addEventListener("click", async () => {
        closeAll();
        const category = card.dataset.name;
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await res.json();
        const meals = data.meals;
        displayMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      });
    });
  });

  // ----------------- Area
  linkArea.addEventListener("click", async () => {
    closeAll();
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    const data = await res.json();
    const areas = data.meals;

    mealsGrid.innerHTML = areas.map(area => `
      <div class="col-md-3 col-sm-6 mb-3">
        <div class="area-card text-center p-3" data-name="${area.strArea}" style="color:white; border-radius:10px; cursor:pointer;">
          <i class="fa-solid fa-house-laptop fa-2x mb-2"></i>
          <h4>${area.strArea}</h4>
        </div>
      </div>
    `).join("");

    document.querySelectorAll(".area-card").forEach(card => {
      card.addEventListener("click", async () => {
        closeAll();
        const areaName = card.dataset.name;
        displayMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`);
      });
    });
  });

  // --------------------------- Ingredients
  linkIngredients.addEventListener("click", async () => {
    closeAll();
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    const data = await res.json();
    const ingredients = data.meals.slice(0,50);

    mealsGrid.innerHTML = ingredients.map(ing => `
      <div class="col-md-3 col-sm-6 mb-3">
        <div class="ingredient-card text-center p-3" data-name="${ing.strIngredient}" style="color:white; border-radius:10px; cursor:pointer;">
          <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          <h4>${ing.strIngredient}</h4>
        </div>
      </div>
    `).join("");

    document.querySelectorAll(".ingredient-card").forEach(card => {
      card.addEventListener("click", async () => {
        closeAll();
        const ingName = card.dataset.name;
        displayMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingName}`);
      });
    });
  });

  // ---------------------------- Contact Us
  linkContact.addEventListener("click", () => {
    closeAll();
    signupForm.style.display = "block";
  });

  // ----------------------- Full-screen Meal Details
  document.addEventListener("click", async (e) => {
    const mealCard = e.target.closest(".meal-card");
    if(!mealCard) return;
    closeAll();
    const mealId = mealCard.dataset.id;
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await res.json();
    const meal = data.meals[0];

    mealDetails.innerHTML = `
      <div>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid mb-3"/>
      <h2>${meal.strMeal}</h2>
      </div>
      <div>
      <p>${meal.strInstructions ? meal.strInstructions.split(" ").slice(0,20).join(" ") + (meal.strInstructions.split(" ").length>20?" ...":"") : "No instructions."}</p>
      <p><strong>Area:</strong> ${meal.strArea}</p>
      <p><strong>Category:</strong> ${meal.strCategory}</p>
     <div>
  <strong>Ingredients:<br></strong>
  ${[...Array(20).keys()]
    .map(i => meal[`strIngredient${i+1}`])
    .filter(Boolean)
    .map(ing => `<span class="bod">${ing}</span>`)
    .join(" ")}
</div>
      <p><strong>Tags:</strong> ${meal.strTags || "No tags"}</p>
      <button class="btn btn-success me-2">${meal.strSource ? `<p><a href="${meal.strSource}" target="_blank">Source</a></p>` : ""}</button>
      <button class="btn btn-danger">${meal.strYoutube ? `<p><a href="${meal.strYoutube}" target="_blank">YouTube</a></p>` : ""}</button>
      </div>
    `;

    mealOverlay.style.display = "flex";
  });

  
//--------------------- random 25 meal on start
async function loadHomeMeals() {
  closeAll(); 
  mealsGrid.innerHTML = "<p>Loading...</p>";
  const meals = [];
  for (let i = 0; i < 25; i++) {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await res.json();
    meals.push(data.meals[0]);
  }

  mealsGrid.innerHTML = meals.map(meal => `
    <div class="col-md-3 col-sm-6 mb-3">
      <div class="meal-card" data-id="${meal.idMeal}">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="overlay"><h4>${meal.strMeal}</h4></div>
      </div>
    </div>
  `).join("");
}


document.addEventListener("DOMContentLoaded", () => {
loadHomeMeals();
})