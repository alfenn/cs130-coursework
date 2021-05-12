/**
 * 
 * -------------------------------------
 * DOM Manipulation / Traversal Activity
 * -------------------------------------
 * 
 * 1. Create and attach an event handler (function) to each ".image" 
 * element so that when the ".image" element is clicked, the corresponding 
 * image loads in the .featured image element.
 * 
 * 2. Create event handlers for the next and previous buttons. The next button should
 *    show the next image in the thumbnail list. The previous should show the previous.
 * 
 * 3. If you get to the end, start at the beginning. 
 * 
 * 4. If you get to the beginning, loop around to the end.
 * 
 * 
 */

const images = [
    'images/field1.jpg',
    'images/purple.jpg',
    'images/jar.jpg',
    'images/green.jpg',
    'images/green1.jpg',
    'images/purple1.jpg',
    'images/magnolias.jpg',
    'images/daisy1.jpg'
];

const initScreen = () => {
    images.forEach((image, idx) => {
        document.querySelector('.cards').innerHTML += `
            <li class="card">
                <div class="image" 
                    style="background-image:url('${image}')"
                    data-index="${idx}"></div>
            </li>`;
    });
};

initScreen();

document.querySelectorAll('[data-index="0"]')[1].className += ' selected';

// ----------- 1. Implement the Thumbnail Click Event Handler -------------

let currentIndex = 0;
const featuredImageElem = document.querySelector('.featured_image');

// create event handler
const showImage = (ev) => {
    // remove '.selected' from current selected element
    document.querySelector('.selected').className = 'image';

    const elem = ev.currentTarget;
    currentIndex = parseInt(elem.dataset.index);

    console.log(`current index: ${currentIndex}`)
    console.log(images[currentIndex]);

    featuredImageElem.style.backgroundImage = `url("${images[currentIndex]}")`;
    featuredImageElem.dataset.index = currentIndex;
    // document.querySelector('.featured_image').style.backgroundImage = elem.style.backgroundImage;

    // ------------ debugging -------------------    
    // const x = `url("${images[currentIndex]}")`;
    // const y = elem.style.backgroundImage;
    // console.log(`elem.style.backgroundImage: ${y}`);
    // console.log(`images[currentIndex]: ${x}`);
    // console.log(`checking strict equality: ${x === y}`)

    // updating the border on the cards
    // console.log(document.querySelectorAll(`[data-index="${currentIndex}"]`))
    document.querySelectorAll(`[data-index="${currentIndex}"]`)[1].className += ' selected';
}

// attach onclick event of cards to event handler
const imageElements = document.querySelectorAll('.image');
for (const elem of imageElements) {
    elem.addEventListener('click', showImage);
}

// ------- 2. Implement the Next and Previous Click Event Handlers ----------------

// create the event handlers
const showPrev = (ev) => {
    // remove '.selected' from current selected element
    document.querySelector('.selected').className = 'image';

    currentIndex = (currentIndex - 1) % images.length;
    if (currentIndex < 0) currentIndex = images.length - 1;
    // console.log(`current index: ${currentIndex}`);
    featuredImageElem.style.backgroundImage = `url('${images[currentIndex]}')`;
    featuredImageElem.dataset.index = currentIndex;

    // updating the border on the cards
    document.querySelectorAll(`[data-index="${currentIndex}"]`)[1].className += ' selected';
}

const showNext = (ev) => {
    // remove '.selected' from current selected element
    document.querySelector('.selected').className = 'image';

    currentIndex = (currentIndex + 1) % images.length;
    if (currentIndex < 0) currentIndex = images.length - 1;
    console.log(`current index: ${currentIndex}`);
    featuredImageElem.style.backgroundImage = `url('${images[currentIndex]}')`;
    featuredImageElem.dataset.index = currentIndex;

    // updating the border on the cards
    document.querySelectorAll(`[data-index="${currentIndex}"]`)[1].className += ' selected';
}

// attach event handlers to the onclick events of the previous and next buttons
document.querySelector('.prev').addEventListener('click', showPrev);
document.querySelector('.next').addEventListener('click', showNext);
document.querySelector('.featured_image').addEventListener('click', showNext);