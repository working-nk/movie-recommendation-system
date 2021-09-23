// add try-catch for non-present results
// add api to show images, and link
// try adding tries implementation with all small letters

const search_button = document.getElementById('enter');
const search_box = document.getElementById('searchbox');
const body = document.getElementById('lowerbody');

const similarity = await loadSim();
const lookup = await loadData('lookup');
const show = await loadData('show');
console.log(show)

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
    let LIMIT = 8;
    for(let mov of to_show_arr){
        if(LIMIT > 0){
            to_show.push(mov[0])
            LIMIT--;
        }
    }
    to_show.forEach(idx => {
        createElement(idx);
    })
}

function createElement(movie_idx){
    let movie_name = show[movie_idx];
    let child = document.createElement("div");
    child.classList.add('movie-container');
    child.innerHTML = movie_name;
    body.appendChild(child);
}

function clearResults(){
    body.innerHTML = '';
}

search_button.addEventListener("click", () => {
    const movie = search_box.value;
    console.log(movie);
    clearResults();
    showResults(movie)
})