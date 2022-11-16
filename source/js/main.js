const testing = false;
var dbReady = null, addPost = null, getAllPosts = null;
const loadModules = async () => {
    return new Promise((res, rej) => {
        if(!testing) {
            import('./db.js').then(exports => {
                dbReady = exports.dbReady;
                addPost = exports.addPost;
                getAllPosts = exports.getAllPosts;
                res();
                return;
            });
        } else {
            const dbReady = require("./db.js").dbReady;
            const addPost = require("./db.js").addPost;
            const getAllPosts = require("./db.js").getAllPosts;
            res();
            return;
        }
    });
}

const state = {
    postIDCounter: 0,
    posts: [],
    editMode: false,
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
const textPostFormSubmit = (event, state) => {
    return new Promise(async (res, rej) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const content = formData.get('text-content');
        const newPostID = state.postIDCounter;

        const newPost = {
            id: newPostID,
            type: 'text',
            content: content,
        };

        let successfullyAdded = await addPost(newPost);
        if (successfullyAdded) {
            state.postIDCounter++;
            state.posts.push(newPost);
            res(true);
        }
        rej(true);
    });
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
    const text = postObj.querySelector('p').cloneNode(true);
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
            const post = document.querySelector(`#p${i}.post`);
            removeDragAndDelete(post);
        }
        res();
    });
}

/*
    Make p tag switch to textarea on click.
*/
const applyEditListener= (innerText) => {
    innerText.addEventListener('click', (e) => {
        const post = e.target.parentElement;
        if (state.editMode) {
            const textBox = document.createElement('textarea');
            const submit = document.createElement('button');
            const id = Number(post.getAttribute('id').substring(1));

            textBox.innerText = e.target.innerText;
            submit.innerText = "Submit";

            post.appendChild(textBox);
            post.appendChild(submit);
            toggleVisibility(e.target);

            submit.addEventListener('click', () => {
                const staticText = textBox.value;
                console.log(staticText);
                e.target.innerText = staticText;
                state.posts[id].content = staticText;
                toggleVisibility(e.target);
                post.removeChild(textBox);
                post.removeChild(submit);
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
        <p class="content text-post-content">
            ${postObj.content}
        </p>
    `;

    applyEditListener(post.querySelector('p'));
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

// ensures that page as loaded before running anything
async function init() {
    await loadModules();
    const addPostButton = document.querySelector('#add-button');
    const addTextPostButton  = document.querySelector('#add-text-post');
    const textPostForm  = document.querySelector('#text-post-popup form');
    const editModeButton = document.querySelector('#edit-button');

    //deleteDummyPosts();
    await dbReady();
    console.log('db is ready.');

    let retrievedPosts = await getAllPosts();
    state.postIDCounter = retrievedPosts.length;
    state.posts = retrievedPosts;

    //console.log(`${JSON.stringify(state)}`);

    await populatePosts(state);

    addPostButton.onclick = () => {
        const postTypeSelector = document.querySelector('#post-type-selector');
        toggleVisibility(postTypeSelector);
    };

    addTextPostButton.addEventListener('click', () => {
        const textPostPopup = document.querySelector('#text-post-popup');
        toggleVisibility(textPostPopup);
    });

    textPostForm.addEventListener('submit', (event) => {
        textPostFormSubmit(event, state).then((res) => {
            const index = !state.postIDCounter ? 0: state.postIDCounter-1;
            appendPost(state.posts[index]);
            //prependPost(state.posts[index]);
        });
    });

    editModeButton.addEventListener('click', async () => {
        if (state.editMode) {
            await removeDragAndDeleteFromAll();
            console.log(state);
        } else {
            await addDragAndDeleteToAll();
        }
        editModeButton.innerText = !state.editMode ? "Done" : "Edit";
        state.editMode = !state.editMode; // toggle edit mode
        console.log(`edit mode: ${state.editMode}`);
    });
}

if (testing) {
    exports.createTextPostObject = createTextPostObject;
    exports.populatePosts = populatePosts;
    exports.appendPost = appendPost;
    exports.insertPost = insertPost;
}