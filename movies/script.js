const searchInput = document.getElementById('searchInput');
const movieGrid = document.getElementById('movieGrid');
const loader = document.getElementById('loader');
const movieModal = document.getElementById('movieModal');
const modalDetails = document.getElementById('modalDetails');
const closeModal = document.getElementById('closeModal');
const watchlistBtn = document.getElementById('watchlistBtn');
const watchlistCount = document.getElementById('watchlistCount');
const tabBtns = document.querySelectorAll('.tab-btn');

// Trailer Modal Elements
const trailerModal = document.getElementById('trailerModal');
const trailerIframe = document.getElementById('trailerIframe');
const closeTrailerModal = document.getElementById('closeTrailerModal');

let debounceTimer;
let currentType = '';
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

updateWatchlistCount();

window.addEventListener('DOMContentLoaded', () => {
    fetchMovies('action', '');
});

searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();

    if (query.length === 0) {
        fetchMovies('action', currentType);
        return;
    }

    debounceTimer = setTimeout(() => {
        fetchMovies(query, currentType);
    }, 400);
});

tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentType = e.target.getAttribute('data-type');
        
        const query = searchInput.value.trim();
        const searchQuery = query.length > 0 ? query : 'action';
        fetchMovies(searchQuery, currentType);
    });
});

async function fetchMovies(query, type = '') {
    loader.classList.remove('hidden');
    movieGrid.innerHTML = '';

    try {
        let url = `https://www.omdbapi.com/?apikey=trilogy&s=${encodeURIComponent(query)}`;
        if (type) {
            url += `&type=${type}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        loader.classList.add('hidden');

        if (data.Response === 'True') {
            displayMovies(data.Search);
        } else {
            movieGrid.innerHTML = `
                <div class="welcome-state">
                    <i class="fa-solid fa-triangle-exclamation" style="color: #f43f5e;"></i>
                    <h2>No Results Found</h2>
                    <p>${data.Error}</p>
                </div>`;
        }
    } catch (error) {
        loader.classList.add('hidden');
        movieGrid.innerHTML = `<p style="text-align:center; color: #f43f5e; grid-column: 1/-1;">Network synchronization error.</p>`;
    }
}

function displayMovies(movies) {
    movieGrid.innerHTML = '';
    movies.forEach(movie => {
        const hasPoster = movie.Poster && movie.Poster !== 'N/A';
        const isSaved = watchlist.some(item => item.imdbID === movie.imdbID);

        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <button class="heart-btn ${isSaved ? 'active' : ''}" onclick="toggleWatchlist(event, '${movie.imdbID}', '${encodeURIComponent(movie.Title)}', '${encodeURIComponent(movie.Poster || '')}', '${movie.Year}')" title="Save to Watchlist">
                <i class="fa-solid fa-heart"></i>
            </button>
            <div class="poster-container">
                <span class="type-badge">${movie.Type}</span>
                ${hasPoster ? `<img src="${movie.Poster}" alt="" class="movie-poster" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop'">` : ''}
            </div>
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p class="movie-year"><i class="fa-regular fa-calendar"></i> ${movie.Year}</p>
            </div>
        `;

        if (!hasPoster) {
            card.querySelector('.poster-container').appendChild(createNoPosterElement());
        }

        card.addEventListener('click', (e) => {
            if (!e.target.closest('.heart-btn')) {
                fetchMovieDetails(movie.imdbID);
            }
        });

        movieGrid.appendChild(card);
    });
}

function createNoPosterElement() {
    const img = document.createElement('img');
    img.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop';
    img.alt = 'Default Cinematic Poster';
    img.className = 'movie-poster';
    return img;
}

window.toggleWatchlist = function(event, id, title, poster, year) {
    event.stopPropagation();
    title = decodeURIComponent(title);
    poster = decodeURIComponent(poster);

    const index = watchlist.findIndex(item => item.imdbID === id);
    const btn = event.currentTarget;

    if (index > -1) {
        watchlist.splice(index, 1);
        btn.classList.remove('active');
    } else {
        watchlist.push({ imdbID: id, Title: title, Poster: poster, Year: year, Type: 'movie' });
        btn.classList.add('active');
    }

    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    updateWatchlistCount();
}

watchlistBtn.addEventListener('click', () => {
    if (watchlist.length === 0) {
        movieGrid.innerHTML = `
            <div class="welcome-state">
                <i class="fa-solid fa-heart-crack" style="color: #f43f5e;"></i>
                <h2>Your Watchlist is Empty</h2>
                <p>Click the heart icon on any movie card to store items here.</p>
            </div>`;
        return;
    }
    displayMovies(watchlist);
});

function updateWatchlistCount() {
    watchlistCount.innerText = watchlist.length;
}

async function fetchMovieDetails(id) {
    try {
        loader.classList.remove('hidden');
        const response = await fetch(`https://www.omdbapi.com/?apikey=trilogy&i=${id}`);
        const movie = await response.json();
        loader.classList.add('hidden');

        const hasPoster = movie.Poster && movie.Poster !== 'N/Y' && movie.Poster !== 'N/A';
        const posterHTML = hasPoster 
            ? `<img src="${movie.Poster}" alt="${movie.Title}" onerror="this.src='https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop'">`
            : `<img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop" class="movie-poster" alt="No Poster">`;

        const movieTitleSafe = encodeURIComponent(movie.Title);

        modalDetails.innerHTML = `
            <div class="modal-flex">
                <div class="modal-poster-wrap">${posterHTML}</div>
                <div class="modal-details-text">
                    <h2>${movie.Title}</h2>
                    <div class="modal-meta-tags">
                        <span><i class="fa-solid fa-star" style="color: #f59e0b;"></i> ${movie.imdbRating}</span>
                        <span><i class="fa-regular fa-clock"></i> ${movie.Runtime}</span>
                        <span><i class="fa-regular fa-calendar"></i> ${movie.Year}</span>
                    </div>
                    <p class="genre-pill"><strong>Genre:</strong> ${movie.Genre}</p>
                    <p><span>Director:</span> ${movie.Director}</p>
                    <p><span>Cast:</span> ${movie.Actors}</p>
                    <p class="plot-text">${movie.Plot}</p>
                    
                    <div style="margin-top: 20px;">
                        <button onclick="playInAppTrailer('${movieTitleSafe}', '${movie.Year}')" class="trailer-btn" style="display: inline-flex; align-items: center; gap: 8px; background: #ef4444; color: #fff; padding: 10px 20px; border-radius: 12px; border: none; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: background 0.3s;">
                            <i class="fa-brands fa-youtube" style="font-size: 1.1rem;"></i> Watch Trailer
                        </button>
                    </div>
                </div>
            </div>
        `;
        movieModal.classList.remove('hidden');
    } catch (error) {
        loader.classList.add('hidden');
        alert('Could not fetch cinematic details.');
    }
}

// Highly reliable multi-endpoint video loader
window.playInAppTrailer = async function(title, year) {
    const decodedTitle = decodeURIComponent(title);
    const searchQuery = `${decodedTitle} ${year} trailer`;

    const btn = event.currentTarget;
    const oldText = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Loading Video...`;
    btn.disabled = true;

    // List of backup video proxy instances to guarantee response
    const endpoints = [
        `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(searchQuery)}&filter=videos`,
        `https://api.piped.private.coffee/search?q=${encodeURIComponent(searchQuery)}&filter=videos`,
        `https://pipedapi.mha.fi/search?q=${encodeURIComponent(searchQuery)}&filter=videos`
    ];

    let videoId = null;

    for (const url of endpoints) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3500);

            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json();
                if (data.items && data.items.length > 0) {
                    // Extract Video ID string
                    const rawUrl = data.items[0].url || '';
                    videoId = rawUrl.split('v=')[1] || data.items[0].id;
                    if (videoId) break;
                }
            }
        } catch (e) {
            continue; // try next endpoint if current fails
        }
    }

    if (videoId) {
        trailerIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
        trailerModal.classList.remove('hidden');
    } else {
        alert('Could not load in-app video right now. Please try again.');
    }

    btn.innerHTML = oldText;
    btn.disabled = false;
};

// Close Movie Details Modal
closeModal.addEventListener('click', () => movieModal.classList.add('hidden'));

// Close Trailer Video Modal & Stop Audio
closeTrailerModal.addEventListener('click', () => {
    trailerIframe.src = ''; 
    trailerModal.classList.add('hidden');
});

// Close Modals on Outside Click
window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        movieModal.classList.add('hidden');
    }
    if (e.target === trailerModal) {
        trailerIframe.src = '';
        trailerModal.classList.add('hidden');
    }
});