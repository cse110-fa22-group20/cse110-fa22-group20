window.addEventListener('DOMContentLoaded', init);

// ensures that page as loaded before running anything
function init() {
    const addPostButton = document.querySelector('#add-button');

    addPostButton.onclick = () => {
        const postTypeSelector = document.querySelector('#post-type-selector');

        // gets the display of the post type selector
        // if it's visible, hide it
        // if it's hidden, make it visible
        if (getComputedStyle(postTypeSelector).display === 'none')
            postTypeSelector.classList.remove('hidden');
        else postTypeSelector.classList.add('hidden');
    }

    /*
    * 1. Shows up the add image popup page if click add-image-post
    * 2. Darken the background when click add image post
    */
    const addImagePostButton = document.querySelector("#add-image-post")
    const popupBackground = document.querySelector(".popup-background")
    const imagePostPopup = document.querySelector("#image-post-popup")
    addImagePostButton.onclick = () => {
        if (getComputedStyle(imagePostPopup).display === 'none')
        {
            imagePostPopup.classList.remove('hidden');
            popupBackground.classList.remove('hidden');

        }
    }

    /*
    * Close add image popup page if click close (x) on the top right
    */
    const closeImagePostButton = document.querySelector ("#close-image-popup")
    closeImagePostButton.onclick = () => {
        if (getComputedStyle(imagePostPopup).display === 'none')
        {}
        else 
        {
            imagePostPopup.classList.add('hidden');
            popupBackground.classList.add('hidden'); 
        }
    }

}

