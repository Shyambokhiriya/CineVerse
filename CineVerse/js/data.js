function initData() {
    if(!localStorage.getItem('movies')) {
        const sampleData = [];
        const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Horror', 'Romance'];
        for(let i=1; i<=15; i++) {
            sampleData.push({
                id: i, title: `Cinematic Masterpiece ${i}`, type: 'Movie', genre: genres[i % genres.length],
                year: 2010 + (i%14), rating: (6 + (i%4) + 0.1*i).toFixed(1), duration: `${90 + i*5} min`,
                director: `Director ${i}`, cast: `Actor A, Actor B`,
                desc: `An incredible journey exploring the depths of human emotion and action-packed sequences. Movie ${i} is a must-watch.`,
                poster: `https://dummyimage.com/400x600/15151D/E50914&text=Movie+${i}`,
                backdrop: `https://dummyimage.com/1200x500/15151D/333&text=Movie+${i}+Backdrop`,
                trailer: 'https://www.youtube.com/embed/g6sUj-90Cks'
            });
        }
        for(let i=16; i<=20; i++) {
            sampleData.push({
                id: i, title: `Epic Web Series ${i}`, type: 'Web Series', genre: genres[i % genres.length],
                year: 2020 + (i%4), rating: (7 + (i%3) + 0.1*i).toFixed(1), duration: `${(i%3)+1} Seasons`,
                director: `Creator ${i}`, cast: `Actor C, Actor D`,
                desc: `A binge-worthy web series that will keep you on the edge of your seat with every episode.`,
                poster: `https://dummyimage.com/400x600/15151D/E50914&text=Series+${i}`,
                backdrop: `https://dummyimage.com/1200x500/15151D/333&text=Series+${i}+Backdrop`,
                trailer: 'https://www.youtube.com/embed/g6sUj-90Cks'
            });
        }
        localStorage.setItem('movies', JSON.stringify(sampleData));
    }
    
    if(!localStorage.getItem('categories')) {
        localStorage.setItem('categories', JSON.stringify(['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation']));
    }
    
    if(!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
            {id: 1, name: 'Admin', email: 'admin@cineverse.com', password: 'password123', role: 'admin', status: 'Active', date: '2026-01-01'},
            {id: 2, name: 'John Doe', email: 'user@cineverse.com', password: 'password123', role: 'user', status: 'Active', date: '2026-10-15'}
        ]));
    }
}
initData();