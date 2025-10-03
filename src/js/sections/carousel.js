// Dynamic carousel data array (easy to add/edit items)
const carouselItems = [
    {
        title: "Discover Amazing Stories",
        description: "Explore a world of captivating books that inspire and entertain. From thrilling adventures to heartfelt tales, find your next favorite read.",
        image: "images/main-banner1.jpg",
        link: "#" // Optional: Add a link for the "Read More" button
    },
    {
        title: "Expand Your Knowledge",
        description: "Dive into insightful non-fiction that challenges your mind. Learn from experts and broaden your horizons with every page.",
        image: "images/main-banner2.jpg",
        link: "#"
    },
    // Add more items here, e.g.:
    // { title: "New Release Alert", description: "Check out the latest books hitting the shelves.", image: "images/banner3.jpg", link: "#" }
];

export function renderCarousel() {
    const indicators = carouselItems.map((_, index) => `<button class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="Go to slide ${index + 1}"></button>`).join('');
    const slides = carouselItems.map((item, index) => `
        <div class="slider-item ${index === 0 ? 'active' : ''}" data-slide="${index}">
            <div class="banner-content">
                <h2 class="banner-title">${item.title}</h2>
                <p>${item.description}</p>
                <div class="btn-wrap">
                    <a href="${item.link || '#'}" class="btn btn-outline-accent btn-accent-arrow">Read More<i class="icon icon-ns-arrow-right"></i></a>
                </div>
            </div>
            <img src="${item.image}" alt="${item.title} banner" class="banner-image">
        </div>
    `).join('');

    return `
        <section id="billboard" class="carousel-section">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-10 col-lg-8">
                        <button class="prev slick-arrow" aria-label="Previous slide"><i class="icon icon-arrow-left"></i></button>
                        <div class="main-slider pattern-overlay" role="region" aria-live="polite" aria-label="Book carousel">
                            ${slides}
                        </div>
                        <button class="next slick-arrow" aria-label="Next slide"><i class="icon icon-arrow-right"></i></button>
                        <div class="carousel-indicators">
                            ${indicators}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}


export function initCarousel() {
    const slider = document.querySelector('.main-slider');
    const items = document.querySelectorAll('.slider-item');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = 0;
    let autoPlayInterval;
    const autoPlayDelay = 5000; // 5 seconds

    function showSlide(index) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % items.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        showSlide(prevIndex);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    indicators.forEach((ind, i) => {
        ind.addEventListener('click', () => showSlide(i));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Pause on hover/focus
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    prevBtn.addEventListener('focus', stopAutoPlay);
    nextBtn.addEventListener('focus', stopAutoPlay);
    indicators.forEach(ind => {
        ind.addEventListener('focus', stopAutoPlay);
        ind.addEventListener('blur', startAutoPlay);
    });

    // Touch/swipe support for mobile (improved for smoother UX)
    let startX = 0;
    let isSwiping = false;
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
        stopAutoPlay();
    });
    slider.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        // Optional: Add visual feedback during swipe, e.g., transform
    });
    slider.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        const endX = e.changedTouches[0].clientX;
        const deltaX = startX - endX;
        if (Math.abs(deltaX) > 50) { // Threshold for swipe
            if (deltaX > 0) nextSlide();
            else prevSlide();
        }
        isSwiping = false;
        setTimeout(startAutoPlay, 500); // Delay restart for better UX
    });

    // Start auto-play
    startAutoPlay();
}