// TODO add flipping animation for toggle
// TODO scatter pieces across
// add toggle
var mode = true; // true for shape, false for movement
var shapeMap = new Map();
var mvmntMap = new Map();

// Initialize shapeMap and mvmntMap
for (var i = 1; i < 13; i++) {
    const sKey = "S-" + i.toString();
    const mKey = "M-" + i.toString();
    shapeMap.set(sKey, new Set());
    mvmntMap.set(mKey, new Set());
}

const toggle = document.getElementById("toggle");
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;

toggle.addEventListener('click', () => {
    mode = !mode;
    let type, show;

    if (!mode) {
        type = document.querySelectorAll(".shape");
        show = document.querySelectorAll(".movement");
    } else {
        type = document.querySelectorAll(".movement");
        show = document.querySelectorAll(".shape");
    }

    type.forEach(div => div.style.display = "none");
    show.forEach(div => div.style.display = "block");
});

// Make each div draggable
const pieces = document.querySelectorAll(".piece");

pieces.forEach(piece => {
    piece.addEventListener('mousedown', function(e) {
        var offsetX = e.clientX - parseInt(window.getComputedStyle(this).left);
        var offsetY = e.clientY - parseInt(window.getComputedStyle(this).top);

        const el = this;
        const currID = this.id;

        function mouseMoveHandler(e) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + el.offsetWidth > maxWidth) newX = maxWidth - el.offsetWidth;
            if (newY + el.offsetHeight > maxHeight) newY = maxHeight - el.offsetHeight;

            let collisionDetected = false;

            // Prevent overlap with other pieces
            for (let other of pieces) {
                if (other !== el) {
                    const rectA = el.getBoundingClientRect();
                    const rectB = other.getBoundingClientRect();

                    if (
                        newX < rectB.right &&
                        newX + rectA.width > rectB.left &&
                        newY < rectB.bottom &&
                        newY + rectA.height > rectB.top
                    ) {
                        collisionDetected = true;
                        const otherID = other.id;

                        if (mode) {
                            shapeMap.get(currID).add(otherID);
                            shapeMap.get(otherID).add(currID);
                        } else {
                            mvmntMap.get(currID).add(otherID);
                            mvmntMap.get(otherID).add(currID);
                        }

                        // el.style.backgroundColor = 'red';
                        // other.style.backgroundColor = 'red';
                        addAnimation(el, other);
                    }
                }
            }

            if (!collisionDetected) {
                removeAnimation(el);
                el.style.left = newX + 'px';
                el.style.top = newY + 'px';
            }
        }

        function reset() {
            window.removeEventListener('mousemove', mouseMoveHandler);
            window.removeEventListener('mouseup', reset);
        }

        window.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', reset);
    });
});

// Scatter divs around the screen
document.addEventListener('DOMContentLoaded', () => {
    const pieces = document.querySelectorAll(".piece");

    pieces.forEach(piece => {
        const pieceWidth = piece.offsetWidth;
        const pieceHeight = piece.offsetHeight;

        const randomX = Math.floor(Math.random() * (maxWidth - pieceWidth));
        const randomY = Math.floor(Math.random() * (maxHeight - pieceHeight));

        piece.style.left = `${randomX}px`;
        piece.style.top = `${randomY}px`;
    });

    const type = document.querySelectorAll(".movement");
    type.forEach(div => div.style.display = "none");
});

const addAnimation = (elem1, elem2) => {
    const class1 = elem1.className.split(/\s+/)[3];
    const class2 = elem2.className.split(/\s+/)[3];
    const children1 = elem1.children[0];
    const children2 = elem2.children[0];

    // if (class1 === 'solid') {
        children1.style.animationPlayState = "running";
    // }

    // if (class2 === 'solid') {
        children2.style.animationPlayState = "running";
    // }
};

const removeAnimation = (elem1) => {
    const class1 = elem1.className.split(/\s+/)[3];
    const children1 = elem1.children[0];

    // if (class1 === 'solid') {
        children1.style.animationPlayState = 'paused';
    // }

    let nbrs = mode ? shapeMap.get(elem1.id) : mvmntMap.get(elem1.id);
    if (nbrs) {
        for (const key of nbrs) {
            const nbrVals = mode ? shapeMap.get(key) : mvmntMap.get(key);
            nbrVals.delete(elem1.id);
            if (nbrVals.size === 0) {
                const elem2 = document.getElementById(key);
                const class2 = elem2.className.split(/\s+/)[3];
                const children2 = elem2.children[0];

                // if (class2 === 'solid') {
                    children2.style.animationPlayState = 'paused';
                // }
            }
            if (mode) {
                shapeMap.set(key, nbrVals);
            } else {
                mvmntMap.set(key, nbrVals);
            }
        }
    }
    if (mode) {
        shapeMap.set(elem1.id, new Set());
    } else {
        mvmntMap.set(elem1.id, new Set());
    }
};
