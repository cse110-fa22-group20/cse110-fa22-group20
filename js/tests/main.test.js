/**
 * @jest-environment jsdom
 */
//require("fake-indexeddb/auto");
//const main = require("../main");
const main =  require('../main');

test("Test 'createTextPostObject'", () => {
    const newPost = {
        id: 20,
        type: 'text',
        content: 'dummy text',
    };

    expect(main.createTextPostObject(newPost).tagName).toBe('DIV');
    expect(main.createTextPostObject(newPost).getAttribute('id')).toBe('20');
    expect(main.createTextPostObject(newPost).getAttribute('class')).toBe('post');
    expect(main.createTextPostObject(newPost).innerHTML).toBe(`
        <div class="drag-icon-container"></div>
        <div class="delete-icon-container"></div>
        <p class="content text-post-content">
            dummy text
        </p>
    `);
});

test("'populatePosts' five posts.", () => {
    const state = {
        postIDCounter: 0,
        posts: [],
    };

    for (let i = 0; i < 5; i++) {
        const newPost = {
            id: i,
            type: 'text',
            content: 'dummy text',
        };
        state.posts.push(newPost);
        state.postIDCounter++;
    }

    const postContainer = document.createElement('section');
    postContainer.setAttribute('id', 'posts-wrapper');
    const typeSelector = document.createElement('div');
    typeSelector.setAttribute('id', 'post-type-selector');
    typeSelector.setAttribute('class', 'hidden');
    postContainer.appendChild(typeSelector);
    document.body.innerHTML = '<div id="root"></div>'
    document.querySelector('#root').appendChild(postContainer);

    main.populatePosts(state);
    expect(postContainer.childElementCount).toBe(6);
});

test("'populatePosts' zero posts.", () => {
    const state = {
        postIDCounter: 0,
        posts: [],
    };

    const postContainer = document.createElement('section');
    postContainer.setAttribute('id', '#posts-wrapper');
    const typeSelector = document.createElement('div');
    typeSelector.setAttribute('id', 'post-type-selector');
    typeSelector.setAttribute('class', 'hidden');
    postContainer.appendChild(typeSelector);

    main.populatePosts(state);
    expect(postContainer.childElementCount).toBe(1);
});