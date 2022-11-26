const testing = false;
var dbReady = null, addPost = null, getAllPosts = null, getPost = null, getDetails = null, updatePost = null, deletePostFromDB = null, getPostOrder = null, updatePostOrder = null, addPostOrder = null;
const loadModules = async () => {
    return new Promise((res, rej) => {
        if(!testing) {
            import('./db.js').then(exports => {
                dbReady = exports.dbReady;
                addPost = exports.addPost;
                getAllPosts = exports.getAllPosts;
                getPost = exports.getPost;
                getDetails = exports.getDetails;
                updatePost = exports.updatePost;
                deletePostFromDB = exports.deletePostFromDB;
                getPostOrder = exports.getPostOrder;
                updatePostOrder = exports.updatePostOrder;
                addPostOrder = exports.addPostOrder;
                res();
                return;
            });
        } else {
            dbReady = require("./db.js").dbReady;
            addPost = require("./db.js").addPost;
            getAllPosts = require("./db.js").getAllPosts;
            getPost = require("./db.js").getPost;
            getDetails = require("./db.js").getDetails;
            updatePost = require("./db.js").updatePost;
            deletePostFromDB = require("./db.js").deletePostFromDB;
            getPostOrder = require("./db.js").getPostOrder;
            updatePostOrder = require("./db.js").updatePostOrder;
            addPostOrder = require("./db.js").addPostOrder;
            res();
            return;
        }
    });
}

// ensures that page as loaded before running anything
async function init() {
    await loadModules();
    await dbReady();

    const userDetails = await getDetails();

    if(userDetails == null) window.location.href = "./new-user.html";
    
    setUserDetails(userDetails.name, userDetails.description, userDetails.image);

    const editModeButton = document.querySelector('#edit-button');
    const saveButton = document.querySelector('#save-button');

    toggleVisibility(saveButton);

    // create <add-image-row> element
    customElements.define("add-image-row", AddImageRow);

    // state.posts = retrievedPosts;
    // console.log(`${JSON.stringify(state)}`);

    const postOrder = await getPostOrder();
    console.log('postOrder from db:', postOrder);
    const posts = await getAllPosts();
    await populatePosts(posts, postOrder);
    console.log(state);

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

    textPostForm.onsubmit = async function (event) {
        event.preventDefault();

        const textPostTextarea = document.querySelector("#text-post-textarea");
        const content = textPostTextarea.innerText;

        if(content.trim().length === 0) return; 

        if(state.editMode) {
            const id = parseInt(this.getAttribute("data-post-id"));

            const postObj = {
                type: 'text',
                content: content,
                id: id,
            }

            updatePost(postObj);
            updatePostDOM(id);
        }
        else {
            const postObj = {
                type: 'text',
                content: content,
            }

            addPost(postObj);

            const posts = await getAllPosts();
            await populatePosts(posts, postOrder);
        }

        toggleVisibility(textPostPopup);
        toggleVisibility(popupBackground);

        textPostTextarea.innerText = '';
    }
  
    // delete popup and its buttons are static, no need to query every time
    const deletePostPopup = document.querySelector('#delete-post-popup');
    const deletePostConfirmButton = document.querySelector('#confirm-delete-button');
    const deletePostCancelButton = document.querySelector('#cancel-delete-button');
    deletePostCancelButton.addEventListener('click', () => {
        // just close the popup
        toggleVisibility(deletePostPopup);
        toggleVisibility(popupBackground);
    });
    deletePostConfirmButton.addEventListener('click', async () => {
        let postID = deletePostPopup.getAttribute("data-post-id");
        await deletePost(postID);

        // done deleting post, close the popup
        toggleVisibility(deletePostPopup);
        toggleVisibility(popupBackground);
    });
  
    editModeButton.addEventListener('click', async () => {
        await addDragAndDeleteToAll();
        toggleVisibility(saveButton);
        toggleVisibility(addPostButton);
        toggleVisibility(editModeButton);

        const postTypeSelector = document.querySelector('#post-type-selector');
        const textPostSubmit = document.querySelector('#post-text');
        const imagePostSubmit = document.querySelector('#image-post-submit');
        const imagePopupTitle = document.querySelector("#image-popup-title");
        const textPopupTitle = document.querySelector("#text-popup-title");

        imagePostSubmit.setAttribute("value", "Update");
        textPostSubmit.setAttribute("value", "Update");
        imagePopupTitle.innerText = "Update image post";
        textPopupTitle.innerText = "Update text post";

        if(getComputedStyle(postTypeSelector).display !== "none") {
            toggleVisibility(postTypeSelector);
        }

        state.editMode = !state.editMode; // toggle edit mode
        console.log(`edit mode: ${state.editMode}`);

        makePostsEditable();
        // find the delete buttons and add event listeners after they're populated
        // can't really do it outside here since delete button wouldn't exist
        // before addDragAndDeleteToAll()
        if(state.editMode) {
            const deleteButtons = document.querySelectorAll('.delete-icon-container');
            for(let i = 0; i < deleteButtons.length; i++) {
                deleteButtons[i].onclick = () => {
                    // add the post id so that we know who we're deleting after confirmation
                    deletePostPopup.setAttribute("data-post-id", deleteButtons[i].parentElement.getAttribute("data-post-id"));
                    toggleVisibility(deletePostPopup);
                    toggleVisibility(popupBackground);
                }
            }
        }
    });

    saveButton.addEventListener('click', async () => {
        await removeDragAndDeleteFromAll();

        toggleVisibility(editModeButton);
        toggleVisibility(addPostButton);
        toggleVisibility(saveButton);

        const textPostSubmit = document.querySelector('#post-text');
        const imagePostSubmit = document.querySelector('#image-post-submit');
        const imagePopupTitle = document.querySelector("#image-popup-title");
        const textPopupTitle = document.querySelector("#text-popup-title");

        imagePostSubmit.setAttribute("value", "Post");
        textPostSubmit.setAttribute("value", "Post");
        imagePopupTitle.innerText = "Add image post";
        textPopupTitle.innerText = "Add text post";

        state.editMode = !state.editMode; // toggle edit mode
        console.log(`edit mode: ${state.editMode}`);
    });
};

const makePostsEditable = () => {
    const postDOM = document.querySelectorAll(".content");

    for(const post of postDOM) {
        if(post.parentNode.classList.contains("text-post")) {
            post.onclick = () => {
                if(state.editMode) propogateTextPopup(post.parentNode);
            }
        }
    }
}

const setUserDetails = (name, description, image) => {
    const userImage = document.querySelector("#user-image");
    const userName = document.querySelector("#user-name");
    const userDescription = document.querySelector("#user-description");

    userName.innerText = name;
    userDescription.innerText = description;
    userImage.setAttribute("src", image);
}

const propogateTextPopup = (postDOM) => {
    const postId = postDOM.getAttribute("data-post-id");
    const content = postDOM.innerText;
    const textPostPopup = document.querySelector("#text-post-popup");
    const popupBackground = document.querySelector("#popup-background");
    const textPostTextarea = document.querySelector("#text-post-textarea");
    const textPostForm = document.querySelector("#text-post-form");

    textPostForm.setAttribute("data-post-id", postId);

    toggleVisibility(textPostPopup);
    toggleVisibility(popupBackground);

    textPostTextarea.innerText = content;
}

const state = {
    postIDCounter: 0,
    posts: [],
    order: [],
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

const getID = (obj) => Number(obj.getAttribute('data-post-id'));

const syncPostOrderWithState = () => {
    const posts = document.querySelectorAll('.post');
    const ids = [];
    for (let post of posts) {
        ids.push(post.getAttribute('data-post-id'));
    }
    console.log(ids);
    console.log(state.posts);
};

const createShadowPost = (post) => {
    const shadowPost = post.cloneNode(true);
    const prevClass = post.getAttribute('class').includes('text') ? 'text-post' : 'image-post';
    shadowPost.style.setProperty('position', '');
    shadowPost.style.setProperty('z-index', '-1');
    shadowPost.setAttribute('data-post-id', '-1');
    shadowPost.setAttribute('id', 'shadow-post');
    shadowPost.setAttribute('class', `post ${prevClass} shadow-post`);
    //shadowPost.removeChild(shadowPost.querySelector('.drag-icon-outer-container'));
    shadowPost.removeChild(shadowPost.querySelector('.drag-icon-container'));
    shadowPost.removeChild(shadowPost.querySelector('.delete-icon-container'));
    return shadowPost;
};

const swapUp = (dragID, shadowPost, prevY) => {
    const posts = document.querySelectorAll(`.post:not([data-post-id|="${dragID}"])`);
    let trailing = posts[0];
    if (getID(trailing) === -1) {
        return prevY;
    }
    let post;
    for (let i = 1; i < posts.length; i++) {
        post = posts[i];
        if (getID(post) === -1) {
            break;
        }
        trailing = post;
    }
    shadowPost.remove();
    insertPostFromDOMObject(shadowPost, getID(trailing));

    let rect = shadowPost.getBoundingClientRect();
    let yMid = rect['height'] / 2;
    return rect['y'] + yMid;
};

const swapDown = (dragID, shadowPost, prevY) => {
    const posts = document.querySelectorAll(`.post:not([data-post-id|="${dragID}"])`);
    let last = posts[posts.length-1];
    if (getID(last) === -1) {
        return prevY;
    }

    let post;
    for (let i = 0;  i < posts.length; i++) {
        post = posts[i];
        if (getID(post) === -1) {
            post = posts[i+1];
            break;
        }
    }
    shadowPost.remove();
    post.after(shadowPost);

    let rect = shadowPost.getBoundingClientRect();
    let yMid = rect['height'] / 2;
    return rect['y'] + yMid;
};

const getSwapPositions = (dragID) => {
    const posts = document.querySelectorAll(`.post:not([data-post-id|="${dragID}"])`);
    if (posts.length == 0) { return [0, 99999999]; }
    if (getID(posts[0]) === -1) {
        let rect = posts[1].getBoundingClientRect();
        return [0, rect['top'] + rect['height'] / 2];
    } else if (getID(posts[posts.length-1]) === -1) {
        let rect = posts[posts.length-2].getBoundingClientRect();
        return [rect['top'] + rect['height'] / 2, 99999999];
    }
    let shadowIndex;
    for (let i = 0; i < posts.length; i++) {
        if (getID(posts[i]) === -1) {
            shadowIndex = i;
            break;
        }
    }

    let rectAbove = posts[shadowIndex-1].getBoundingClientRect();
    let rectBelow = posts[shadowIndex+1].getBoundingClientRect();

    return [
        rectAbove['top'] + rectAbove['height'] / 2, 
        rectBelow['top'] + rectBelow['height'] / 2
    ];
}

const makeDraggable = (dragIcon) => {
    dragIcon.addEventListener('mousedown', async (e) => {
        const parentDiv = e.target.parentElement.parentElement;
        //console.log(parentDiv);
        parentDiv.style.setProperty('position', 'absolute');
        parentDiv.style.setProperty('z-index', '2');

        // create shadow post to show where post would land on mouse up
        const shadowPost = createShadowPost(parentDiv);
        const dragID = getID(parentDiv);
        //parentDiv.setAttribute('id', dragID);
        insertPostFromDOMObject(shadowPost, dragID);

        let rect = parentDiv.getBoundingClientRect();
        let yMid = rect['height'] / 2;
        let yOffset = -1 * yMid;
        let swapPositions = getSwapPositions();
        let prevY = yOffset + e.clientY;
        parentDiv.style.top = prevY + "px";
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        const delay = (ms) => {
            return new Promise((res) => {
                setTimeout(res, ms);
            });
        };
        await delay(300);
        document.onmousemove = (e) => {
            let curY = yOffset + e.clientY;
            parentDiv.style.top = curY + "px";
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }

            if (curY - yMid < swapPositions[0]) {
                // swap up
                console.log(`should swap up: ${curY}, ${swapPositions[0]}`);
                prevY = swapUp(dragID, shadowPost, prevY);
                swapPositions = getSwapPositions(dragID);
            } else if (curY + yMid > swapPositions[1]) {
                // swap down
                console.log(`should swap down: ${curY}, ${swapPositions[1]}`);
                prevY = swapDown(dragID, shadowPost, prevY);
                swapPositions = getSwapPositions(dragID);
            }
        };

        document.onmouseup = () => {
            parentDiv.style.setProperty('position', 'relative');
            parentDiv.style.setProperty('top', '');
            parentDiv.style.setProperty('z-index', '');
            document.onmousemove = null;
            document.onmouseup = null;
            parentDiv.remove();
            insertPostFromDOMObject(parentDiv, getID(shadowPost.nextElementSibling));
            shadowPost.remove();
            syncPostOrderWithState();
        };
    });
}

/*
    Add the drag and delete side buttons to a post element.
*/
const addDragAndDelete = (postObj) => {
    const dragOuter = document.createElement('div');
    const dragInner = document.createElement('div');
    dragOuter.appendChild(dragInner);
    dragOuter.setAttribute('class', 'drag-icon-container');
    dragInner.setAttribute('class', 'drag-icon-inner-container');
    const del = document.createElement('div');
    del.setAttribute('class', 'delete-icon-container');

    postObj.appendChild(dragOuter);
    postObj.appendChild(del);
    makeDraggable(dragInner);
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
};

/*
    Remove the drag and delete side buttons from all post elements.
*/
const removeDragAndDeleteFromAll = () => {
    return new Promise((res) => {
        const postDOM = document.querySelectorAll(".post");

        for (const post of postDOM) {
            removeDragAndDelete(post);
        }
        res();
    });
}


/*
    Creates DOM element from a post object with type='text'.
*/
const createTextPostObject = (postObj) => {
    const post = document.createElement('div');

    post.setAttribute('data-post-id', postObj.id);
    post.setAttribute('class', 'post text-post');

    post.innerHTML = `
        <pre class="content text-post-content">
        </pre>
    `;

    post.querySelector('pre').innerText = postObj.content;

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
const populatePosts = async (postArg, order) => {
    const posts = postArg;
    const postsWrapper = document.querySelector('#posts-wrapper');
    const typeSelector = document.querySelector('#post-type-selector');

    const currentPosts = document.querySelectorAll('.post');

    for(const currentPost of currentPosts) {
        currentPost.remove();
    }

    if (!order.length) {
        posts.forEach((postObj) => {
            const post = createPostObject(postObj);
            postsWrapper.insertBefore(post, typeSelector);
            state.order.push(postObj.id);
        });
        await updatePostOrder(state.order);
    } else {
        const retrievedPostOrder = await getPostOrder();
        for (let id of retrievedPostOrder) {
            state.order.push(id);
        }
        // TODO: insert posts according to order
        posts.forEach((postObj) => {
            const post = createPostObject(postObj);
            postsWrapper.insertBefore(post, typeSelector);
        });
    }

    makePostsEditable();
};

const updatePostDOM = async (id) => {
    const allPosts = document.querySelectorAll(".post");
    let postToUpdate;

    for(const post of allPosts) {
        if(parseInt(post.getAttribute("data-post-id")) === id) {
            postToUpdate = post;
            break;
        }
    }

    let contentArea;

    for(const child of postToUpdate.children) {
        if(child.classList.contains("text-post-content")) {
            contentArea = child;
            break;
        }
    }

    const dbPost = await getPost(parseInt(id));

    contentArea.innerText = dbPost.content;
}

const insertPostFromDOMObject = (postObj, beforeIndex, order) => {
    const postContainer = document.querySelector('#posts-wrapper');
    const posts = document.querySelectorAll('.post');
    let beforeElement = null;
    for (let post of posts) {
        if (post.getAttribute('data-post-id') == beforeIndex) {
            beforeElement = post;
            break;
        }
    }
    if (beforeIndex < 0 || beforeElement === null) {
        beforeElement = document.querySelector('#post-type-selector');
    }
    postContainer.insertBefore(postObj, beforeElement);
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
    for (let post of posts) {
        if (post.getAttribute('data-post-id') == beforeIndex) {
            beforeElement = post;
            break;
        }
    }
    if (beforeIndex < 0 || beforeElement === null) {
        beforeElement = document.querySelector('#post-type-selector');
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
 * Delete the post given its id in the string format (...) 
 * where the ... is an integer >= 0
 *     - Remove the html
 *     - Remove the post from the db
 * Return whether the deletion was successful
 */
const deletePost = async (postID) => {
    return new Promise(async (res, rej) => {
        // not even a string
        if(typeof(postID) != "string") {
            res(false);
            return false;
        }
        const postIDint = parseInt(postID);
        // reject nan, float, and < 0
        if(isNaN(postIDint) || Number(postID) != postIDint) {
            res(false);
            return false;
        }
        if(postIDint < 0) {
            res(false);
            return false;
        }

        // Remove the html
        const postContainer = document.querySelector(`[data-post-id="${postID}"]`);
        if(postContainer == null) {
            res(false);
            return false;
        }
        postContainer.remove();

        // Remove the post from the db
        const deleteSuccess = await deletePostFromDB(postIDint);
        if(!deleteSuccess) {
            res(false);
            return false;
        }

        // Update state
        state.postIDCounter--;
        let postIndex = 0;
        for(let i = 0; i < state.postIDCounter; i++) if(state.posts[i].id == postIDint) {
            postIndex = i;
            break;
        }
        state.posts.splice(postIndex, 1);
        res(true);
        return true;
    });
    
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
    exports.loadModules = loadModules;
}
