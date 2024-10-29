// TODO add flipping animation for toggle
// TODO scatter pieces across
// add toggle
var mode = true; // true for shape, false for movement
const toggle = document.getElementById("toggle");
const maxWidth = window.innerWidth;
const maxHeight = window.innerHeight;

toggle.addEventListener('click', () => {
    mode = !mode;
    let type;
    let show;
    if (!mode) {
        type = document.querySelectorAll(".shape");
        show = document.querySelectorAll(".movement");
    } else {
        type = document.querySelectorAll(".movement");
        show = document.querySelectorAll(".shape");
    }

    type.forEach(div => {
        div.style.display = "none";
    });

    show.forEach(div => {
        div.style.display = "block";
    })
});

// make each div draggable
const pieces = document.querySelectorAll(".piece");

pieces.forEach(piece => {
    piece.addEventListener('mousedown', function(e) {
        var offsetX = e.clientX - parseInt(window.getComputedStyle(this).left);
        var offsetY = e.clientY - parseInt(window.getComputedStyle(this).top);
        
        const el = this; // Reference to the current piece
        console.log(el);
        function mouseMoveHandler(e) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0; 
            if (newX + el.offsetWidth > maxWidth) newX = viewportWidth - el.offsetWidth; 
            if (newY + el.offsetHeight > maxHeight) newY = viewportHeight - el.offsetHeight;

            let collisionDetected = false;

            // Prevent overlap with other pieces
            for (let other of pieces) {
                if (other !== el) {
                    const rectA = el.getBoundingClientRect();
                    const rectB = other.getBoundingClientRect();

                    // Check for collision
                    if (
                        (newX < rectB.right &&
                        newX + rectA.width > rectB.left &&
                        newY < rectB.bottom &&
                        newY + rectA.height > rectB.top)
                    ) {
                        // if collision
                        collisionDetected = true;
                        

                        // trigger animation for pieces
                        // Change colors of both pieces
                        el.style.backgroundColor = 'red';
                        other.style.backgroundColor = 'red';
                        addAnimation(el, other);
                    } 
                }
            }

            // update position if no collision
            if (!collisionDetected) {
                removeAnimation(el);
                el.style.left = newX + 'px';
                el.style.top = newY + 'px';
                el.style.backgroundColor = 'purple'; // Reset to default color
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


// scatter div around screen
document.addEventListener('DOMContentLoaded', () => {
    // scatter
    // set to off
    const type = document.querySelectorAll(".movement");
    type.forEach(div => {
        div.style.display = "none";
    });
})

const addAnimation = (elem1, elem2) => {
    // get the class
    console.log(elem1);
    const class1 = elem1.className.split(/\s+/)[3];
    const class2 = elem2.className.split(/\s+/)[3];
    const children1 = elem1.children[0];
    const children2 = elem2.children[0];
    if (class1 === 'solid') {
        children1.classList.add('falling');
    }

    if (class2 === 'solid') {
        children2.classList.add('falling');
    }
}

const removeAnimation = (elem1) => {
    // get the class
    const class1 = elem1.className.split(/\s+/)[3];
    // const class2 = elem2.className.split(/\s+/)[3];
    const children1 = elem1.children[0];
    // const children2 = elem2.children[0];
    if (class1 === 'solid') {
        children1.classList.remove('falling');
    }

    // if (class2 === 'solid') {
    //     children2.classList.remove('falling');
    // }
}