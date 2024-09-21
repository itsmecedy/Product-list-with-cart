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
