const isHost = true; // apenas o host pode editar/adicionar

let movies = JSON.parse(localStorage.getItem("movies")) || [
    {title:"Homem-Aranha 2", year:2025, age:12, rating:7, image:""},
    {title:"Carros", year:2025, age:0, rating:8, image:""},
    {title:"Vingadores", year:2025, age:12, rating:9, image:""}
];

const moviesList = document.getElementById("moviesList");
const addMovieBtn = document.getElementById("addMovieBtn");
const searchInput = document.getElementById("searchInput");

const editPopup = document.getElementById("editPopup");
const editTitle = document.getElementById("editTitle");
const editYear = document.getElementById("editYear");
const editAge = document.getElementById("editAge");
const editRating = document.getElementById("editRating");
const editImage = document.getElementById("editImage");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let editIndex = null;

function saveMovies() {
    localStorage.setItem("movies", JSON.stringify(movies));
    renderMovies();
}

function renderMovies() {
    moviesList.innerHTML = "";
    const query = searchInput.value.toLowerCase();

    movies.forEach((m, i) => {
        if(!m.title.toLowerCase().includes(query)) return;

        const div = document.createElement("div");
        div.className = "movie-card";

        let imgTag = m.image ? `<img src="${m.image}">` : `<div style="width:100px;height:150px;background:#08121a;display:flex;align-items:center;justify-content:center;color:#888;font-size:12px;">Sem imagem</div>`;

        let editButton = isHost ? `<button onclick="editMovie(${i})">Editar</button>` : "";

        let deleteButton = isHost ? `<button onclick="deleteMovie(${i})">Eliminar</button>` : "";

        div.innerHTML = `
            ${imgTag}
            <div>
                <h3>${m.title}</h3>
                <p>Ano: ${m.year}</p>
                <p>Idade mínima: ${m.age}</p>
                <p>Avaliação: ${m.rating}</p>
                ${editButton}
                ${deleteButton}
            </div>
        `;
        moviesList.appendChild(div);
    });
}

// Adicionar filme
addMovieBtn.onclick = () => {
    if(!isHost) return;
    movies.push({title:"Novo Filme", year:2025, age:0, rating:5, image:""});
    saveMovies();
};

// Deletar filme
function deleteMovie(i) {
    if(!isHost) return;
    if(confirm("Tem a certeza que quer eliminar este filme?")) {
        movies.splice(i,1);
        saveMovies();
    }
}

// Editar filme
function editMovie(i) {
    if(!isHost) return;
    editIndex = i;
    const m = movies[i];
    editTitle.value = m.title;
    editYear.value = m.year;
    editAge.value = m.age;
    editRating.value = m.rating;
    editImage.value = "";
    editPopup.classList.remove("hidden");
}

// Cancelar edição
cancelEditBtn.onclick = () => {
    editPopup.classList.add("hidden");
}

// Salvar edição
saveEditBtn.onclick = () => {
    const m = movies[editIndex];
    m.title = editTitle.value;
    m.year = editYear.value;
    m.age = editAge.value;
    m.rating = editRating.value;

    const file = editImage.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = () => {
            m.image = reader.result;
            saveMovies();
            editPopup.classList.add("hidden");
        }
        reader.readAsDataURL(file);
    } else {
        saveMovies();
        editPopup.classList.add("hidden");
    }
}

// Pesquisa ao digitar
searchInput.addEventListener("input", () => {
    renderMovies();
});

// Render inicial
renderMovies();


