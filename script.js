const restoreAnimations = () => {
    document.querySelector('body').removeClass('preload');
}

document.onload = restoreAnimations;