const defaultTheme = () => {
   console.log('switch to default theme');
   document.querySelector('.container').className = "container";
};

const oceanTheme = () => {
   console.log('switch to ocean theme');
   document.querySelector('.container').className = "container ocean";
};

const desertTheme = () => {
   console.log('switch to desert theme');
   document.querySelector('.container').className = "container desert";
};


document.querySelector('#default').onclick = defaultTheme;
document.querySelector('#ocean').onclick = oceanTheme;
document.querySelector('#desert').onclick = desertTheme;

