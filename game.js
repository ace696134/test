let inventory = [];
let currentScene = "livingroom";

// ----------------------
// SCENES
// ----------------------
const scenes = {
    livingroom: {
        image: "scenes/livingroom.png",
        text: "A dark, dusty living room. The air is cold.",
        hotspots: [
            {
                x: 50, y: 40, w: 100, h: 120,
                action: () => goToScene("hallway"),
            },
            {
                x: 300, y: 300, w: 80, h: 80,
                action: () => pickUp("Rusty Key", "A rusty key lies on the floor.")
            }
        ]
    },

    hallway: {
        image: "scenes/hallway.png",
        text: "A narrow hallway. You feel watched.",
        hotspots: [
            {
                x: 10, y: 200, w: 100, h: 100,
                action: () => goToScene("livingroom")
            },
            {
                x: 400, y: 50, w: 120, h: 200,
                action: () => {
                    if (inventory.includes("Rusty Key")) {
                        goToScene("basement");
                    } else {
                        showText("The door is locked.");
                    }
                }
            }
        ]
    },

    basement: {
        image: "scenes/basement.png",
        text: "The basement smells of rot.",
        hotspots: []
    }
};

// ----------------------
// FUNCTIONS
// ----------------------

function startGame() {
    loadGame();
    loadScene(currentScene);
}

function loadScene(name) {
    currentScene = name;
    const scene = scenes[name];

    const sceneDiv = document.getElementById("scene");
    sceneDiv.innerHTML = "";
    sceneDiv.style.backgroundImage = `url('${scene.image}')`;

    scene.hotspots.forEach(h => createHotspot(h));

    showText(scene.text);
    updateInventory();
    saveGame();
}

function createHotspot(h) {
    const div = document.createElement("div");
    div.classList.add("hotspot");
    div.style.left = h.x + "px";
    div.style.top = h.y + "px";
    div.style.width = h.w + "px";
    div.style.height = h.h + "px";
    div.onclick = h.action;
    document.getElementById("scene").appendChild(div);
}

function goToScene(name) {
    loadScene(name);
}

function showText(t) {
    document.getElementById("text").innerText = t;
}

function pickUp(item, text) {
    if (!inventory.includes(item)) {
        inventory.push(item);
        showText(text);
        updateInventory();
        saveGame();
    }
}

function updateInventory() {
    const inv = document.getElementById("inventory");
    inv.innerHTML = "";
    inventory.forEach(i => {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerText = i;
        inv.appendChild(div);
    });
}

// ----------------------
// SAVE / LOAD
// ----------------------
function saveGame() {
    localStorage.setItem("pointclick_inventory", JSON.stringify(inventory));
    localStorage.setItem("pointclick_scene", currentScene);
}

function loadGame() {
    const inv = localStorage.getItem("pointclick_inventory");
    const sc = localStorage.getItem("pointclick_scene");

    if (inv) inventory = JSON.parse(inv);
    if (sc) currentScene = sc;
}