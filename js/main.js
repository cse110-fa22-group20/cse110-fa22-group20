const testing = false;
var dbReady = null, addPost = null, getAllPosts = null, deletePostFromDB = null;
const loadModules = async () => {
    return new Promise((res, rej) => {
        if(!testing) {
            import('./db.js').then(exports => {
                dbReady = exports.dbReady;
                addPost = exports.addPost;
                getAllPosts = exports.getAllPosts;
                deletePostFromDB = exports.deletePostFromDB;
                res();
                return;
            });
        } else {
            dbReady = require("./db.js").dbReady;
            addPost = require("./db.js").addPost;
            getAllPosts = require("./db.js").getAllPosts;
            deletePostFromDB = require("./db.js").deletePostFromDB;
            res();
            return;
        }
    });
}

const state = {
    postIDCounter: 0,
    posts: [],
    editMode: false,
    editingPost: false
};

window.addEventListener('DOMContentLoaded', init);

/*
    Input: DOM object
    If hidden make it visible.
    If visible make it hidden.
*/
const toggleVisibility = (obj) => {
    if (getComputedStyle(obj).display === 'none') 
        obj.classList.remove('hidden');
    else 
        obj.classList.add('hidden');
};



/*
    Gets text content of the new post.
    Creates new post object, attempts to add it to the database.
    Waits for db operation to complete.
    If attempt is successful, update global counter.
    state object is passed by reference, so changes will be reflected in 
    original scope.
*/
const textPostFormSubmit = (event, content, state) => {
    event.preventDefault(); 

    // removes spaces in the case that someone has entered a single space and tries to submit that
    content = content.trim();

    // don't submit empty posts
    if(content.length > 0) {
        return new Promise(async (res, rej) => {
            var newPostID = 0;
            if(state.postIDCounter > 0) {
                newPostID = state.posts[state.postIDCounter - 1].id + 1;
            }
    
            const newPost = {
                id: newPostID,
                type: 'text',
                content: content,
            };
    
            let successfullyAdded = await addPost(newPost);
            if (successfullyAdded) {
                const textPostTextarea = document.querySelector("#text-post-textarea");
                const textPostPopup = document.querySelector("#text-post-popup");
                const popupBackground = document.querySelector("#popup-background");
    
                textPostTextarea.innerHTML = '';
                toggleVisibility(textPostPopup);
                toggleVisibility(popupBackground);
                state.postIDCounter++;
                state.posts.push(newPost);
                res(true);
            }
            rej(true);
        });
    }
}

/*
    Temporary. Don't want to delete the dummy posts from the HTML.
*/
const deleteDummyPosts = () => {
    const postContainer = document.querySelector('#posts-wrapper');
    while (document.querySelector(".post")) {
        document.querySelector(".post").remove();
    }
};


/*
    Add the drag and delete side buttons to a post element.
*/
const addDragAndDelete = (postObj) => {
    const drag = document.createElement('div');
    drag.setAttribute('class', 'drag-icon-container');
    const del = document.createElement('div');
    del.setAttribute('class', 'delete-icon-container');

    postObj.appendChild(drag);
    postObj.appendChild(del);
};

/*
    Add the drag and delete side buttons to all post elements.
*/
const addDragAndDeleteToAll = () => {
    return new Promise((res) => {
        const posts = document.querySelectorAll('.post');
        for (const post of posts) {
            addDragAndDelete(post);
        }
        res();
    })
}

/*
    Remove the drag and delete side buttons to a post element.
*/
const removeDragAndDelete = (postObj) => {
    const text = postObj.querySelector('pre').cloneNode(true);
    postObj.innerHTML = '';
    postObj.appendChild(text);
    applyEditListener(text);
};

/*
    Remove the drag and delete side buttons from all post elements.
*/
const removeDragAndDeleteFromAll = () => {
    return new Promise((res) => {
        for (let i = 0; i < state.postIDCounter; i++) {
            const post = document.querySelector(`#p${state.posts[i].id}`);
            removeDragAndDelete(post);
        }
        res();
    });
}


/*
    Make pre tag switch to contenteditable div on click.
*/
const applyEditListener = (innerText) => {
    innerText.addEventListener('click', (e) => {
        const post = e.target.parentElement;
        if (state.editMode && !state.editingPost) {
            state.editingPost = true;
            const saveButton = document.querySelector('#save-button');
            toggleVisibility(saveButton);

            const textBox = document.createElement('div');
            const submit = document.createElement('button');
            const id = Number(post.getAttribute('id').substring(1));

            textBox.setAttribute('contenteditable', '');
            textBox.setAttribute('class', 'editable-text');
            textBox.innerText = e.target.innerText;
            textBox.style.fontSize = window.getComputedStyle(document.body)
                                     .getPropertyValue('font-size');


            submit.style.height = textBox.style.height;
            submit.setAttribute('class', 'submit-button');
            submit.innerText = "Submit";

            post.appendChild(textBox);
            post.appendChild(submit);
            toggleVisibility(e.target);
            textBox.focus();

            submit.addEventListener('click', () => {
                const staticText = textBox.innerText;
                if (staticText.trim() === "") { // no empty posts 
                    textBox.innerText = 'Posts cannot be empty.';
                } else { 
                    e.target.innerText = staticText;
                    state.posts[id].content = staticText;
                    toggleVisibility(e.target);
                    post.removeChild(textBox);
                    post.removeChild(submit);
                    state.editingPost = false;
                    toggleVisibility(saveButton);
                } 
            });
        }
    });
};

/*
    Creates DOM element from a post object with type='text'.
*/
const createTextPostObject = (postObj) => {
    const post = document.createElement('div');

    post.setAttribute('id', "p" + postObj.id);
    post.setAttribute('class', 'post');

    post.innerHTML = `
        <pre class="content text-post-content">
        </pre>
    `;
    post.querySelector('pre').innerText = postObj.content;

    applyEditListener(post.querySelector('pre'));
    return post;
};

/*
    TODO: different DOM object returned if type is text vs image
*/
const createPostObject = (postObj) => {
    return postObj.type === 'text'  
        ? createTextPostObject(postObj) 
        : createTextPostObject(postObj);
}

/*
    Populates DOM with post objects stored in `state`.
*/
const populatePosts = (state) => {
    return new Promise((res) => {
        const postContainer = document.querySelector('#posts-wrapper');
        const typeSelector = document.querySelector('#post-type-selector');
        state.posts.forEach((postObj) => {
            const post = createPostObject(postObj);
            postContainer.insertBefore(post, typeSelector);
        });
        res();
    });
};

/*
    Insert a new post into the DOM 
    before the post in the container 
    specified with `beforeIndex`.

    If the index is invalid, the post will be appended instead.
*/
const insertPost = (postObj, beforeIndex) => {
    const postContainer = document.querySelector('#posts-wrapper');
    const posts = document.querySelectorAll('.post');
    let beforeElement = null;
    if (beforeIndex < 0 || beforeIndex > posts.length-1) {
        beforeElement = document.querySelector('#post-type-selector');
    } else {
        beforeElement = posts[beforeIndex];
    }
    postContainer.insertBefore(createPostObject(postObj), beforeElement);
};

/*
    Append a new post to the DOM.
*/
const appendPost = (postObj) => {
    insertPost(postObj, -1);
}

/*
    Prepend a new post to the DOM.
    Stub used for making sure insertPost works as expected.
*/
const prependPost = (postObj) => {
    insertPost(postObj, 0);
}

/*
 * Delete the post given its id in the string format (p...) 
 * where the ... is an integer >= 0
 *     - Remove the html
 *     - Remove the post from the db
 * Return whether the deletion was successful
 */
const deletePost = async (postID) => {
    // not even a string
    if(typeof(postID) != "string") return false;
    const postIDint = parseInt(postID.substring(1));
    // reject nan, float, and < 0
    if(isNaN(postIDint) || Number(postIDint) != postIDint) return false;
    if(postIDint < 0) return false;

    // Remove the html
    const postContainer = document.querySelector(`#${postID}`);
    postContainer.remove();

    // Remove the post from the db
    const deleteSuccess = await deletePostFromDB(postIDint);
    if(!deleteSuccess) return false;
    
    // Update state
    state.postIDCounter--;
    let postIndex = 0;
    for(let i = 0; i < state.postIDCounter; i++) if(state.posts[i].id == postIDint) {
        postIndex = i;
        break;
    }
    state.posts.splice(postIndex, 1);
    console.log(state);
    return true;
}

// ensures that page as loaded before running anything
async function init() {
    await loadModules();
    const editModeButton = document.querySelector('#edit-button');
    const saveButton = document.querySelector('#save-button');

    toggleVisibility(saveButton);

    deleteDummyPosts();

    // create <add-image-row> element
    customElements.define("add-image-row", AddImageRow);

    await dbReady();
    console.log('db is ready.');

    let retrievedPosts = await getAllPosts();
    state.postIDCounter = retrievedPosts.length;
    state.posts = retrievedPosts;

    //console.log(`${JSON.stringify(state)}`);

    await populatePosts(state);

    const addPostButton = document.querySelector('#add-button');

    addPostButton.onclick = () => {
        const postTypeSelector = document.querySelector('#post-type-selector');
        toggleVisibility(postTypeSelector);
        window.scrollTo(0, document.body.scrollHeight);
    }

    const addImagePostButton = document.querySelector("#add-image-post")
    const popupBackground = document.querySelector("#popup-background")
    const imagePostPopup = document.querySelector("#image-post-popup")

    /**
     * Close text popup
     */
    const closeTextPostButton = document.querySelector ("#close-text-popup")
    const textPostPopup = document.querySelector("#text-post-popup")
    const textPostForm = document.querySelector("#text-post-form");
    const textPostTextarea = document.querySelector("#text-post-textarea");

    closeTextPostButton.onclick = () => {
        textPostTextarea.innerHTML = '';
        toggleVisibility(textPostPopup);
        toggleVisibility(popupBackground);
    }

    /**
     * Shows image post popup and background when a button is clicked
     */
    addImagePostButton.onclick = () => {
        toggleVisibility(imagePostPopup);
        toggleVisibility(popupBackground);
    }

    const addTextPostButton  = document.querySelector('#add-text-post');

    addTextPostButton.onclick = () => {
        toggleVisibility(textPostPopup);
        toggleVisibility(popupBackground);
    };

    const imageContainer = document.querySelector("#image-container");
    const imagePostForm = document.querySelector("#image-post-form");

    /**
     * Closes popup
     */
    const closeImagePostButton = document.querySelector("#image-close-button");
    closeImagePostButton.onclick = () => {
        // clear the contents of the popup so images aren't carried  over
        imageContainer.innerHTML = "";

        // hide popup and background
        toggleVisibility(imagePostPopup);
        toggleVisibility(popupBackground);
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

        // scroll to the bottom to show the newly added image
        imagePostForm.scrollTop = imagePostForm.scrollHeight;
    }

    /**
     * Handles form submission
     */
    imagePostForm.onsubmit = (event) => {
        event.preventDefault();

        // hide popup and clear it 
        toggleVisibility(imagePostPopup);
        toggleVisibility(popupBackground);

        imageContainer.innerHTML = "";
    }

    textPostForm.addEventListener('submit', async (event) => {
        const content = textPostTextarea.innerText;

        await textPostFormSubmit(event, content, state).then((res) => {
            const index = !state.postIDCounter ? 0: state.postIDCounter-1;
            appendPost(state.posts[index]);
            //prependPost(state.posts[index]);
        });
    });

    // delete popup and its buttons are static, no need to query every time
    const deletePostPopup = document.querySelector('#delete-post-popup');
    const deletePostConfirmButton = document.querySelector('#confirm-delete-button');
    const deletePostCancelButton = document.querySelector('#cancel-delete-button');
    deletePostCancelButton.addEventListener('click', () => {
        // just close the popup
        toggleVisibility(deletePostPopup);
        toggleVisibility(popupBackground);
    });
    deletePostConfirmButton.addEventListener('click', () => {
        let postID = deletePostPopup.getAttribute("post-id");
        deletePost(postID);

        // done deleting post, close the popup
        toggleVisibility(deletePostPopup);
        toggleVisibility(popupBackground);
    });

    editModeButton.addEventListener('click', async () => {
        await addDragAndDeleteToAll();
        toggleVisibility(saveButton);
        toggleVisibility(addPostButton);
        toggleVisibility(editModeButton);
        state.editMode = !state.editMode; // toggle edit mode
        
        // find the delete buttons and add event listeners after they're populated
        // can't really do it outside here since delete button wouldn't exist
        // before addDragAndDeleteToAll()
        if(state.editMode) {
            const deleteButtons = document.querySelectorAll('.delete-icon-container');
            for(let i = 0; i < deleteButtons.length; i++) {
                deleteButtons[i].onclick = () => {
                    // add the post id so that we know who we're deleting after confirmation
                    deletePostPopup.setAttribute("post-id", deleteButtons[i].parentElement.id);
                    toggleVisibility(deletePostPopup);
                    toggleVisibility(popupBackground);
                }
            }
        }
        console.log(`edit mode: ${state.editMode}`);
    });

    saveButton.addEventListener('click', async () => {
        await removeDragAndDeleteFromAll();
        console.log(state);

        toggleVisibility(editModeButton);
        toggleVisibility(addPostButton);
        toggleVisibility(saveButton);
        state.editMode = !state.editMode; // toggle edit mode
        console.log(`edit mode: ${state.editMode}`);
    });
};

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
        addImageInput.setAttribute("accept", "image/*");
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

if (testing) {
    exports.createTextPostObject = createTextPostObject;
    exports.populatePosts = populatePosts;
    exports.appendPost = appendPost;
    exports.insertPost = insertPost;
    exports.deletePost = deletePost;
}
