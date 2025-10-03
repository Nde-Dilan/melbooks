
import { getBooks, getBooksByGenre } from '../services/sanity.js'; // Import from sanity.js

// Sample book data (expand as needed)
// const books = [
//   {
//     id: 1,
//     title: "Simple way of piece life",
//     author: "Armor Ramsey",
//     price: 40000,
//     genre: "Fiction",
//     image: "images/product-item1.jpg",
//   },
//   {
//     id: 2,
//     title: "Great travel at desert",
//     author: "Sanchit Howdy",
//     price: 38000,
//     genre: "Fiction",
//     image: "images/product-item2.jpg",
//   },
//   {
//     id: 3,
//     title: "The lady beauty Scarlett",
//     author: "Arthur Doyle",
//     price: 45000,
//     genre: "Fiction",
//     image: "images/product-item3.jpg",
//   },
//   {
//     id: 4,
//     title: "Once upon a time",
//     author: "Klien Marry",
//     price: 35000,
//     genre: "Fiction",
//     image: "images/product-item4.jpg",
//   },
//   {
//     id: 5,
//     title: "Peaceful Enlightment",
//     author: "Marmik Lama",
//     price: 40000,
//     genre: "Non-Fiction",
//     image: "images/tab-item5.jpg",
//   },
//   {
//     id: 6,
//     title: "Tips of simple lifestyle",
//     author: "Bratt Smith",
//     price: 40000,
//     genre: "Non-Fiction",
//     image: "images/tab-item3.jpg",
//   },
//   {
//     id: 7,
//     title: "Portrait photography",
//     author: "Adam Silber",
//     price: 40000,
//     genre: "Non-Fiction",
//     image: "images/tab-item1.jpg",
//   },
//   {
//     id: 8,
//     title: "Just felt from outside",
//     author: "Nicole Wilson",
//     price: 40000,
//     genre: "Non-Fiction",
//     image: "images/tab-item4.jpg",
//   },
//   {
//     id: 9,
//     title: "Life among the pirates",
//     author: "Armor Ramsey",
//     price: 40000,
//     genre: "Fiction",
//     image: "images/tab-item7.jpg",
//   },
//   {
//     id: 10,
//     title: "Birds gonna be happy",
//     author: "Timbur Hood",
//     price: 45000,
//     genre: "Fiction",
//     image: "images/single-image.jpg",
//   },
// ];

// let cart = JSON.parse(localStorage.getItem("cart")) || []; // Load from localStorage

let books = []; // Will be populated from Sanity
let cart = JSON.parse(localStorage.getItem("cart")) || [];


export function renderBookList() {
  return `
        <section id="book-list" class="py-5">
            <div class="container">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Books</h2>
                    <form class="d-flex">
                        <input type="text" id="search-input" class="form-control me-2" placeholder="Search books by title or author">
                    </form>
                </div>
                <!-- Tabs for Genres -->
                <ul class="nav nav-tabs mb-4" id="genre-tabs">
                    <li class="nav-item">
                        <a class="nav-link active" href="#" data-genre="all">All</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-genre="Fiction">Fiction</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-genre="Non-Fiction">Non-Fiction</a>
                    </li>
                </ul>
                <!-- Book Grid -->
                <div class="row" id="book-grid">
                    ${renderBooks("all", "")}
                </div>
            </div>
        </section>
        <!-- Cart Sidebar -->
        <div class="offcanvas offcanvas-end" tabindex="-1" id="cart-sidebar" aria-labelledby="cart-sidebar-label">
            <div class="offcanvas-header bg-light">
                <h5 class="offcanvas-title" id="cart-sidebar-label"><i class="icon icon-clipboard me-2"></i>Your Cart</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div id="cart-items" class="mb-3"></div>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <strong>Total: XAF<span id="sidebar-total">0</span></strong>
                    <small class="text-muted">Free shipping on orders over XAF 50,000</small>
                </div>
                <button class="btn btn-primary w-100 mt-3" id="sidebar-checkout"><i class="icon icon-paper-plane me-2"></i>Checkout via WhatsApp</button>
            </div>
        </div>
    `;
}

function renderBooks(genre, searchQuery) {
  const filteredBooks = books.filter((book) => {
    const matchesGenre = genre === "all" || book?.genre === genre;
    const matchesSearch =
      searchQuery === "" ||
      book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book?.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return filteredBooks
    .map((book) => {
      const cartItem = cart.find((item) => item?.id === book?.id);
      const buttonText = cartItem
        ? `In Cart (${cartItem.quantity})`
        : "Add to Cart";
      const buttonClass = cartItem ? "btn-warning" : "btn-success";
      return `
            <div class="col-lg-3 col-md-6 col-12 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${book?.image}" class="card-img-top" alt="${
        book?.title
      }">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${book?.title}</h5>
                        <p class="card-text text-muted">${book?.author}</p>
                        <p class="card-text fw-bold">XAF${book?.price}</p>
                        <button class="btn ${buttonClass} mt-auto add-to-cart" data-id="${
        book?.id
      }">${buttonText}</button>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");
}

function updateCartSummary() {
  const totalItems = cart.reduce((sum, item) => sum + item?.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item?.price * item?.quantity,
    0
  );
  document.getElementById("cart-badge").textContent = totalItems;
  document.getElementById("cart-badge").style.display =
    totalItems > 0 ? "inline" : "none";
  document.getElementById("sidebar-total").textContent = totalPrice;
  document.getElementById("mini-total").textContent = totalPrice;
  renderCartItems();
  renderMiniCartPreview();
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCartItems() {
  const cartItemsDiv = document.getElementById("cart-items");
  cartItemsDiv.innerHTML =
    cart.length === 0
      ? '<p class="text-muted">Your cart is empty.</p>'
      : cart
          .map((item) => {
            const book = books.find((b) => b.id === item?.id);
            return `
            <div class="d-flex align-items-center mb-3 p-2 border rounded">
                <img src="${book?.image}" alt="${
              item?.title
            }" class="me-3" style="width: 50px; height: 70px; object-fit: cover; border-radius: 5px;">
                <div class="flex-grow-1">
                    <strong>${item.title}</strong><br>
                    <small class="text-muted">XAF${item.price } each</small>
                    <div class="d-flex align-items-center mt-1">
                        <button class="btn btn-sm btn-outline-secondary me-1" data-id="${
                          item?.id
                        }" data-action="decrease">-</button>
                        <span class="mx-2">x${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary me-2" data-id="${
                          item?.id
                        }" data-action="increase">+</button>
                        <button class="btn btn-sm btn-outline-danger" data-id="${
                          item?.id
                        }" data-action="remove"><i class="icon icon-close"></i></button>
                    </div>
                </div>
                <div class="text-end">
                    <strong>XAF${(item.price * item?.quantity)}</strong>
                </div>
            </div>
        `;
          })
          .join("");
}

function renderMiniCartPreview() {
  const miniCartItemsDiv = document.getElementById("mini-cart-items");
  const topItems = cart.slice(0, 3); // Show top 3 items
  miniCartItemsDiv.innerHTML =
    cart.length === 0
      ? '<li class="dropdown-item text-muted">Your cart is empty.</li>'
      : topItems
          .map((item) => {
            const book = books.find((b) => b.id === item?.id);
            return `
            <li class="dropdown-item d-flex align-items-center">
                <img src="${book?.image}" alt="${
              item?.title
            }" class="me-2" style="width: 30px; height: 40px; object-fit: cover; border-radius: 3px;">
                <div>
                    <small><strong>${item.title}</strong> (x${
              item?.quantity
            })</small><br>
                    <small class="text-muted">XAF${(
                      item?.price * item?.quantity
                    )}</small>
                </div>
            </li>
        `;
          })
          .join("") +
        (cart.length > 3
          ? `<li class="dropdown-item text-center"><small>...and ${
              cart.length - 3
            } more</small></li>`
          : "");
}

export async function initBookList() {
  books = await getBooks();
  if (books.length === 0) {
    console.warn('No books loaded from Sanity. Check your configuration.');
  }
  const searchInput = document.getElementById("search-input");
  const tabs = document.querySelectorAll("#genre-tabs .nav-link");
  const bookGrid = document.getElementById("book-grid");
  const sidebarCheckout = document.getElementById("sidebar-checkout");

  let currentGenre = "all";
  let currentSearch = "";

  // Initial render with fetched books
  bookGrid.innerHTML = renderBooks(currentGenre, currentSearch);
  attachAddToCartListeners();
  updateCartSummary();

  // Tab switching (now uses getBooksByGenre for efficiency, or filter locally)
  tabs.forEach((tab) => {
    tab.addEventListener("click", async (e) => { // Make async if fetching per genre
      e.preventDefault();
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentGenre = tab.dataset.genre;
      // Option 1: Refetch from Sanity (better for large datasets)
      books = await getBooksByGenre(currentGenre);
      // Option 2: Filter locally (faster for small datasets)
      // books = await getBooks(); // Then filter in renderBooks
      bookGrid.innerHTML = renderBooks(currentGenre, currentSearch);
      attachAddToCartListeners();
    });
  });

  // Live search
  searchInput.addEventListener("input", () => {
    currentSearch = searchInput.value;
    bookGrid.innerHTML = renderBooks(currentGenre, currentSearch);
    attachAddToCartListeners();
  });

  // Add to cart
  function attachAddToCartListeners() {
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", () => {
        const bookId = btn.dataset.id; // Remove parseInt, keep as string
        const cartItem = cart.find((item) => item?.id === bookId);
        if (cartItem) {
          cartItem.quantity++;
        } else {
          cart.push({
            id: bookId,
            title: books.find((b) => b.id === bookId)?.title,
            quantity: 1,
            price: books.find((b) => b.id === bookId)?.price,
          });
        }
        updateCartSummary();
        bookGrid.innerHTML = renderBooks(currentGenre, currentSearch); // Re-render to update buttons
        attachAddToCartListeners();
        // Auto-open sidebar on first add
        if (cart.length === 1 && cart[0].quantity <= 1) {
          const bsOffcanvas = new bootstrap.Offcanvas(
            document.getElementById("cart-sidebar")
          );
          bsOffcanvas.show();
        }
      });
    });
  }

  // Initial attach
  attachAddToCartListeners();

  // Unified cart item actions (single listener for all)
  document.addEventListener("click", (e) => {
    const action = e.target.closest("[data-action]")?.dataset.action;
    const id = e.target.closest("[data-id]")?.dataset.id; // Remove parseInt, keep as string

    if (!action || !id) return; // Ensure valid target

    if (action === "increase") {
      const item = cart.find((item) => item?.id === id);
      item.quantity++;
      updateCartSummary();
      bookGrid.innerHTML = renderBooks(currentGenre, currentSearch);
      attachAddToCartListeners();
    } else if (action === "decrease") {
      const item = cart.find((item) => item?.id === id);
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart = cart.filter((item) => item?.id !== id);
      }
      updateCartSummary();
      bookGrid.innerHTML = renderBooks(currentGenre, currentSearch);
      attachAddToCartListeners();
    } else if (action === "remove") {
      if (confirm("Remove this item from cart?")) {
        cart = cart.filter((item) => item?.id !== id);
        updateCartSummary();
        bookGrid.innerHTML = renderBooks(currentGenre, currentSearch);
        attachAddToCartListeners();
      }
    }
  });

  // Sidebar checkout
  sidebarCheckout.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    const cartDetails = cart
      .map((item) => `${item.title} (x${item.quantity})`)
      .join(", ");
    const totalPrice = cart.reduce(
      (sum, item) => sum + item?.price * item?.quantity,
      0
    );
    const message = `Hello, I am interested in buying: ${cartDetails} for a total of XAF ${totalPrice.toFixed(
      2
    )}.`;
    window.location.href = `https://wa.me/237651293991/?text=${encodeURIComponent(message)}`;
  });
}
