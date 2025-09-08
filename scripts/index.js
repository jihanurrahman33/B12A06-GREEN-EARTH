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
    <div id="plant-card-${plant.id}"  class="plant-card card bg-base-100 w-96 shadow-sm p-4 h-full">
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
        <button onclick="addToCart('${plant.id}',event)" id="add-to-cart-btn-${plant.id}" class="btn btn-primary rounded-full bg-[#15803D] border-none mt-3">Add to
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
  const categoriesParent = document.getElementById("categories-parent");
  categoriesParent.innerHTML = "";
  categories.forEach((cat) => {
    const catDiv = document.createElement("div");
    catDiv.innerHTML = `
     <li><button id="cat-btn-${cat.id}" onclick="getPlantsByCategories('${cat.id}')" class="text-start catBtn block w-full px-3 py-2 rounded hover:bg-green-700 hover:text-white">${cat.category_name}</button></li>
    `;
    categoriesParent.appendChild(catDiv);
  });
};
getAllCategories();
const getPlantsByCategories = (catId) => {
  const allBtns = document.querySelectorAll(".catBtn");
  allBtns.forEach((btn) => {
    btn.classList.remove("bg-[#15803D]");
    btn.classList.remove("text-white");
  });
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/category/${catId}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => displayAllPlants(json.plants));
  const clickedBtn = document.getElementById(`cat-btn-${catId}`);
  clickedBtn.classList.add("bg-[#15803D]");
  clickedBtn.classList.add("text-white");
};
const getPlantDetails = (plantId) => {
  const url = `https://openapi.programming-hero.com/api/plant/${plantId}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      displayPlantDetails(json.plants);
    });
};

const displayPlantDetails = (plantDetails) => {
  document.getElementById("my_modal_5").showModal();

  const modalDiv = document.getElementById("my_modal_5");
  modalDiv.innerHTML = `
  <div class="modal-box">
            <h3 class="text-lg font-bold mb-2">${plantDetails.name}</h3>
            <img class="rounded w-full h-60 object-cover mb-2" src="${plantDetails.image}" alt="">
            <h3><span class="font-bold mb-2">Category:</span>${plantDetails.category}</h3>
        <h3> <span class="font-bold mb-2">Price:</span>${plantDetails.price}</h3>
        <p> <span class="font-bold mb-2">Description:</span>${plantDetails.description}</p>
            <div class="modal-action">
                <form method="dialog">
                    
                    <button class="btn">Close</button>
                </form>
            </div>
    </div>
  
  `;
};

const cardsParent = document.getElementById("cards-parent");

cardsParent.addEventListener("click", (e) => {
  const card = e.target.closest(".plant-card");
  if (!card) return;
  getPlantDetails(card.id.replace("plant-card-", ""));
});

let totalPrice = 0;
let cart = [];

const addToCart = async (plantId, e) => {
  if (e) e.stopPropagation();

  try {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/plant/${plantId}`
    );
    const data = await res.json();
    const plant = data.plant || data.plants;
    if (!plant) return;

    cart.push({
      id: plant.id,
      name: plant.name,
      price: Number(plant.price) || 0,
      qty: 1,
    });
    alert(`${plant.name} and price:${plant.price} added to cart`);

    renderCart();
  } catch (err) {
    console.error(err);
  }
};

const renderCart = () => {
  const cartParent = document.getElementById("cart-parent");
  if (!cartParent) return;

  cartParent.innerHTML = "";
  totalPrice = 0;

  cart.forEach((item, idx) => {
    totalPrice += item.price * item.qty;

    const cartItem = document.createElement("div");
    cartItem.className =
      "card-item flex justify-between items-center bg-[#F0FDF4] px-3 py-2 rounded mb-2";
    cartItem.innerHTML = `
      <div>
        <h2 class="font-bold">${item.name}</h2>
        <p class="opacity-50">৳${item.price} x ${item.qty}</p>
      </div>
      <button class="text-[#8C8C8C]" aria-label="Remove">&times;</button>
    `;

    cartItem.querySelector("button").addEventListener("click", () => {
      cart.splice(idx, 1);
      renderCart();
    });

    cartParent.appendChild(cartItem);
  });

  const totalEl = document.getElementById("cart-total-price");
  if (totalEl) totalEl.textContent = `৳${totalPrice}`;
};
