export function renderFooter() {
    return `
                <footer id="footer" class="bg-dark text-white py-2">
                        <div class="container">
                                <div class="row align-items-center">
                                        <!-- Logo and Description -->
                                        <div class="col-md-3 mb-3 mb-md-0">
                                                <div class="company-brand">
                                                        <img src="images/melbooks-logo.png" alt="MelBooks Logo" class="footer-logo mb-2" style="max-height: 50px;">
                                                        <p>MelBooks - Your trusted bookstore in Cameroon. Swift nationwide delivery.</p>
                                                </div>
                                        </div>
                                        <!-- Quick Info -->
                                        <div class="col-md-3 mb-3 mb-md-0">
                                                <div class="footer-info">
                                                        <h5>Quick Info</h5>
                                                        <ul class="list-unstyled small">
                                                                <li>📚 Fiction and Non-Fiction</li>
                                                                <li>✍️ Book Reviews, Key Lessons &amp; Recommendations</li>
                                                                <li>@books_and_bloom_cmr_ for fiction lovers</li>
                                                                <li>🚚 Swift Nationwide Delivery</li>
                                                                <li>
                                                                        <a href="https://wa.me/237651293991?text=${encodeURIComponent("Hello MelBooks! I came across your website and I'm intrigued by your collection of books. What recommendations do you have for a captivating read in fiction or non-fiction?")}" target="_blank" class="text-white text-decoration-none">
                                                                                <i class="fab fa-whatsapp"></i> Chat with us
                                                                        </a>

                                                                        
                                                                </li>
                                                        </ul>
                                                </div>
                                        </div>
                                        <!-- Links -->
                                        <div class="col-md-3 mb-3 mb-md-0 text-center">
                                                <div class="footer-menu">
                                                        <h5>About Us</h5>
                                                        <ul class="list-unstyled">
                                                                <li><a href="https://www.instagram.com/mel_bookss/reel/C6EL0xmNSr7/" class="text-white text-decoration-none">Get to Know Me</a></li>
                                                                <li><a href="https://www.instagram.com/mel_bookss/reels/" class="text-white text-decoration-none">Reels</a></li>
                                                        </ul>
                                                </div>
                                        </div>
                                        <!-- Social Links -->
                                        <div class="col-md-3 text-center text-md-end">
                                                <div class="social-links">
                                                     <a href="https://www.instagram.com/mel_bookss?igsh=NmQ1emRoanQ5ZXhp&utm_source=qr" target="_blank" class="btn btn-outline-light btn-sm me-2" style="border-radius: 50%; padding: 8px;" aria-label="MelBooks Instagram">
                                                                <i class="fab fa-instagram"></i>
                                                        </a>
                                                        <a href="https://www.instagram.com/books_and_bloom_cmr_?igsh=MXBlN3J5eXMzNTNkOQ%3D%3D&utm_source=qr" title="TikTok" class="btn btn-outline-light btn-sm" style="border-radius: 50%; padding: 8px;" aria-label="TikTok">
                                                                <i class="fab fa-instagram"></i>
                                                        </a>
                                                </div>
                                        </div>
                                </div>
                                <!-- Bottom Section -->
                                <hr class="mt-4">
                                <div class="row">
                                        <div class="col-12 text-center">
                                                <p class="mb-0">&copy; 2025 MelBooks. All rights reserved. Made With 🩵 By <a href="https://techwithdilan.dev/" taret="_blank">@techwithdilan</a></p>
                                        </div>
                                </div>
                        </div>
                </footer>
        `;
}
