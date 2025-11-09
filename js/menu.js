const createButton = document.getElementById('createButton');
const manageButton = document.getElementById('manageButton');
const resultsButton = document.getElementById('resultsButton');
const menuLiteraly = document.getElementById('menuLiteraly');

createButton.addEventListener('click', function() {
    window.location.href = "./create.html";
})

manageButton.addEventListener('click', function() {
    window.location.href = "./manage.html";
})

resultsButton.addEventListener('click', function() {
    window.location.href = "./results.html";
})

menuLiteraly.addEventListener('click', function() {
    window.location.href = "https://youtu.be/dQw4w9WgXcQ?si=ikjNhtlICjVDam4U";
})
