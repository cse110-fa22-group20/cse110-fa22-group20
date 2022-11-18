window.addEventListener('DOMContentLoaded', init);

// ensures that page as loaded before running anything
function init() {
    // create <add-image-row> element
    customElements.define("add-image-row", AddImageRow);

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

    const addImagePostButton = document.querySelector("#add-image-post")
    const popupBackground = document.querySelector("#popup-background")
    const imagePostPopup = document.querySelector("#image-post-popup")

    /**
     * Shows image post popup and background when a button is clicked
     */
    addImagePostButton.onclick = () => {
        if (getComputedStyle(imagePostPopup).display === 'none')
        {
            imagePostPopup.classList.remove('hidden');
            popupBackground.classList.remove('hidden');
        }
    }

    const imageContainer = document.querySelector("#image-container");
    const imagePostForm = document.querySelector("#image-post-form");

    /**
     * Closes popup
     */
    const closeImagePostButton = document.querySelector("#image-close-button");
    closeImagePostButton.onclick = () => {
        if (getComputedStyle(imagePostPopup).display !== 'none')
        {
            // clear the contents of the popup so images aren't carried  over
            imageContainer.innerHTML = "";

            // hide popup and background
            imagePostPopup.classList.add('hidden');
            popupBackground.classList.add('hidden'); 
        }
    }

    const addImageButton = document.querySelector("#add-image-button");

    /**
     * Allows for new images to be added to post
     */
    addImageButton.onclick = () => {
        const images = document.querySelectorAll("add-image-row");
        const lastImage = images[images.length - 1];

        // checks to see if there are any imgaes that already are in the popup
        if(lastImage) {
            // insert after the last child
            lastImage.insertAdjacentElement("afterend", document.createElement("add-image-row"));
        }
        else {
            // insert as the only child
            imageContainer.appendChild(document.createElement("add-image-row"));
        }
    }

    /**
     * Handles form submission
     */
    imagePostForm.onsubmit = (event) => {
        event.preventDefault();

        // hide popup and clear it 
        if (getComputedStyle(imagePostPopup).display !== 'none')
        {
            imageContainer.innerHTML = "";

            imagePostPopup.classList.add('hidden');
            popupBackground.classList.add('hidden'); 
        }
    }
}

/**
 * Class for <add-image-row> element. Contains image upload, caption, and deletion functionality
 */
class AddImageRow extends HTMLElement {
    constructor() {
        super();

        // initialize shadow DOM and create necessary elements
        const shadowElement = this.attachShadow({mode: "open"});
        const addRowDiv = document.createElement("div");
        const addImageLabel = document.createElement("label");
        const addImageInput = document.createElement("input");
        const addImageCaption = document.createElement("textarea");
        const removeImageDiv = document.createElement("div");
        const style = document.createElement("style");

        // set styling for element
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

        // add necessary classes to elements
        addRowDiv.classList.add("add-image-row");
        addImageLabel.classList.add("add-image-label");
        addImageInput.classList.add("add-image-input", "hidden");
        addImageCaption.classList.add("add-image-caption");
        removeImageDiv.classList.add("remove-image");

        // set necessary element attributes
        addImageInput.setAttribute("type", "file");
        addImageCaption.setAttribute("placeholder", "Enter a caption...");

        // puts input into label
        addImageLabel.appendChild(addImageInput);

        // adds all elements to row
        addRowDiv.appendChild(addImageLabel);
        addRowDiv.appendChild(addImageCaption);
        addRowDiv.appendChild(removeImageDiv);
        addRowDiv.append(style);

        /**
         * When remove button is clicked, remove associated row
         */
        removeImageDiv.onclick = () => {
            this.remove();
        }

        /**
         * When image is uploaded, set the background as the image
         */
        addImageInput.onchange = (event) => {
            const fileReader = new FileReader();

            /**
             * Set background
             */
            fileReader.onload = () => {
                const displayImage = fileReader.result;
                addImageLabel.style.backgroundImage = `url(${displayImage})`;
                addImageLabel.style.backgroundSize = "100px 100px";
            };

            /**
             * Read as url to be passed into backgroundImage
             */
            fileReader.readAsDataURL(event.target.files[0]);
        }

        /**
         * Add row to html flow
         */
        shadowElement.appendChild(addRowDiv);
    }
}

