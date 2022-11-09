window.addEventListener('DOMContentLoaded', init);

// ensures that page as loaded before running anything
function init() {
    const addPostButton = document.querySelector('#add-button');

    addPostButton.onclick = () => {
        const postTypeSelector = document.querySelector('#post-type-selector');
        
        // gets the display of the post type selector
        // if it's visible, hide it
        // if it's hidden, make it visible
        if(getComputedStyle(postTypeSelector).display == 'none') postTypeSelector.classList.add('visible');
        else postTypeSelector.classList.remove('visible');
    }
}