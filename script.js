document.addEventListener("DOMContentLoaded", () => {
  const menuItemsContainer = document.querySelector(".menu-items");

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
                <source media="(min-width: 768px)" srcset="${
                  item.image.tablet
                }">
                <source media="(max-width: 767px)" srcset="${
                  item.image.mobile
                }">
                <img src="${item.image.thumbnail}" alt="${item.name}">
                <button class="add-to-cart">
                  <img src="./assets/images/icon-add-to-cart.svg" alt="Add to Cart" class="cart-icon">
                  Add to Cart
                </button>
              </picture>
              <div class="item-info">
                <p class="item-category">${item.category}</p>
                <h3 class="item-name">${item.name}</h3>
                <p class="item-price">$${item.price.toFixed(2)}</p>
              </div>
            </div>
          `;
        menuItemsContainer.innerHTML += itemElement;
      });
    })
    .catch((error) => console.error("Error fetching the data:", error));
});
// document.addEventListener("DOMContentLoaded", () => {
//   const menuItemsContainer = document.querySelector(".menu-items");

//   // Fetch the data from data.json
//   fetch("./data.json")
//     .then((response) => response.json())
//     .then((items) => {
//       items.forEach((item) => {
//         const itemElement = `
//             <div class="menu-item">
//               <picture>
//                 <source media="(min-width: 1024px)" srcset="${item.image.desktop}">
//                 <source media="(min-width: 768px)" srcset="${item.image.tablet}">
//                 <source media="(max-width: 767px)" srcset="${item.image.mobile}">
//                 <img src="${item.image.thumbnail}" alt="${item.name}">
//               </picture>
//               <div class="item-info">
//                 <p class="item-category">${item.category}</p>
//                 <h3 class="item-name">${item.name}</h3>
//                 <p class="item-price">$${item.price.toFixed(2)}</p>
//               </div>
//               <button class="add-to-cart">
//                 <img src="./assets/images/icon-add-to-cart.svg" alt="Add to Cart" class="cart-icon">
//                 Add to Cart
//               </button>
//               <div class="quantity-control" style="display: none;">
//                 <button class="decrease">-</button>
//                 <span class="quantity">1</span>
//                 <button class="increase">+</button>
//               </div>
//             </div>
//           `;
//         menuItemsContainer.innerHTML += itemElement;
//       });

//       // Add event listeners for "Add to Cart" buttons
//       const addToCartButtons = document.querySelectorAll('.add-to-cart');

//       addToCartButtons.forEach(button => {
//         button.addEventListener('click', (event) => {
//           const menuItem = event.target.closest('.menu-item');
//           const quantityControl = menuItem.querySelector('.quantity-control');

//           // Show the quantity control and hide the "Add to Cart" button
//           button.style.display = 'none';
//           quantityControl.style.display = 'flex';

//           // Add event listeners for quantity buttons
//           const decreaseButton = quantityControl.querySelector('.decrease');
//           const increaseButton = quantityControl.querySelector('.increase');
//           const quantityDisplay = quantityControl.querySelector('.quantity');

//           decreaseButton.addEventListener('click', () => {
//             let quantity = parseInt(quantityDisplay.textContent);
//             if (quantity > 1) {
//               quantityDisplay.textContent = quantity - 1;
//             }
//           });

//           increaseButton.addEventListener('click', () => {
//             let quantity = parseInt(quantityDisplay.textContent);
//             quantityDisplay.textContent = quantity + 1;
//           });
//         });
//       });
//     })
//     .catch((error) => console.error("Error fetching the data:", error));
// });
