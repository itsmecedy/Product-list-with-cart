document.addEventListener("DOMContentLoaded", () => {
  const menuItemsContainer = document.querySelector(".menu-items");
  const cartItemsCount = document.getElementById("cartItemsCount");
  const cartItemsContainer = document.getElementById("cartItems");
  const emptyCartImg = document.getElementById("emptyCartImg");
  const emptyCartMessage = document.querySelector(".empty-cart-message");

  const cartModal = document.getElementById("cartModal");
  const modalCartItems = document.getElementById("modalCartItems");
  const modalTotalPrice = document.getElementById("modalTotalPrice");
  const closeModal = cartModal.querySelector(".close");
  const startNewOrderBtn = cartModal.querySelector(".start-new-order-btn ");

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

  function resetAddToCartBtns() {
    // Loop through each menu item and reset its button and quantity control
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach((menuItem) => {
      const buttonToShow = menuItem.querySelector(".add-to-cart");
      const quantityControl = menuItem.querySelector(".quantity-control");
      const itemThumbnail = menuItem.querySelector("picture img");

      // Reset button and quantity control
      buttonToShow.style.display = "flex"; // Show the Add to Cart button
      quantityControl.style.display = "none"; // Hide quantity control
      itemThumbnail.style.border = "none"; // Remove outline
    });
  }

  function updateCart() {
    cartItemsCount.textContent = `(${totalItems})`;
    cartItemsContainer.innerHTML = "";

    if (cart.length > 0) {
      emptyCartMessage.style.display = "none";
      emptyCartImg.style.display = "none";
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
      confirmOrderElement.innerHTML = `
        <button id="confirmOrderBtn">Confirm Order</button>`;

      cartItemsContainer.appendChild(confirmOrderElement);

      // confirm order clicked
      confirmOrderElement.addEventListener("click", () => {
        populateModal();
        cartModal.style.display = "block"; // Show the modal

        // Close the modal
        const closeModalEvent = (closeModal.onclick = () => {
          cart.length = 0; // Clear the cart
          totalItems = 0; // Reset total items
          totalPrice = 0; // Reset total price
          saveCart(); // Save the empty cart
          updateCart(); // Update the cart UI
          cartModal.style.display = "none"; // Close the modal
          resetAddToCartBtns(); // Call the reset function here
        });

        // Close the modal when clicking outside of the modal
        window.onclick = (event) => {
          if (event.target === cartModal) {
            closeModalEvent(); // Call the close modal function here
          }
        };

        startNewOrderBtn.addEventListener("click", () => {
          closeModalEvent();
        });

        // Populate the modal with cart items
        function populateModal() {
          modalCartItems.innerHTML = ""; // Clear existing items
          let modalTotal = 0;

          cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            modalTotal += itemTotal;

            const modalItemElement = document.createElement("div");
            modalItemElement.classList.add("modal-item-container");
            modalItemElement.innerHTML =
              //  <img src="./assets/images/image-baklava-desktop.jpg" alt="" srcset="">
              // add this before "modal-cart-item"
              `
            <div class="modal-cart-item">
              <p class="item-name">${item.name}</p>
              <span class="item-quantity">x${item.quantity}</span>
              <span class="item-price">@ $${item.price.toFixed(2)}</span>
            </div>
            <div class="item-total">$${itemTotal.toFixed(2)}</div>
            `;

            modalCartItems.appendChild(modalItemElement);
          });

          modalTotalPrice.textContent = `$ ${modalTotal.toFixed(2)}`;
        }
      });

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
      emptyCartImg.style.display = "block";
    }
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("totalItems", totalItems);
    localStorage.setItem("totalPrice", totalPrice.toFixed(2));
  }
});
// To-Do:
//  add img in each item in modal after clicking "confirm order"
//  retain button style of clicked addToCartBtn(quantity control button) when         refreshed
