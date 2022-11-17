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
    const popupBackground = document.querySelector("#popup-background")
    const imagePostPopup = document.querySelector("#image-post-popup")
    const imagePostForm = document.querySelector("#image-post-form");

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
    const closeImagePostButton = document.querySelector (".close-button")
    closeImagePostButton.onclick = () => {
        if (getComputedStyle(imagePostPopup).display !== 'none')
        {
            imagePostPopup.classList.add('hidden');
            popupBackground.classList.add('hidden'); 
        }
    }

    imagePostForm.insertBefore(document.createElement("add-image-row"), imagePostForm.firstChild);
}

function addImageToPost() {
    customElements.define("image-popup-input", ImagePopupInput, {extends: HTMLElement});
}
''
class AddImageRow extends HTMLElement {
    constructor() {
        super();

        const shadowElement = this.attachShadow({mode: "open"});
        const addRowDiv = document.createElement("div");
        const addImageLabel = document.createElement("label");
        const addImageInput = document.createElement("input");
        const addImageCaption = document.createElement("textarea");
        const removeImageDiv = document.createElement("div");
        const style = document.createElement("style");

        style.innerText = 
        `
            .remove-image 
            {
                background-color: var(--remove-red);
                background-image: url("../assets/remove.svg");
                background-repeat: no-repeat;
                background-position: center;
                background-size: 20px;
                height: 100px;
                width: 30px;
                border-radius: 5px;
                top: 0;
            }

            .remove-image:hover 
            {
                cursor: pointer;
            }

            .add-image-row 
            {
                display: flex;
                flex-direction: row;
                gap: 10px;
            }

            .add-image-caption
            {
                resize: none;
                border-radius: 5px;
                border: 0px;
                background-color: var(--background-grey);
                padding-left: 5px;
            }

            .add-image-label
            {
                width: 100px;
                height: 100px;
                display: block;
                justify-self: center;
                background: url("../assets/default-image.svg"), white;   
                background-repeat: no-repeat;
                background-size: 110px;
                background-position: center;
                border-radius: 5px;
            }

            .add-image-label:hover 
            {
                cursor: pointer;
            }

            .hidden
            {
                display: none !important;
            }
        `;

        addRowDiv.classList.add("add-image-row");
        addImageLabel.classList.add("add-image-label");
        addImageInput.classList.add("add-image-input", "hidden");
        addImageCaption.classList.add("add-image-caption");
        removeImageDiv.classList.add("remove-image");

        addImageInput.setAttribute("type", "file");

        addImageLabel.appendChild(addImageInput);

        addRowDiv.appendChild(addImageLabel);
        addRowDiv.appendChild(addImageCaption);
        addRowDiv.appendChild(removeImageDiv);
        addRowDiv.append(style);

        shadowElement.appendChild(addRowDiv);
    }
}

customElements.define("add-image-row", AddImageRow);

