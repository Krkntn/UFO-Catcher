/* ========= DOM Elements ========= */
const gameArea = document.getElementById("gameArea");
const crane = document.getElementById("crane");
const prize = document.getElementById("prize");
const winCount = document.getElementById("winCount");
const rightButton = document.getElementById("rightButton");

/* ========= Game State ========= */
const game = {
    craneX : 0,
    craneY : 0,
    dropping : false,
    lifting : false,
    grabbed : false,
    getPrize : false
}

let prizeX = Math.random() * 750;
prize.style.left = prizeX + "px";

/* ========= Movement Functions ========= */
function moveCrane(e) {
    if(!game.dropping) {
        if (e.key === "ArrowLeft" && game.craneX > 0) {
            game.craneX -= 10;
        }
        if (e.key === "ArrowRight" && game.craneX + crane.offsetWidth < gameArea.offsetWidth-3) {
            game.craneX += 10;
        }
        crane.style.left = game.craneX + "px";
    }
}

function moveCraneButton() {
    if(!game.dropping) {
        if (game.craneX + crane.offsetWidth < gameArea.offsetWidth-3) {
            game.craneX += 10;
        }
        crane.style.left = game.craneX + "px";
    }
}

function dropCrane(e) {
    if (e.code === "Space") {
        if (game.dropping) return;
        game.dropping = true;

        function animate() {
            game.craneY += 5;
            crane.style.top = game.craneY + "px";

            if (game.craneY + crane.offsetHeight < gameArea.offsetHeight) {
                requestAnimationFrame(animate);
            } else if(isColliding(crane, prize)) {
                prize.style.backgroundColor = "gold";
                game.grabbed = true;
                liftCrane();
            } else {
                liftCrane();
            }
        }
        animate();
    } 
}

function liftCrane() {
    if (game.lifting) return;
    game.lifting = true;

    function animate() {
        game.craneY -= 5;
        crane.style.top = game.craneY + "px";

        if (game.grabbed) {
            prize.style.top = (game.craneY + prize.offsetHeight) + "px";
        }

        if (game.craneY > 0) {
            requestAnimationFrame(animate);
        } else {
            crane.style.top = 0;
            game.lifting = false;
            turnbackCrane();
        }        
    }
    animate();
}

function turnbackCrane() {
    function animate() {
        game.craneX -= 10;
        crane.style.left = game.craneX + "px";

        if (game.grabbed) {
            prize.style.left = (game.craneX + crane.offsetWidth/2 - prize.offsetWidth/2) + "px";
        }

        if (game.craneX > 0) {    
            requestAnimationFrame(animate);
        } else {
            game.dropping = false;
            crane.style.left = 0;
            if (game.grabbed) {
                alert("You got the prize!");
                winCount.textContent = parseInt(winCount.textContent) + 1;
                
                prizeX = Math.random() * 750;
                prize.style.left = prizeX + "px";
                prize.style.top = null;
                prize.style.bottom = "0px";
                prize.style.backgroundColor = "green";
                game.grabbed = false;

            }
        }
    }
    animate();
}


/* ========= Utility Functions ========= */
function isColliding(rect1, rect2) {
    const r1 = rect1.getBoundingClientRect();
    const r2 = rect2.getBoundingClientRect();
    return (r1.right >= r2.right && 
            r1.left <= r2.left && 
            r1.bottom > r2.top);
}

/* ========= Event Listeners ========= */
document.addEventListener("keydown", moveCrane);

document.addEventListener("keydown", dropCrane);

let moveInterval;

    rightButton.addEventListener("mousedown", () => {
        moveInterval = setInterval(moveCraneButton, 50);
    });
    rightButton.addEventListener("mouseup", () => {
        clearInterval(moveInterval);
        dropCrane({code: "Space" });
    });

    rightButton.addEventListener("touchstart", () => {
        moveInterval = setInterval(moveCraneButton, 50);
    });
    rightButton.addEventListener("touchend", () => {
        clearInterval(moveInterval);
        dropCrane({code: "Space" });
    });

