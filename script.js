document.addEventListener("DOMContentLoaded", () => {
  const menuItemsContainer = document.querySelector(".menu-items");
  const cartItemsCount = document.getElementById("cartItemsCount");
  const cartItemsContainer = document.getElementById("cartItems");
  const emptyCartMessage = document.querySelector(".empty-cart-message");
  let totalItems = 0;
  let totalPrice = 0;

  // Cart array to hold added items
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Load totalItems and totalPrice from localStorage if available
  totalItems = localStorage.getItem("totalItems")
    ? parseInt(localStorage.getItem("totalItems"))
    : 0;
  totalPrice = localStorage.getItem("totalPrice")
    ? parseFloat(localStorage.getItem("totalPrice"))
    : 0;

  // Update cart UI on page load
  updateCart();

  // Fetch the data from data.json
  fetch("./data.json")
    .then((response) => response.json())
    .then((items) => {
      items.forEach((item) => {
        const itemElement = `
          <div class="menu-item">
            <picture>
              <source media="(min-width: 1024px)" srcset="${
                item.image.desktop
              }">
              <source media="(min-width: 768px)" srcset="${item.image.tablet}">
              <source media="(max-width: 767px)" srcset="${item.image.mobile}">
              <img class="item-thumbnail" src="${item.image.thumbnail}" alt="${
          item.name
        }">
            </picture>
            <div class="item-info">
              <p class="item-category">${item.category}</p>
              <h3 class="item-name">${item.name}</h3>
              <p class="item-price">$${item.price.toFixed(2)}</p>
            </div>
            <button class="add-to-cart" data-price="${item.price}" data-name="${
          item.name
        }">
              <img src="./assets/images/icon-add-to-cart.svg" alt="Add to Cart" class="cart-icon">
              Add to Cart
            </button>
            <div class="quantity-control" style="display: none;">
              <button class="decrease">-</button>
              <span class="quantity">1</span>
              <button class="increase">+</button>
            </div>
          </div>
        `;
        menuItemsContainer.innerHTML += itemElement;
      });

      // Add event listeners for "Add to Cart" buttons
      const addToCartButtons = document.querySelectorAll(".add-to-cart");
      addToCartButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          const menuItem = event.target.closest(".menu-item");
          const quantityControl = menuItem.querySelector(".quantity-control");
          const itemThumbnail = menuItem.querySelector("picture img");
          const price = parseFloat(button.getAttribute("data-price"));
          const name = button.getAttribute("data-name");

          // Show the quantity control and hide the "Add to Cart" button
          button.style.display = "none";
          quantityControl.style.display = "flex";
          itemThumbnail.style.border = "2px solid var(--Red)";

          // Check if item is already in the cart
          let cartItem = cart.find((item) => item.name === name);
          if (cartItem) {
            cartItem.quantity++;
          } else {
            cartItem = { name, price, quantity: 1 };
            cart.push(cartItem);
          }

          totalItems++;
          totalPrice += price;
          updateCart();
          saveCart();

          // Update the quantity display
          const quantityDisplay = quantityControl.querySelector(".quantity");
          quantityDisplay.textContent = cartItem.quantity;

          // Add event listeners for quantity buttons only once
          const decreaseButton = quantityControl.querySelector(".decrease");
          const increaseButton = quantityControl.querySelector(".increase");

          // Handle decrease button click
          decreaseButton.onclick = () => {
            const quantity = parseInt(quantityDisplay.textContent);
            if (quantity > 1) {
              quantityDisplay.textContent = quantity - 1;
              cartItem.quantity--;
              totalItems--;
              totalPrice -= price;
              updateCart();
              saveCart();
            } else {
              // Handle item removal
              button.style.display = "flex";
              itemThumbnail.style.border = "none";
              quantityControl.style.display = "none";
              cart.splice(cart.indexOf(cartItem), 1);
              totalItems--;
              totalPrice -= price;
              updateCart();
              saveCart();
            }
          };

          // Handle increase button click
          increaseButton.onclick = () => {
            cartItem.quantity++;
            totalItems++;
            totalPrice += price;
            quantityDisplay.textContent = cartItem.quantity;
            updateCart();
            saveCart();
          };
        });
      });
    })
    .catch((error) => console.error("Error fetching the data:", error));

  function updateCart() {
    cartItemsCount.textContent = `(${totalItems})`;
    cartItemsContainer.innerHTML = "";

    if (cart.length > 0) {
      emptyCartMessage.style.display = "none";
      let cartTotal = 0;

      cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;

        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item-element");
        cartItemElement.innerHTML = `
          <div class="cart-item">
            <div>
              <p class="cart-item-name">${item.name}</p>
              <p>
                <span class="cart-item-quantity">x${item.quantity}</span>
                <span class="cart-item-prices">@ $${item.price.toFixed(
                  2
                )} = $${itemTotal.toFixed(2)}</span>
              </p>
            </div>
            <button class="removeItemCart" data-name="${item.name}">x</button>
          </div>`;
        cartItemsContainer.appendChild(cartItemElement);
      });

      const totalElement = document.createElement("div");
      totalElement.classList.add("total-order");
      totalElement.innerHTML = `<div>Order Total:</div><div class="cart-total-price">$${cartTotal.toFixed(
        2
      )}</div>`;
      cartItemsContainer.appendChild(totalElement);

      // Add carbon-neutral element
      const carbonNeutralElement = document.createElement("div");
      carbonNeutralElement.classList.add("carbon-neutral");
      carbonNeutralElement.innerHTML = `
          <img src="./assets/images/icon-carbon-neutral.svg" alt="carbon-neutral" />
          <p>This is a <b>carbon-neutral</b> delivery</p>`;
      cartItemsContainer.appendChild(carbonNeutralElement);

      // Add confirm order button
      const confirmOrderElement = document.createElement("div");
      confirmOrderElement.classList.add("confirm-order");
      confirmOrderElement.innerHTML = `<button class="confirm-order">Confirm Order</button>`;
      cartItemsContainer.appendChild(confirmOrderElement);

      // Add event listeners for remove buttons
      document.querySelectorAll(".removeItemCart").forEach((button) => {
        button.addEventListener("click", () => {
          const name = button.getAttribute("data-name");
          const cartItemIndex = cart.findIndex((item) => item.name === name);
          if (cartItemIndex > -1) {
            totalItems -= cart[cartItemIndex].quantity;
            totalPrice -=
              cart[cartItemIndex].price * cart[cartItemIndex].quantity;
            cart.splice(cartItemIndex, 1);
            updateCart();
            saveCart();

            // Reset the "Add to Cart" button and quantity control
            const menuItem = Array.from(
              document.querySelectorAll(".menu-item")
            ).find(
              (item) =>
                item.querySelector(".add-to-cart").getAttribute("data-name") ===
                name
            );
            const buttonToShow = menuItem.querySelector(".add-to-cart");
            const quantityControl = menuItem.querySelector(".quantity-control");
            const itemThumbnail = menuItem.querySelector("picture img");

            buttonToShow.style.display = "flex"; // Show the Add to Cart button
            quantityControl.style.display = "none"; // Hide quantity control
            itemThumbnail.style.border = "none"; // Remove outline
          }
        });
      });
    } else {
      emptyCartMessage.style.display = "block";
    }
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("totalItems", totalItems);
    localStorage.setItem("totalPrice", totalPrice.toFixed(2));
  }
});
