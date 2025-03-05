const API_KEY = "89a35a25ba0045469fe102c155c4c3cd";
const url = "https://newsapi.org/v2/everything?q";


/* JavaScript for Carousel */
// const carousel = document.querySelector(".carousel");
// const prevBtn = document.querySelector(".prev");
// const nextBtn = document.querySelector(".next");
// let index = 0;

// function moveCarousel(direction) {
//     index += direction;
//     if (index < 0) {
//         index = carousel.children.length - 1;
//     } else if (index >= carousel.children.length) {
//         index = 0;
//     }
//     carousel.style.transform = `translateX(-${index * 100}%)`;
// }

// prevBtn.addEventListener("click", () => moveCarousel(-1));
// nextBtn.addEventListener("click", () => moveCarousel(1));

// setInterval(() => moveCarousel(1), 5000);



window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

// async function fetchNews(query) {
//     const res = await fetch(`${url}=${query}&apiKey=${API_KEY}`);
//     const data = await res.json();
//     bindData(data.articles);
// }
async function fetchNews(query) {
    try {
        const res = await fetch(`${url}=${query}&apiKey=${API_KEY}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        if (!data.articles) throw new Error("No articles found");
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}


function bindData(articles) {
    if (!articles || !Array.isArray(articles)) {
        console.error("Invalid articles data");
        return;
    }

    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});


// Select carousel elements
const carouselContainer = document.querySelector(".carousel");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let index = 0;

// Fetch news for carousel
// Fetch news for carousel
async function fetchCarouselNews() {
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=YOUR_API_KEY`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.articles || data.articles.length === 0) {
            throw new Error("No articles found for the carousel.");
        }

        displayCarousel(data.articles);
    } catch (error) {
        console.error("Error fetching carousel news:", error);
    }
}

// Display news in carousel
// Display news in carousel
function displayCarousel(articles) {
    if (!articles || articles.length === 0) {
        console.error("No news articles available for carousel.");
        return;
    }

    carouselContainer.innerHTML = ""; // Clear existing slides

    // Show only the first 5 news items
    articles.slice(0, 5).forEach((article, i) => {
        const slide = document.createElement("div");
        slide.classList.add("carousel-slide");

        // Handle missing images
        const imageUrl = article.urlToImage ? article.urlToImage : "default.jpg";

        slide.innerHTML = `
            <img src="${imageUrl}" alt="News Image">
            <div class="carousel-caption">
                <h3>${article.title || "No Title Available"}</h3>
                <p>${article.description || "No description available."}</p>
                <a href="${article.url}" target="_blank">Read More</a>
            </div>
        `;
        carouselContainer.appendChild(slide);
    });

    // Start the carousel with the first slide
    index = 0;
    updateCarousel();
}


// Move the carousel
function updateCarousel() {
    const slides = document.querySelectorAll(".carousel-slide");
    if (slides.length === 0) return;

    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(-${index * 100}%)`;
    });
}

// Button click events for carousel navigation
prevBtn.addEventListener("click", () => {
    index = (index > 0) ? index - 1 : carouselContainer.children.length - 1;
    updateCarousel();
});

nextBtn.addEventListener("click", () => {
    index = (index < carouselContainer.children.length - 1) ? index + 1 : 0;
    updateCarousel();
});

// Auto-slide every 5 seconds
setInterval(() => {
    index = (index < carouselContainer.children.length - 1) ? index + 1 : 0;
    updateCarousel();
}, 5000);

// Call function to fetch news
fetchCarouselNews();
