let form = document.forms.search

function display(event, value) {
    form.film.addEventListener(event, () => {
        document.querySelector('.clear').style.display = value;
    })
}
display('input', 'block')
display('focus', 'block')
document.querySelector('.clear').addEventListener('click', () => {
    form.reset()
})

let data, ratings;

function getAll() {
    const XHR = new XMLHttpRequest();
    XHR.open('GET', `http://www.omdbapi.com/?s=${searchFilm}&apikey=bcfad1e5`);
    XHR.onreadystatechange = function () {
        if (XHR.readyState === 4 && XHR.status === 200) {
            data = JSON.parse(XHR.responseText)
            if (data.Response === "True") {
                data.Search.forEach((elem, index) => {
                    let {
                        Poster,
                        Title,
                        Type,
                        Year,
                        imdbID
                    } = elem;
                })
                render()
                setTimeout(function () {
                    document.querySelector('.content').style.opacity = 1
                }, 300)
            }
        }
    }
    XHR.send()
}
let searchFilm
document.querySelector('.btnSearch').addEventListener('click', function (event) {
    document.querySelector('.clear').style.display = 'none';
    searchFilm = form.film.value
    getAll();
})

function render() {
    const films = data.Search;
    document.querySelector('.content').innerHTML = '';
    films.forEach(element => {
        let {
            Poster,
            Title,
            Type,
            Year,
            imdbID
        } = element;
        let template = `
             <div class="card">
             <img src="${Poster}" class="card-img-top" alt="...">
             <div class="card-information">
               <h5 class="card-title">${Title}</h5>
               <p class="movie-type">${Type}</p>
               <p class="movie-year">${Year}</p>
               <button type = "button" class="more-details " data-imdbID = "${imdbID}">More details</button> 
             </div>
           </div>
            `
        document.querySelector('.content').insertAdjacentHTML('beforeend', template);
    })
}
let ID;
document.querySelector('.content').addEventListener('mouseover', function (event) {
    ID = event.target.getAttribute('data-imdbID');
    if (event.target.classList.contains('more-details')) {
        event.target.setAttribute('data-bs-toggle', "modal")
        event.target.setAttribute("data-bs-target", "#exampleModal")
        getById()
    }
})

document.querySelector('.content').addEventListener('mouseout', function (event) {
    ID = event.target.getAttribute('data-imdbID');
    if (event.target.classList.contains('more-details')) {
        event.target.removeAttribute('data-bs-toggle', "modal")
        event.target.removeAttribute("data-bs-target", "#exampleModal")
    }
})
let dataFilm, ul, list

function getById() {
    const XHR = new XMLHttpRequest();
    XHR.open('GET', `http://www.omdbapi.com/?i=${ID}&apikey=bcfad1e5`);
    XHR.onreadystatechange = function () {
        if (XHR.readyState === 4 && XHR.status === 200) {
            dataFilm = JSON.parse(XHR.responseText)
            let {
                Poster,
                Title,
                Type,
                Year,
                Rated,
                Genre,
                Plot,
                Writer,
                Director,
                Actors,
                BoxOffice,
                Awards,
                Ratings
            } = dataFilm;
            if (dataFilm.Response === "True") {
                ul = document.createElement('ul')
                for (let i = 0; i < Ratings.length; i++) {
                    let li = document.createElement('li')
                    li.textContent += `${Ratings[i].Source} ${Ratings[i].Value}`;
                    ul.appendChild(li)
                }
                list = ul.outerHTML
                renderFilmInfo()
                setTimeout(function () {
                    document.querySelector('.content').style.opacity = 1
                }, 50)
            }
        }
    }
    XHR.send()
}
let template

function renderFilmInfo(event) {
    let film = dataFilm;
    let {
        Poster,
        Title,
        Year,
        Rated,
        Genre,
        Plot,
        Writer,
        Director,
        Actors,
        BoxOffice,
        Awards
    } = film;
    let modal = document.querySelector('#exampleModal');
    modal.innerHTML = `
    <div class="modal-dialog modal-xl">
    <div class="modal-content">
        <div class="modal-body">
            <div class="about-film">
                <div class="block-content">
                    <div class="poster">
                        <img id="film-image" src="${Poster}" alt="">
                    </div>
                    <div class="information">
                        <div id="title">${Title}</div>
                        <p id="Rated-year-genre">${Rated} ${Year} ${Genre}</p>
                        <p id="Plot">${Plot}</p>
                        <p class="written-by"><b>Written by: </b>${Writer}</p>
                        <p class="directed-by"><b>Directed by: </b>${Director}</p>
                        <p class="starring"><b>Starring: </b>${Actors}</p>
                        <p class="boxOffice"><b>BoxOffice: </b>${BoxOffice}</p>
                        <p class="awards"><b>Awards: </b>${Awards}</p>
                        <p class="ratings"><b>Ratings: </b>
                            ${list}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </div>
    </div>
    `
}
