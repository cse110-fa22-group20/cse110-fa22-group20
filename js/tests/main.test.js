/**
 * @jest-environment jsdom
 */
//require("fake-indexeddb/auto");
const main =  require('../main');

test("Test 'createTextPostObject'", () => {
    const newPost = {
        id: 20,
        type: 'text',
        content: 'dummy text',
    };

    expect(main.createTextPostObject(newPost).tagName).toBe('DIV');
    expect(main.createTextPostObject(newPost).getAttribute('id')).toBe('p20');
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
    document.body.innerHTML = '<div id="root"></div>'
    document.querySelector('#root').appendChild(postContainer);

    main.populatePosts(state);
    expect(postContainer.childElementCount).toBe(1);
});

test("'appendPost' one time.", () => {
    const newPost = {
        id: 0,
        type: 'text',
        content: 'dummy text',
    };

    const postContainer = document.createElement('section');
    postContainer.setAttribute('id', 'posts-wrapper');
    const typeSelector = document.createElement('div');
    typeSelector.setAttribute('id', 'post-type-selector');
    typeSelector.setAttribute('class', 'hidden');
    postContainer.appendChild(typeSelector);
    document.body.innerHTML = '<div id="root"></div>'
    document.querySelector('#root').appendChild(postContainer);

    main.appendPost(newPost);

    const el = document.querySelector('#root').firstChild.firstChild;
    expect(el.tagName).toBe('DIV');
    expect(el.getAttribute('id')).toBe('p0');
    expect(el.getAttribute('class')).toBe('post');
    expect(el.innerHTML).toBe(`
        <div class="drag-icon-container"></div>
        <div class="delete-icon-container"></div>
        <p class="content text-post-content">
            dummy text
        </p>
    `);
});

test("'appendPost' two times.", () => {
    const newPost1 = {
        id: 0,
        type: 'text',
        content: 'dummy text',
    };

    const newPost2 = {
        id: 1,
        type: 'text',
        content: 'dummy text',
    };

    const postContainer = document.createElement('section');
    postContainer.setAttribute('id', 'posts-wrapper');
    const typeSelector = document.createElement('div');
    typeSelector.setAttribute('id', 'post-type-selector');
    typeSelector.setAttribute('class', 'hidden');
    postContainer.appendChild(typeSelector);
    document.body.innerHTML = '<div id="root"></div>'
    document.querySelector('#root').appendChild(postContainer);

    main.appendPost(newPost1);
    main.appendPost(newPost2);

    const el1 = document.querySelector('#root').firstChild.firstChild;
    expect(el1.tagName).toBe('DIV');
    expect(el1.getAttribute('id')).toBe('p0');
    expect(el1.getAttribute('class')).toBe('post');
    expect(el1.innerHTML).toBe(`
        <div class="drag-icon-container"></div>
        <div class="delete-icon-container"></div>
        <p class="content text-post-content">
            dummy text
        </p>
    `);

    const el2 = document.querySelector('#root').firstChild.firstChild.nextSibling;
    expect(el2.tagName).toBe('DIV');
    expect(el2.getAttribute('id')).toBe('p1');
    expect(el2.getAttribute('class')).toBe('post');
    expect(el2.innerHTML).toBe(`
        <div class="drag-icon-container"></div>
        <div class="delete-icon-container"></div>
        <p class="content text-post-content">
            dummy text
        </p>
    `);
});

test("'insertPost'", () => {
    const newPost1 = {
        id: 0,
        type: 'text',
        content: 'dummy text',
    };

    const newPost2 = {
        id: 1,
        type: 'text',
        content: 'dummy text',
    };

    const postContainer = document.createElement('section');
    postContainer.setAttribute('id', 'posts-wrapper');
    const typeSelector = document.createElement('div');
    typeSelector.setAttribute('id', 'post-type-selector');
    typeSelector.setAttribute('class', 'hidden');
    postContainer.appendChild(typeSelector);
    document.body.innerHTML = '<div id="root"></div>'
    document.querySelector('#root').appendChild(postContainer);

    main.appendPost(newPost1);
    main.insertPost(newPost2, 0);

    const el1 = document.querySelector('#root').firstChild.firstChild;
    expect(el1.tagName).toBe('DIV');
    expect(el1.getAttribute('id')).toBe('p1');
    expect(el1.getAttribute('class')).toBe('post');
    expect(el1.innerHTML).toBe(`
        <div class="drag-icon-container"></div>
        <div class="delete-icon-container"></div>
        <p class="content text-post-content">
            dummy text
        </p>
    `);

    const el2 = document.querySelector('#root').firstChild.firstChild.nextSibling;
    expect(el2.tagName).toBe('DIV');
    expect(el2.getAttribute('id')).toBe('p0');
    expect(el2.getAttribute('class')).toBe('post');
    expect(el2.innerHTML).toBe(`
        <div class="drag-icon-container"></div>
        <div class="delete-icon-container"></div>
        <p class="content text-post-content">
            dummy text
        </p>
    `);
});
