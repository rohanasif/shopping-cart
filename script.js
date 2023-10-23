const container = document.querySelector("#container");
const cartIcon = document.getElementById("cart-icon");
const cart = document.getElementById("cart");

fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((data) => showData(data))
  .catch((error) => console.log(error));

var mydata;

function showData(d) {
  handle();
  mydata = d;
  d.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img class="card-img" src="${item.image}" alt="Card image">
      <h5 class="card-title">${item.title}</h5>
      <h5 class="card-price">$${item.price}</h5>
      <button onclick="handleAdd(${index})" class="addBtns">Add to cart</button>
    `;

    // Get the count of the item from localStorage
    var storedData = JSON.parse(localStorage.getItem("data"));
    var itemCount = storedData ? getItemCount(storedData, item.id) : 0;

    // Create a counter element
    var counter = document.createElement("div");
    counter.className = "item-counter";
    counter.textContent = itemCount;

    // Append the counter to the card
    card.appendChild(counter);

    container.appendChild(card);
  });

  // Show items from localStorage in the cart at the first rendering
  var storedData = JSON.parse(localStorage.getItem("data"));
  if (storedData) {
    storedData.forEach((item) => {
      var div = document.createElement("div");
      div.className = "item";
      div.id = "item-" + item.id;
      div.innerHTML = `
        <img class="card-img" src="${item.image}" alt="Card image">
        <h5 class="card-title">${item.title}</h5>
        <h5 class="card-price">$${item.price}</h5>
        <div class="item-counter">${item.count}</div>
        <button onclick="handleDel(${item.id})" class="delBtns">Delete</button>
      `;
      cart.appendChild(div);
    });
  }
}

function handleAdd(index) {
  var obj = {
    id: mydata[index].id,
    image: mydata[index].image,
    title: mydata[index].title,
    price: mydata[index].price,
    count: 1, // Set the initial count to 1
  };
  var x = JSON.parse(localStorage.getItem("data"));
  if (x) {
    var existingItem = x.find((item) => item.id === obj.id);
    if (existingItem) {
      existingItem.count++; // Increment the count of the existing item
    } else {
      x.push(obj);
    }
  } else {
    x = [obj];
  }
  localStorage.setItem("data", JSON.stringify(x));
  updateCart();
}

cartIcon.addEventListener("click", () => {
  cart.classList.toggle("hide");
  cart.classList.toggle("show");
});

function handleDel(id) {
  var x = JSON.parse(localStorage.getItem("data"));
  var index = x.findIndex((item) => item.id === id);
  if (index > -1) {
    x[index].count--; // Decrement the count of the item

    if (x[index].count === 0) {
      x.splice(index, 1); // Remove the item if count reaches zero
      var itemElement = document.getElementById("item-" + id);
      itemElement.remove();
    }

    localStorage.setItem("data", JSON.stringify(x));
    updateCart();

    var counterElement = document.querySelector(`#item-${id} .item-counter`);
    if (counterElement) {
      counterElement.textContent = x[index] ? x[index].count : 0;
    }
  }
}

let counter = document.getElementById("counter");
function handle() {
  var storedData = JSON.parse(localStorage.getItem("data"));
  if (storedData && storedData.length > 0) {
    var totalQuantity = storedData.reduce(
      (total, item) => total + (item.count || 1),
      0
    );
    counter.innerHTML = totalQuantity;
  } else {
    counter.innerHTML = "";
  }
}

function getItemCount(items, itemId) {
  var count = 0;
  items.forEach((item) => {
    if (item.id === itemId) {
      count += item.count || 1;
    }
  });
  return count;
}

function updateCart() {
  // Clear the existing cart items
  cart.innerHTML = "";

  // Retrieve items from localStorage
  var storedData = JSON.parse(localStorage.getItem("data"));

  if (storedData) {
    storedData.forEach((item) => {
      var div = document.createElement("div");
      div.className = "item";
      div.id = "item-" + item.id;
      div.innerHTML = `
        <img class="card-img" src="${item.image}" alt="Card image">
        <h5 class="card-title">${item.title}</h5>
        <h5 class="card-price">$${item.price}</h5>
        <div class="item-counter">${item.count}</div>
        <button onclick="handleDel(${item.id})" class="delBtns">Delete</button>
      `;
      cart.appendChild(div);
    });
  }
  handle();
}
