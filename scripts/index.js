// loading spinner

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("cards-parent").classList.add("hidden");
  } else {
    document.getElementById("cards-parent").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

// get all plants
const getAllPlants = () => {
  manageSpinner(true);
  const url = "https://openapi.programming-hero.com/api/plants";
  fetch(url)
    .then((res) => res.json())
    .then((json) => displayAllPlants(json.plants));
};

const displayAllPlants = (plants) => {
  const cardsParent = document.getElementById("cards-parent");
  cardsParent.innerHTML = "";
  plants.forEach((plant) => {
    const cardDiv = document.createElement("div");
    cardDiv.innerHTML = `
    <div class="card bg-base-100 w-96 shadow-sm p-4 h-full">
        <figure class="bg-[#EDEDED] h-44">
            <img class="object-contain" src="${plant.image}" alt="${plant.name}" />
        </figure>
        <div class="card-body p-0">
            <h2 class="card-title mt-3">${plant.name}</h2>
            <p class=" text-xs text-[#1F2937]">${plant.description}</p>
            <div class="card-actions justify-between font-semibold">
                <div class="bg-[#DCFCE7] badge badge-outline text-[#15803D] rounded-full border-none">
                    ${plant.category}</div>
                <div class="">৳${plant.price}</div>
            </div>
        </div>
        <button class="btn btn-primary rounded-full bg-[#15803D] border-none mt-3">Add to
            Cart</button>
    </div>
    
    `;
    cardsParent.appendChild(cardDiv);
    manageSpinner(false);
  });
};
getAllPlants();
const getAllCategories = () => {
  const url = "https://openapi.programming-hero.com/api/categories";
  fetch(url)
    .then((res) => res.json())
    .then((json) => displayAllCategories(json.categories));
};

const displayAllCategories = (categories) => {
  console.log(categories);
  const categoriesParent = document.getElementById("categories-parent");
  categoriesParent.innerHTML = "";
  categories.forEach((cat) => {
    const catDiv = document.createElement("div");
    catDiv.innerHTML = `
     <li><button onclick="getPlantsByCategories('${cat.id}')" class="block w-full px-3 py-2 rounded hover:bg-green-700 hover:text-white">${cat.category_name}</button></li>
    `;
    categoriesParent.appendChild(catDiv);
  });
};
getAllCategories();
const getPlantsByCategories = (catId) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/category/${catId}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => displayAllPlants(json.plants));
};
