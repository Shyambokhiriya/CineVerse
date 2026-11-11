document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if(!user || user.role !== 'admin') { window.location.href = '../auth.html'; return; }
    
    document.getElementById('admin-name').innerText = user.name;
    
    const path = window.location.pathname;
    if(path.includes('dashboard.html')) initDashboard();
    else if(path.includes('movies.html')) initManageMovies();
    else if(path.includes('movie-form.html')) initMovieForm();
    else if(path.includes('categories.html')) initCategories();
    else if(path.includes('users.html')) initUsers();
});

function initDashboard() {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const cats = JSON.parse(localStorage.getItem('categories')) || [];
    
    document.getElementById('stat-movies').innerText = movies.filter(m=>m.type==='Movie').length;
    document.getElementById('stat-series').innerText = movies.filter(m=>m.type==='Web Series').length;
    document.getElementById('stat-users').innerText = users.length;
    document.getElementById('stat-categories').innerText = cats.length;

    const tbody = document.getElementById('recent-movies-tbody');
    if(tbody) {
        movies.slice(-5).reverse().forEach(m => {
            tbody.innerHTML += `<tr><td>${m.title}</td><td>${m.type}</td><td>${m.year}</td><td><i class="fas fa-star text-warning"></i> ${m.rating}</td></tr>`;
        });
    }
}

function initManageMovies() {
    const movies = JSON.parse(localStorage.getItem('movies')) || [];
    const tbody = document.getElementById('movies-tbody');
    tbody.innerHTML = '';
    movies.forEach(m => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${m.poster}" width="40" class="rounded"></td>
                <td>${m.title}</td>
                <td>${m.type}</td>
                <td>${m.year}</td>
                <td>${m.genre}</td>
                <td>
                    <a href="movie-form.html?edit=${m.id}" class="btn btn-sm btn-primary"><i class="fas fa-edit"></i></a>
                    <button class="btn btn-sm btn-danger" onclick="deleteMovie(${m.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function deleteMovie(id) {
    if(confirm('Delete this title?')) {
        let movies = JSON.parse(localStorage.getItem('movies')) || [];
        localStorage.setItem('movies', JSON.stringify(movies.filter(m => m.id !== id)));
        initManageMovies();
    }
}

function initMovieForm() {
    const cats = JSON.parse(localStorage.getItem('categories')) || [];
    const genreSelect = document.getElementById('movieGenre');
    cats.forEach(c => genreSelect.innerHTML += `<option value="${c}">${c}</option>`);

    const editId = new URLSearchParams(window.location.search).get('edit');
    if(editId) {
        document.getElementById('form-title').innerText = 'Edit Title';
        const movie = (JSON.parse(localStorage.getItem('movies')) || []).find(m => m.id == editId);
        if(movie) {
            ['Id','Title','Type','Genre','Year','Duration','Rating','Poster','Backdrop','Trailer','Desc','Director','Cast'].forEach(f => {
                document.getElementById('movie'+f).value = movie[f.toLowerCase()];
            });
        }
    }

    document.getElementById('movieForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        if(!form.checkValidity()) { form.classList.add('was-validated'); return; }
        
        let movies = JSON.parse(localStorage.getItem('movies')) || [];
        const id = document.getElementById('movieId').value || Date.now();
        const newMovie = { id: parseInt(id) };
        
        ['Title','Type','Genre','Year','Duration','Rating','Poster','Backdrop','Trailer','Desc','Director','Cast'].forEach(f => {
            let val = document.getElementById('movie'+f).value;
            newMovie[f.toLowerCase()] = (f === 'Year' || f === 'Rating') ? parseFloat(val) : val;
        });

        if(editId) movies = movies.map(m => m.id == editId ? newMovie : m);
        else movies.unshift(newMovie);
        
        localStorage.setItem('movies', JSON.stringify(movies));
        alert('Saved successfully!');
        window.location.href = 'movies.html';
    });
}

function initCategories() {
    const cats = JSON.parse(localStorage.getItem('categories')) || [];
    const list = document.getElementById('categories-list');
    list.innerHTML = '';
    cats.forEach((c, index) => {
        list.innerHTML += `<li class="list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-secondary">
            ${c} <button class="btn btn-sm btn-danger" onclick="deleteCategory(${index})"><i class="fas fa-trash"></i></button>
        </li>`;
    });

    document.getElementById('catForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newCat = document.getElementById('catName').value.trim();
        if(!newCat || cats.includes(newCat)) { alert('Invalid or duplicate category'); return; }
        cats.push(newCat);
        localStorage.setItem('categories', JSON.stringify(cats));
        document.getElementById('catName').value = '';
        initCategories();
    });
}

function deleteCategory(index) {
    if(confirm('Delete category?')) {
        let cats = JSON.parse(localStorage.getItem('categories')) || [];
        cats.splice(index, 1);
        localStorage.setItem('categories', JSON.stringify(cats));
        initCategories();
    }
}

function initUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = '';
    users.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td><span class="badge ${u.role==='admin'?'bg-primary':'bg-secondary'}">${u.role}</span></td>
                <td>${u.date}</td>
                <td>
                    <button class="btn btn-sm ${u.status==='Active'?'btn-success':'btn-warning'}" onclick="toggleUserStatus(${u.id})">${u.status}</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${u.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

function toggleUserStatus(id) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const u = users.find(u => u.id == id);
    if(u && u.role !== 'admin') {
        u.status = u.status === 'Active' ? 'Disabled' : 'Active';
        localStorage.setItem('users', JSON.stringify(users));
        initUsers();
    } else { alert('Cannot change admin status.'); }
}

function deleteUser(id) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const u = users.find(u => u.id == id);
    if(u && u.role === 'admin') { alert('Cannot delete admin.'); return; }
    if(confirm('Delete user?')) {
        localStorage.setItem('users', JSON.stringify(users.filter(u => u.id != id)));
        initUsers();
    }
}

function logoutAdmin() {
    localStorage.removeItem('currentUser');
    window.location.href = '../auth.html';
}