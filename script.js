// add try-catch for non-present results in similarity, lookup and show
// try adding tries implementation with all small letters
// better the look of system

const search_button = document.getElementById('enter');
const search_box = document.getElementById('searchbox');
const body = document.getElementById('lowerbody');

const similarity = await loadSim();
const lookup = await loadData('lookup');
const show = await loadData('show');
// console.log(show)

async function loadData(file) {
    const response = await fetch(`model/${file}.csv`);
    const dataStr = await response.text();
    let data = dataStr.split('\n');
    data.forEach((val, idx) => {
        data[idx] = val.substring(0,val.length-1);
    })

    if(file === 'lookup'){
        data = Object.fromEntries(Object.entries(data).map(([k, v]) => [v, k]));
    }
    return data;
}

async function loadSim() {
    const response = await fetch('model/res.csv');
    const dataStr = await response.text();
    const formattedData = await formatData(dataStr);
    return formattedData;
}

async function formatData(dataStr){
    const data = dataStr.split('\n');
    let formattedData = [];
    let idx = -1;
    data.forEach(row => {
        row = row.split(',');
        formattedData.push([]);
        idx++;
        row.forEach(val => {
            let valArr = val.split('|');
            let tempIdx= 0;
            valArr.forEach(field => {
                valArr[tempIdx] = parseFloat(field);
                tempIdx++;
            })
            formattedData[idx].push((valArr));
        })
    });
    return formattedData;
}

function showResults(str){
    str = str.toLowerCase();
    str = str.replace(/\W*[_]*/g,'');
    const idx = lookup[str];
    const to_show_arr = similarity[idx];
    const to_show = [];
    let LIMIT = 15;
    for(let mov of to_show_arr){
        if(LIMIT > 0){
            to_show.push(mov[0])
            LIMIT--;
        }
    }
    to_show.forEach(idx => {
        createElement(idx);
    });
    // console.log(body);
}

function getData(movie_name, obj){
    let to_show = null;
    for(let movie_obj of obj['data']['Search']){
        if(movie_obj['Title'] == movie_name){
            to_show = movie_obj;
            break;
        }
    }
    return [to_show['Poster'], to_show['imdbID']];
}


function createElement(movie_idx){
    let movie_name = show[movie_idx];
    axios.get(' http://www.omdbapi.com/?apikey=967cdd48&s='+movie_name)
        .then((response) => {
            const [poster, id] = getData(movie_name, response);
            let child = document.createElement("div");
            child.classList.add('movie-container');
            child.innerHTML += `
                <img src="${poster}">
                <button class="btn" onclick="window.open('https://www.imdb.com/title/${id}', '_blank');">Show imdb</button>
            `;
            body.appendChild(child);
        })
        .catch((err) => {
            console.log(err);
        });
}

function clearResults(){
    body.innerHTML = '';
}

search_button.addEventListener("click", () => {
    const movie = search_box.value;
    // console.log(movie);
    clearResults();
    showResults(movie);
});