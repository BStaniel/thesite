let itemLst = [];

let searchLst = [];
let chosenLst = [];
let chosenElements = [];

let currentPageChosen = 0;
let perPageChosen = 16;

let currentPageMain = 0;
let perPageMain = 20;

let currentGame = '';
var gameIdDct = {"csgo": 730,
                 "rust": 252490,
                 "tf2": 440,
                 "ut": 304930}

function getItemLst(control) {
fetch(`/static/builder/game_items/${control.value}.json`).then(function (response) {
	if (response.ok) {
	    currentGame = control.value;
        document.getElementById("dropdown").innerHTML = `<img id="game-logo" src="/static/builder/images/output/logos/${currentGame}.jpg"><div>${control.innerText}</div>`;
		return response.json();
	} else {
		return Promise.reject(response);
	}
})

.then(function (data) {
	itemLst = data;
    currentPageMain = 0;
    currentPageChosen = 0;
    chosenLst = [];
    chosenElements = [];
    renderLink();
    document.getElementById("link").setSelectionRange(0, 0);
	renderPage(itemLst);
})

.catch(function (err) {
	// There was an error
	console.warn('Error: ', err);
});
}

function searchItems() {
    searchValue = document.getElementById('search').value;
    searchLst = itemLst.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()));

    if (currentPageMain > totalPages(searchLst, perPageMain)) {
        currentPageMain = totalPages(searchLst, perPageMain);
    }

    renderPage(searchLst);
}

function chooseItem() {
    var itemName = this.querySelector('.builder-name').textContent;

    if (chosenLst.includes(itemName)) {
        this.classList.remove('item-selected');
        var itemIndex = chosenLst.indexOf(itemName);
        var removeItem = chosenLst.splice(itemIndex, 1);
        var removeElement = chosenElements.splice(itemIndex, 1);
    } else {
        this.classList.add('item-selected');
        chosenElements.push(this);
        chosenLst.push(itemName);
    }

    if (currentPageChosen < totalPages(chosenLst, perPageChosen)) {
        currentPageChosen = totalPages(chosenLst, perPageChosen);
    }

    renderPage(itemLst);
    if (document.getElementById('search').value.length > 0) {
        searchItems();
    }
    renderChosen();
    renderLink();
}

function removeItem() {
    var itemName = this.querySelector('.builder-name').textContent;

    this.classList.remove('item-selected');
    var itemIndex = chosenLst.indexOf(itemName);
    var removeItem = chosenLst.splice(itemIndex, 1);
    var removeElement = chosenElements.splice(itemIndex, 1);

    renderPage(itemLst);
    if (document.getElementById('search').value.length > 0) {
        searchItems();
    }
    renderChosen();
    renderLink();
}

function nextPage() {
    if (document.getElementById('search').value.length > 0) {
        if (currentPageMain >= totalPages(searchLst, perPageMain)) {
            return;
        }

        currentPageMain += 1;
        renderPage(searchLst);
        document.getElementById("item-page").classList.add('fadein');
        setTimeout(() => {document.getElementById("item-page").classList.remove('fadein');}, 300);
    } else {
        if (currentPageMain >= totalPages(itemLst, perPageMain)) {
            return;
        }

        currentPageMain += 1;
        renderPage(itemLst);
        document.getElementById("item-page").classList.add('fadein');
        setTimeout(() => {document.getElementById("item-page").classList.remove('fadein');}, 300);
    }
}

function previousPage() {
    if (document.getElementById('search').value.length > 0) {
        if (currentPageMain === 0) {
            return;
        }

        currentPageMain -= 1;
        renderPage(searchLst);
        document.getElementById("item-page").classList.add('fadein');
        setTimeout(() => {document.getElementById("item-page").classList.remove('fadein');}, 300);
    } else {
        if (currentPageMain === 0) {
            return;
        }

        currentPageMain -= 1;
        renderPage(itemLst);
        document.getElementById("item-page").classList.add('fadein');
        setTimeout(() => {document.getElementById("item-page").classList.remove('fadein');}, 300);
    }
}

function nextPageChosen() {
    if (currentPageChosen >= totalPages(chosenLst, perPageChosen)) {
        return;
    }

    currentPageChosen += 1;
    renderChosen(chosenElements);
    document.getElementById("builder-chosen-page").classList.add('fadein');
    setTimeout(() => {document.getElementById("builder-chosen-page").classList.remove('fadein');}, 300);
}

function previousPageChosen() {
    if (currentPageChosen === 0) {
        return;
    }

    currentPageChosen -= 1;
    renderChosen(chosenElements);
    document.getElementById("builder-chosen-page").classList.add('fadein');
    setTimeout(() => {document.getElementById("builder-chosen-page").classList.remove('fadein');}, 300);
}

function totalPages(items, perPage) {
    total = Math.ceil(items.length / perPage - 1);

    if (total < 0) {
        return 0;
    } else {
        return total;
    }
}

function getCurrentPage(items, perPage, currentPage) {
    return items.slice(currentPage * perPage, currentPage * perPage + perPage);
}

function renderPage(items) {
    let htmlText = ``;
    let page = getCurrentPage(items, perPageMain, currentPageMain);

    for (let i = 0; i < page.length; i++) {
        if (chosenLst.includes(page[i].name)) {
            htmlText += `<div class="item item-selected" `;
        } else {
            htmlText += `<div class="item" `;
        }

        htmlText += `style="background-image: url('/static/builder/images/${page[i].img_path}');">
        <div class="builder-name-holder">
        <span class="builder-name">${page[i].name}</span>
        </div>
        </div>`;
    }

    if (page.length < perPageMain) {
        for (let i = 0; i < perPageMain - page.length; i++)
            htmlText += `<div class="item-empty">
            </div>`;
    }
    document.getElementById("item-page").innerHTML = htmlText;
    document.getElementById("current-page-num").innerHTML = currentPageMain + 1;
    if (totalPages(items, perPageMain) + 1 === 0) {
        document.getElementById("total-page-num").innerHTML = 1;
    } else {
        document.getElementById("total-page-num").innerHTML = totalPages(items, perPageMain) + 1;
    }

    document.getElementById("total-items").innerHTML = items.length;
    item = document.getElementsByClassName('item');
    for (let i = 0; i < item.length; i++) {
        item[i].addEventListener('click', chooseItem);
    }

    if (currentPageMain === 0) {
        document.getElementById("pl").classList.remove("abh");
    } else {
        document.getElementById("pl").classList.add("abh");
    }
    if (currentPageMain === totalPages(items, perPageMain)) {
        document.getElementById("pr").classList.remove("abh");
    } else {
        document.getElementById("pr").classList.add("abh");
    }

    renderChosen();
}

function renderChosen() {
    let htmlText = ``;

    if (currentPageChosen >= 1 && currentPageChosen > totalPages(chosenElements, perPageChosen)) {
        currentPageChosen -= 1;
    }

    let page = getCurrentPage(chosenElements, perPageChosen, currentPageChosen);
    for (let i = 0; i < page.length; i++) {
        htmlText += page[i].outerHTML;
    }

    if (page.length < perPageChosen) {
        for (let i = 0; i < perPageChosen - page.length; i++)
            htmlText += `<div class="item-empty">
            </div>`;
    }

    document.getElementById("builder-chosen-page").innerHTML = htmlText;
    document.getElementById("chosen-page-num").innerHTML = currentPageChosen + 1;
    if (totalPages(chosenElements, perPageChosen) + 1 === 0) {
        document.getElementById("chosen-page-total").innerHTML = 1;
    } else {
        document.getElementById("chosen-page-total").innerHTML = totalPages(chosenElements, perPageChosen) + 1;
    }

    document.getElementById("total-items-c").innerText = chosenLst.length

    item = document.getElementsByClassName('item-selected');
    for (let i = 0; i < item.length; i++) {
        item[i].addEventListener('click', removeItem);
        item[i].removeEventListener('click', chooseItem);
    }

    if (currentPageChosen === 0) {
        document.getElementById("cl").classList.remove("abh");
    } else {
        document.getElementById("cl").classList.add("abh");
    }
    if (currentPageChosen === totalPages(chosenElements, perPageChosen)) {
        document.getElementById("cr").classList.remove("abh");
    } else {
        document.getElementById("cr").classList.add("abh");
    }

    if (mediaQuery.matches) {
        if (chosenLst.length < 4) {
            perPageChosen = 4;
        } else {
            perPageChosen = chosenLst.length;
        }
    } else {
        perPageChosen = 16;
    }

    document.getElementById('builder-chosen-page').scrollLeft = 200 * chosenLst.length;
}

function renderLink() {
    link = `https://steamcommunity.com/market/multisell?appid=${gameIdDct[currentGame]}&contextid=2&items[]=` + chosenLst.join('&items[]=');

    document.getElementById("link").value = link;
    document.getElementById("link").setSelectionRange(0, document.getElementById("link").value.length);
}

function redirect() {
    if (chosenLst.length === 0) {
        return;
    } else {
        var encodedLst = [];
        if (currentGame == 'csgo') {
            for (let i = 0; i < chosenLst.length; i++) {
                encodedLst.push(encodeURIComponent(chosenLst[i].replace('/', '-')));
            }
        } else {
            for (let i = 0; i < chosenLst.length; i++) {
                encodedLst.push(encodeURIComponent(chosenLst[i]));
            }
        }
        url = `https://steamcommunity.com/market/multisell?appid=${gameIdDct[currentGame]}&contextid=2&items[]=` + encodedLst.join('&items[]=');
        window.location.replace(url);
    }
}

function toggleDrop() {
    document.getElementsByClassName("builder-dropdown")[0].classList.toggle("show");
    document.getElementsByClassName("bd")[0].classList.toggle("bd-selected");
}

window.onclick = function(event) {
    if (!event.target.matches('.navigation')) {
        document.getElementsByClassName('navigation')[0].classList.remove('icon-show');
        document.getElementsByClassName('nav-links')[0].classList.remove('nav-links-show');
    }

    if (!event.target.matches('.bd')) {
        var dropdowns = document.getElementsByClassName("builder-dropdown");
        for (let i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
        if (document.getElementsByClassName("bd")[0].classList.contains("bd-selected")) {
            document.getElementsByClassName("bd")[0].classList.remove("bd-selected");
        }
    }
}

function navdrop() {
    document.getElementsByClassName('navigation')[0].classList.toggle('icon-show');
    document.getElementsByClassName('nav-links')[0].classList.toggle('nav-links-show');
}

let mediaQuery = window.matchMedia('(max-width: 1080px)')

if (mediaQuery.matches) {
    perPageMain = 12;
    if (chosenLst.length < 4) {
        perPageChosen = 4;
    } else {
        perPageChosen = chosenLst.length;
    }
} else {
    perPageChosen = 16;
}

document.addEventListener("DOMContentLoaded", () => {
    renderPage(itemLst);
    renderLink();
    document.getElementById("link").setSelectionRange(0, 0);
});