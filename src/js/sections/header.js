export function renderHeader() {
    return `
        <header id="header" class="bg-dark text-white py-2 py-md-3 sticky-top" style="z-index: 1030;">
            <div class="container-fluid">
                <div class="row align-items-center">
                    <!-- Logo -->
                    <div class="col-4 col-md-2">
                        <div class="main-logo">
                            <a href="index.html">
                                <img src="images/melbooks-logo.png" alt="MelBooks Logo" class="img-fluid" style="max-height: 40px;">
                                MelBooks
                            </a>
                        </div>
                    </div>
                    <!-- Menu (Fiction/Non-Fiction) - Hidden on mobile, shown via hamburger -->
                    <div class="col-12 col-md-6 text-center d-none d-md-block">
                        <nav id="navbar">
                            <ul class="menu-list list-inline mb-0">
                                <li class="menu-item list-inline-item">
                                    <a href="#fiction" class="btn btn-outline-light btn-sm mx-1" style="border-radius: 20px;">Fiction</a>
                                </li>
                                <li class="menu-item list-inline-item">
                                    <a href="#non-fiction" class="btn btn-outline-light btn-sm mx-1" style="border-radius: 20px;">Non-Fiction</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <!-- Hamburger for mobile -->
                    <div class="col-4 text-center d-md-none">
                        <button class="hamburger" aria-label="Toggle menu" aria-expanded="false">
                            <span class="bar"></span>
                            <span class="bar"></span>
                            <span class="bar"></span>
                        </button>
                    </div>
                    <!-- Cart Button and Social Links -->
                    <div class="col-4 col-md-4 text-end d-flex align-items-center justify-content-end position-relative">
                        <!-- Cart Button with Mini-Preview (Dropdown on desktop, Offcanvas on mobile) -->
                        <div class="d-none d-md-block">
                            <div class="dropdown">
                                <button class="btn btn-outline-light me-2 position-relative" id="cart-toggle" data-bs-toggle="dropdown" aria-expanded="false" style="border-radius: 50%; padding: 8px;">
                                    <i class="icon icon-clipboard"></i>
                                    <span class="badge bg-danger position-absolute top-0 start-100 translate-middle" id="cart-badge" style="display: none;">0</span>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end mini-cart-preview" id="mini-cart-preview" style="width: 300px; max-height: 400px; overflow-y: auto;">
                                    <li><h6 class="dropdown-header">Cart Preview</h6></li>
                                    <li id="mini-cart-items"></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li class="d-flex justify-content-between px-3">
                                        <strong>Total: XAF<span id="mini-total">0</span></strong>
                                        <button class="btn btn-sm btn-primary" data-bs-toggle="offcanvas" data-bs-target="#cart-sidebar">View Full Cart</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- Mobile Cart Button (Triggers Offcanvas) -->
                        <button class="btn btn-outline-light me-2 position-relative d-md-none" data-bs-toggle="offcanvas" data-bs-target="#cart-sidebar" style="border-radius: 50%; padding: 8px;">
                            <i class="icon icon-clipboard"></i>
                            <span class="badge bg-danger position-absolute top-0 start-100 translate-middle" id="cart-badge-mobile" style="display: none;">0</span>
                        </button>
                        <div class="social-links">
                            <a href="https://www.instagram.com/mel_bookss?igsh=NmQ1emRoanQ5ZXhp&utm_source=qr" target="_blank" class="btn btn-outline-light btn-sm me-2" style="border-radius: 50%; padding: 6px;" aria-label="MelBooks Instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="https://www.instagram.com/books_and_bloom_cmr_?igsh=MXBlN3J5eXMzNTNkOQ%3D%3D&utm_source=qr" title="TikTok" class="btn btn-outline-light btn-sm" style="border-radius: 50%; padding: 6px;" aria-label="TikTok">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <!-- Mobile Menu (Toggled by Hamburger) -->
                <div class="row d-md-none">
                    <div class="col-12">
                        <nav id="mobile-navbar" class="d-none">
                            <ul class="menu-list-mobile list-unstyled text-center py-2">
                                <li class="menu-item-mobile mb-2">
                                    <a href="#fiction" class="btn btn-outline-light btn-sm w-100" style="border-radius: 20px;">Fiction</a>
                                </li>
                                <li class="menu-item-mobile">
                                    <a href="#non-fiction" class="btn btn-outline-light btn-sm w-100" style="border-radius: 20px;">Non-Fiction</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    `;
}

 export function initHeader() {
    const hamburger = document.querySelector(".hamburger");
    const mobileNavbar = document.getElementById("mobile-navbar");

    if (hamburger && mobileNavbar) {
        hamburger.addEventListener("click", () => {
            const isOpen = mobileNavbar.classList.contains("d-block");
            mobileNavbar.classList.toggle("d-none", isOpen);
            mobileNavbar.classList.toggle("d-block", !isOpen);
            hamburger.setAttribute("aria-expanded", !isOpen);
        });
    }

    // Handle Fiction/Non-Fiction button clicks to switch tabs in book-list
    document.querySelectorAll('.menu-list a').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const genre = btn.textContent; // "Fiction" or "Non-Fiction"
            // Find and click the corresponding tab in book-list
            const tab = document.querySelector(`#genre-tabs .nav-link[data-genre="${genre}"]`);
            if (tab) {
                tab.click();
            }
            // Smooth scroll to book-list section
            document.getElementById('book-list').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Handle mobile menu buttons too (if needed)
    document.querySelectorAll('.menu-list-mobile a').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const genre = btn.textContent; // "Fiction" or "Non-Fiction"
            const tab = document.querySelector(`#genre-tabs .nav-link[data-genre="${genre}"]`);
            if (tab) {
                tab.click();
            }
            document.getElementById('book-list').scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu after click
            mobileNavbar.classList.add('d-none');
            mobileNavbar.classList.remove('d-block');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Update mobile cart badge
    function updateMobileBadge() {
        const badge = document.getElementById("cart-badge-mobile");
        const desktopBadge = document.getElementById("cart-badge");
        if (badge && desktopBadge) {
            badge.textContent = desktopBadge.textContent;
            badge.style.display = desktopBadge.style.display;
        }
    }
    // Call this when cart updates (integrate with book-list.js if needed)
    updateMobileBadge();
}