let pageCount;
let current_page = 0;
let data;

const getScores = function (score) {
    soundsPause.play()
    const request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:8080/scoreBoard');
    request.send()
    request.addEventListener('load', function () {
        data = JSON.parse(this.responseText);
        scoresContainer.style.display = 'block'
        pageButtons.style.display = 'block'
        startBtn.style.display = 'none'
        btn.style.display = 'none'
        scoreText.style.display = 'none';
        current_page = 0
        renderHTML(data, current_page)
    });
}

function gameResult(e) {
    e.preventDefault();

    enterUser.style.display = 'none'
    const formData = new Object();
    formData.Name = inputName.value;
    formData.Score = parseInt(score.value);
    formData.Time = time.value;
    formData.Rank;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/scoreBoard', true);

    xhr.onload = function () {
        calculateUserResult(JSON.parse(xhr.responseText))
    }

    xhr.send(JSON.stringify(formData))
}

getScoresButton.addEventListener("click", getScores);
postScoreButton.addEventListener('submit', gameResult);

function calculateUserResult(data) {
    let ranking = 0;
    let percent = 0;
    percent = data.percent
    ranking = data.ranking
    
    showResult(data, ranking, percent)
}

function showResult(data, ranking, percent) {
    grid.style.display = 'none'
    scoresContainer.style.display = 'block'
    endMenu.style.display = 'none'
    pageButtons.style.display = 'none'
    scoreText.innerHTML = "You are in the top " + percent.toString() + "% with rank of " + ranking.toString();
    scoreText.style.display = 'block'

    html = "" 
    while (scoresTable.hasChildNodes()) {
         scoresTable.removeChild(scoresTable.firstChild);
     }
    for (i = 0; i < 5; i++) {
        let row = document.createElement('tr');
            html = '<td>' + data.sortedData_array[i].Rank + '</td><td>' + data.sortedData_array[i].Name + '</td><td>' + data.sortedData_array[i].Score + '</td><td>' + data.sortedData_array[i].Time + '</td>';
            row.innerHTML = html;
            scoresTable.appendChild(row)
    }
}

function renderHTML(data, current_page) {
    html = ""
    while (scoresTable.hasChildNodes()) {
        scoresTable.removeChild(scoresTable.firstChild);
    }
    let loop_start = 5 * current_page
    let loop_end = loop_start + 5

    pageCount = Math.ceil(data.length / 5)

    for (i = loop_start; i < loop_end; i++) {
        let row = document.createElement('tr');
        if (i < data.length) {
            html = '<td>' + data[i].Rank + '</td><td>' + data[i].Name + '</td><td>' + data[i].Score + '</td><td>' + data[i].Time + '</td>';
            row.innerHTML = html;
            scoresTable.appendChild(row)
        }
    }
    if ((current_page + 1 == pageCount && data.length % 5 > 0)) {
        addEmptyRows(data)
    }
    setupPagination(data)
}


//Creates pages for scoretable
function setupPagination(data) {
    while (pageButtons.hasChildNodes()) {
        pageButtons.removeChild(pageButtons.firstChild);
    }
    pageButtons.style.display = 'block'
    html = "";

    pageCount = Math.ceil(data.length / 5);
    for (let i = 1; i < pageCount + 1; i++) {
        let btn = paginationButton(i);
        pageButtons.appendChild(btn);
    }
}

function paginationButton(page) {
    let button = document.createElement('button');
    button.innerText = page;

    if (current_page == page - 1) button.classList.add('active');

    button.addEventListener('click', function () {
        soundsPause.play();
        current_page = page - 1;
        renderHTML(data, current_page);
    })

    return button
}

function addEmptyRows(data) {
    for (i = 0; i < (5 - (data.length % 5)); i++) {
        let row = document.createElement('tr');
        scoresTable.appendChild(row)
    }
}
