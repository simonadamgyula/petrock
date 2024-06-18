const petrock = document.getElementById('petrock');
const jokeBubble = document.getElementById('jokeBubble');

let timeout = null;
let hue = 0;
let saturation = 0;
var saturation_direction = 1;

petrock.onclick = () => {
    if (timeout) {
        clearTimeout(timeout);
    }

    fetch("/joke", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            petrock.classList.remove("dance");
            jokeBubble.innerHTML = data.joke;
            jokeBubble.style.visibility = "visible";

            timeout = setTimeout(() => {
                jokeBubble.innerHTML = "";
                jokeBubble.style.visibility = "hidden";
            }, 20000);
        })
}

setInterval(() => {
    hue = (saturation + Math.random() * 3);

    saturation = (saturation + Math.random() * 3 * saturation_direction) % 100;
    if (saturation < 0 || saturation > 100) saturation_direction *= -1;

    petrock.style.filter = `sepia(100%) hue-rotate(${hue}deg) brightness(80%) saturate(${saturation}%)`;
}, 200)

setInterval(() => {
    const random = Math.random();
    console.log(Math.floor(random * 2), Math.floor(random * 2) == 0)
    if (Math.floor(random * 4) == 0) {
        petrock.classList.add("dance");

        setTimeout(() => {
            petrock.classList.remove("dance");
        }, 20000);
    }
}, 2000);