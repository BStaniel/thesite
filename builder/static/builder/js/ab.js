function toggleDrop() {
    document.getElementsByClassName("builder-dropdown")[0].classList.toggle("show");
    document.getElementsByClassName("bd")[0].classList.toggle("bd-selected");
}

window.onclick = function(event) {
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

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.g').forEach(item => {
        item.addEventListener('click', event => {
            document.getElementById(item.value).checked = true;
            game = item.innerText;
            document.getElementById("dropdown").innerHTML = `<img id="game-logo" src="/static/builder/images/output/logos/${item.value}.jpg"><div>${game}</div>`;
        })
    })
});