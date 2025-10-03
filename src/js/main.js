// Import section components
import { renderHeader } from "./sections/header.js";
import { renderCarousel } from "./sections/carousel.js";
import { renderBookList } from "./sections/book-list.js";
import { renderFooter } from "./sections/footer.js";
import { initCarousel } from "./sections/carousel.js";
import { initHeader } from "./sections/header.js";
import { initBookList } from "./sections/book-list.js";

// Import CSS files (required in Vite for src/ files)
// import "../css/sections/carousel.css";
// import "../css/sections/header.css";
// import "../css/sections/book-list.css";
// import "../css/sections/footer.css";

document.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");

  // Inject sections
  app.innerHTML =
    renderHeader() + renderCarousel() + renderBookList() + renderFooter();

  // Add floating WhatsApp icon
  const whatsappMessage = encodeURIComponent("Hello MelBooks! I came across your website and I'm intrigued by your collection of books. What recommendations do you have for a captivating read in fiction or non-fiction?");
const whatsappFAB = `
  <a href="https://wa.me/237651293991?text=${whatsappMessage}" target="_blank" class="whatsapp-fab" aria-label="Contact us on WhatsApp">
    <i class="fab fa-whatsapp"></i>
    <span class="ripple"></span>
  </a>
`;
  document.body.insertAdjacentHTML("beforeend", whatsappFAB);

  // Initialize functions
  initCarousel();
  initHeader();

  await initBookList();
});