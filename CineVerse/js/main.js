document.addEventListener('DOMContentLoaded', () => {
    setupAuthNav();
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path.endsWith('/CineVerse/')) initHome();
    else if (path.includes('browse.html')) initBrowse();
    else if (path.includes('movie-details.html')) initDetails();
    else if (path.includes('watchlist.html')) initWatchlist();
});

function setupAuthNav() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const authLink = document.getElementById('auth-link');
    if(authLink && user) {
        authLink.innerHTML = `<li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle text-white" href="#" data-bs-toggle="dropdown"><i class="fas fa-user-circle"></i> ${user.name}</a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark">
                ${user.role === 'admin' && !window.location.pathname.includes('admin') ? '<li><a class="dropdown-item text-warning" href="admin/dashboard.html">Admin Dashboard</a></li>' : ''}
                <li><a class="dropdown-item text-danger" href="#" onclick="logout()">Logout</a></li>
            </ul>
        </li>`;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

function getMovies() { return JSON.parse(localStorage.getItem('movies')) || []; }

function renderMovieCards(movies, containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '';
    if(movies.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted">No results found.</p></div>';
        return;
    }
    movies.forEach(m => {
        container.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card movie-card h-100" onclick="window.location.href='movie-details.html?id=${m.id}'">
                    <img src="${m.poster}" class="card-img-top" alt="${m.title}">
                    <div class="card-body p-3">
                        <h6 class="card-title text-truncate mb-1 fw-bold">${m.title}</h6>
                        <div class="d-flex justify-content-between text-muted small">
                            <span>${m.year} &bull; ${m.type}</span>
                            <span><i class="fas fa-star text-warning"></i> ${m.rating}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function initHome() {
    const all = getMovies();
    renderMovieCards(all.slice(0,4), 'trending-movies');
    renderMovieCards(all.filter(m => m.type === 'Web Series').slice(0,4), 'popular-series');
    renderMovieCards(all.slice(-4).reverse(), 'recent-movies');
    
    if(all.length > 0) {
        const hero = all[0];
        document.getElementById('hero-title').innerText = hero.title;
        document.getElementById('hero-desc').innerText = hero.desc;
        document.getElementById('hero-banner').style.backgroundImage = `url(${hero.backdrop})`;
        document.getElementById('hero-watch-btn').onclick = () => window.location.href = `movie-details.html?id=${hero.id}`;
    }
}

function initBrowse() {
    const allMovies = getMovies();
    const cats = JSON.parse(localStorage.getItem('categories')) || [];
    const genreSelect = document.getElementById('filter-genre');
    cats.forEach(c => genreSelect.innerHTML += `<option value="${c}">${c}</option>`);
    
    renderMovieCards(allMovies, 'browse-grid');

    ['search-input', 'filter-genre', 'filter-type', 'sort-by'].forEach(id => {
        document.getElementById(id).addEventListener('input', applyFilters);
    });

    function applyFilters() {
        const query = document.getElementById('search-input').value.toLowerCase();
        const genre = document.getElementById('filter-genre').value;
        const type = document.getElementById('filter-type').value;
        const sort = document.getElementById('sort-by').value;

        let filtered = allMovies.filter(m => 
            m.title.toLowerCase().includes(query) &&
            (genre ? m.genre === genre : true) &&
            (type ? m.type === type : true)
        );

        if(sort === 'rating') filtered.sort((a,b) => b.rating - a.rating);
        else filtered.sort((a,b) => b.year - a.year);

        renderMovieCards(filtered, 'browse-grid');
    }
}

function initDetails() {
    const id = new URLSearchParams(window.location.search).get('id');
    const movie = getMovies().find(m => m.id == id);

    if(movie) {
        document.getElementById('movie-title').innerText = movie.title;
        document.getElementById('movie-meta').innerHTML = `<span>${movie.year} &bull; ${movie.duration} &bull; ${movie.genre} &bull; <i class="fas fa-star text-warning"></i> ${movie.rating}</span>`;
        document.getElementById('movie-desc').innerText = movie.desc;
        document.getElementById('movie-director').innerText = movie.director;
        document.getElementById('movie-cast').innerText = movie.cast;
        document.getElementById('movie-poster').src = movie.poster;
        document.getElementById('movie-banner').style.backgroundImage = `url(${movie.backdrop})`;
        document.getElementById('movie-trailer').src = movie.trailer;

        const watchBtn = document.getElementById('add-watchlist-btn');
        let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        if(watchlist.some(m => m.id == id)) {
            watchBtn.innerHTML = '<i class="fas fa-check"></i> In Watchlist';
            watchBtn.className = 'btn w-100 mb-2 btn-success';
        }
        watchBtn.onclick = () => toggleWatchlist(movie, watchBtn);
    } else {
        document.getElementById('details-container').innerHTML = '<h2 class="text-center mt-5 pt-5">Title not found</h2>';
    }
}

function toggleWatchlist(movie, btn) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const exists = watchlist.findIndex(m => m.id == movie.id);
    if(exists > -1) {
        watchlist.splice(exists, 1);
        btn.innerHTML = '<i class="fas fa-plus"></i> Add to Watchlist';
        btn.className = 'btn w-100 mb-2 btn-outline-light';
    } else {
        watchlist.push(movie);
        btn.innerHTML = '<i class="fas fa-check"></i> In Watchlist';
        btn.className = 'btn w-100 mb-2 btn-success';
    }
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

function initWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    renderMovieCards(watchlist, 'watchlist-grid');
    if(watchlist.length === 0) {
        document.getElementById('watchlist-grid').innerHTML = '<div class="col-12 text-center py-5"><h4 class="text-muted">Your watchlist is empty.</h4><a href="browse.html" class="btn btn-primary mt-3">Browse Titles</a></div>';
    }
}