const makeBigger = () => {
   console.log('make font bigger!');
   let el = document.querySelector('.content');
   // deocument.querySelector('.content').style.
   let compStyles = window.getComputedStyle(el);
   let currentFontSize = parseFloat(compStyles.getPropertyValue('font-size'));

   el.style.fontSize = currentFontSize + 1 + 'px';
};

const makeSmaller = () => {
   console.log('make smaller!');
   let el = document.querySelector('.content');
   let currentFontSize = parseFloat(window.getComputedStyle(el).getPropertyValue('font-size'));
   el.style.fontSize = currentFontSize - 1 + 'px';
};

/*
document.querySelector(???).onclick = makeBigger;
document.querySelector(???).onclick = makeSmaller;
*/

document.querySelector('.a1').onclick = makeBigger;
document.querySelector('.a2').onclick = makeSmaller;