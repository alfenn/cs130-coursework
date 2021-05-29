const restoreAnimations = () => {
    document.querySelector('bod').removeClass('preload');
}

document.onload = restoreAnimations;