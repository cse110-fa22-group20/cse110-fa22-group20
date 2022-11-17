import { dbReady, addPost, getAllPosts } from './db.js';

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
* Close text popup
*/
const closeTextPostButton = document.querySelector ("#close-text-popup")
const textPostPopup = document.querySelector("#text-post-popup")
closeTextPostButton.onclick = () => {
    if (getComputedStyle(textPostPopup).display === 'none')
    {}
    else 
    {
        textPostPopup.classList.add('hidden');
        popupBackground.classList.add('hidden'); 
    }
}



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
        rej(false);
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
    Creates DOM element from a post object with type='text'.
*/
const createTextPostObject = (postObj) => {
    const post = document.createElement('div');

    post.setAttribute('id', postObj.id);
    post.setAttribute('class', 'post');

    post.innerHTML = `
        <div class="drag-icon-container"></div>
        <div class="delete-icon-container"></div>
        <p class="content text-post-content">
            ${postObj.content}
        </p>
    `;

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
    const postContainer = document.querySelector('#posts-wrapper');
    const typeSelector = document.querySelector('#post-type-selector');
    state.posts.forEach((postObj) => {
        const post = createPostObject(postObj);
        postContainer.insertBefore(post, typeSelector);
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
    const posts = document.getElementsByClassName('.post');
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

// ensures that page as loaded before running anything
async function init() {
    const addPostButton = document.querySelector('#add-button');
    const addTextPostButton  = document.querySelector('#add-text-post');
    const textPostForm  = document.querySelector('#text-post-popup form');

    deleteDummyPosts();
    await dbReady();
    console.log('db is ready.');

    let retrievedPosts = await getAllPosts();
    const state = {
        postIDCounter: retrievedPosts.length,
        posts: retrievedPosts,
    };

    console.log(`${JSON.stringify(state)}`);

    populatePosts(state);

    addPostButton.onclick = () => {
        const postTypeSelector = document.querySelector('#post-type-selector');
        
        toggleVisibility(postTypeSelector);
    };

    addTextPostButton.addEventListener('click', () => {
        const textPostPopup = document.querySelector('#text-post-popup');
        const popupBackground = document.querySelector(".popup-background");
        toggleVisibility(textPostPopup);
        
        toggleVisibility(popupBackground);
    });

    textPostForm.addEventListener('submit', (event) => {
        textPostFormSubmit(event, state).then((res) => {
            const index = !state.postIDCounter ? 0: state.postIDCounter-1;
            console.log(state);
            console.log(index);
            appendPost(state.posts[index]);
        });
    });
}