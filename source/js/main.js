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
    const imageContainer = document.querySelector("#image-container");
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
    const closeImagePostButton = document.querySelector("#image-close-button");
    closeImagePostButton.onclick = () => {
        if (getComputedStyle(imagePostPopup).display !== 'none')
        {
            imageContainer.innerHTML = "";

            imagePostPopup.classList.add('hidden');
            popupBackground.classList.add('hidden'); 
        }
    }

    const addImageButton = document.querySelector("#add-image-button");

    addImageButton.onclick = () => {
        const images = document.querySelectorAll("add-image-row");
        let lastImage;

        let int = 0;

        for(let image of images) {
            lastImage = image;
            int++;
        }

        console.log(int);

        console.log(lastImage);

        if(lastImage) {
            lastImage.insertAdjacentElement("afterend", document.createElement("add-image-row"));
        }
        else {
            imageContainer.insertBefore(document.createElement("add-image-row"), imageContainer.firstChild);
        }
    }

    

    imagePostForm.onsubmit = (event) => {
        event.preventDefault();

        if (getComputedStyle(imagePostPopup).display !== 'none')
        {
            imageContainer.innerHTML = "";

            imagePostPopup.classList.add('hidden');
            popupBackground.classList.add('hidden'); 
        }
    }
}

function addImageToPost() {
    customElements.define("image-popup-input", ImagePopupInput, {extends: HTMLElement});
}

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
            *
            {
                font-family: 'Poppins', 'Helvetica', 'sans-serif';
            }

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
                margin-bottom: 5px;
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
                background: url("../assets/add.svg"), var(--background-grey);   
                background-repeat: no-repeat;
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
        addImageCaption.setAttribute("placeholder", "Enter a caption...");

        addImageLabel.appendChild(addImageInput);

        addRowDiv.appendChild(addImageLabel);
        addRowDiv.appendChild(addImageCaption);
        addRowDiv.appendChild(removeImageDiv);
        addRowDiv.append(style);

        removeImageDiv.onclick = () => {
            this.remove();
        }

        addImageInput.onchange = (event) => {
            const fileReader = new FileReader();

            fileReader.onload = () => {
                const displayImage = fileReader.result;
                addImageLabel.style.backgroundImage = `url(${displayImage})`;
                addImageLabel.style.backgroundSize = "100px 100px";
            };

            fileReader.readAsDataURL(event.target.files[0]);
        }

        shadowElement.appendChild(addRowDiv);
    }
}

customElements.define("add-image-row", AddImageRow);

