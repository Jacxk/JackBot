const themes = [
    {
        name: "default",
        path: "./images/themes_examples/default.jpg",
        category: "Other"
    },
    {
        name: "counted",
        path: "./images/themes_examples/counted.jpg",
        category: "Other"
    },
    {
        name: "fnt-1",
        path: "./images/themes_examples/fnt-1.jpg",
        category: "Fortnite"
    },
    {
        name: "fnt-2",
        path: "./images/themes_examples/fnt-2.jpg",
        category: "Fortnite"
    },
    {
        name: "fnt-3",
        path: "./images/themes_examples/fnt-3.jpg",
        category: "Fortnite"
    },
    {
        name: "mc-1",
        path: "./images/themes_examples/mc-1.jpg",
        category: "Minecraft"
    },
    {
        name: "mc-2",
        path: "./images/themes_examples/mc-2.jpg",
        category: "Minecraft"
    },
    {
        name: "mc-3",
        path: "./images/themes_examples/mc-3.jpg",
        category: "Minecraft"
    },
    {
        name: "code-1",
        path: "./images/themes_examples/code-1.jpg",
        category: "Coding"
    },
    {
        name: "code-2",
        path: "./images/themes_examples/code-2.jpg",
        category: "Coding"
    }
];

function getTheme(category) {
    let html = '';
    themes.forEach((value) => {
        if (category.toLowerCase() !== value.category.toLowerCase() && category.toLowerCase() !== 'all') return;
        html += '<div class="joinThemesBox">';
        html += '<div class="card-body">';
        html += `<h5 class="card-title" style="font-size: 32px"><b>Name: </b>${value.name}<br><b>Category: </b>${value.category}</h5>`;
        html += `<hr style="background-color: #18191c">`;
        html += `<pre class="card-text" style="font-size: 18px">`;
        html += `<img src="${value.path}" alt="${value.name}" class="themePicture">`;
        html += '</pre></div></div>'
    });
    document.getElementById('containerDiv').innerHTML = html;
}

function search() {
    const input = document.getElementById("searchBox");
    const filter = input.value.toUpperCase();

    const mainDiv = document.getElementById("containerDiv");
    const subDivs = mainDiv.getElementsByTagName("div");

    for (let i = 0; i < subDivs.length; i++) {
        const header = subDivs[i].getElementsByTagName("h5")[0];

        if (header.innerHTML.toUpperCase().includes(filter)) subDivs[i].style.display = "";
        else subDivs[i].style.display = "none";

    }
}

getTheme('All');
