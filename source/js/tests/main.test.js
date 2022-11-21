/**
 * @jest-environment jsdom
 */
require("fake-indexeddb/auto");
const main =  require('../main');
const db = require('../db');

test("Test 'createTextPostObject'", () => {
    const newPost = {
        id: 20,
        type: 'text',
        content: 'dummy text',
    };

    expect(main.createTextPostObject(newPost).tagName).toBe('DIV');
    expect(main.createTextPostObject(newPost).getAttribute('id')).toBe('p20');
    expect(main.createTextPostObject(newPost).getAttribute('class')).toBe('post');
    expect(main.createTextPostObject(newPost).querySelector('pre').innerText).toBe('dummy text');
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
    expect(el.querySelector('pre').innerText).toBe('dummy text');
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
    expect(el1.querySelector('pre').innerText).toBe('dummy text');

    const el2 = document.querySelector('#root').firstChild.firstChild.nextSibling;
    expect(el2.tagName).toBe('DIV');
    expect(el2.getAttribute('id')).toBe('p1');
    expect(el2.getAttribute('class')).toBe('post');
    expect(el2.querySelector('pre').innerText).toBe('dummy text');
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
    expect(el1.querySelector('pre').innerText).toBe('dummy text');

    const el2 = document.querySelector('#root').firstChild.firstChild.nextSibling;
    expect(el2.tagName).toBe('DIV');
    expect(el2.getAttribute('id')).toBe('p0');
    expect(el2.getAttribute('class')).toBe('post');
    expect(el2.querySelector('pre').innerText).toBe('dummy text');
});

describe("deletePost tests", () => {
    test("invalid postID('abc')", async () => {
        expect(await main.deletePost("abc")).toBe(false);
    });
    
    test("invalid postID('3.5')", async () => {
        expect(await main.deletePost("3.5")).toBe(false);
    });

    test("invalid postID(null)", async () => {
        expect(await main.deletePost(null)).toBe(false);
    });

    test("delete one post with valid postID(0)", async () => {
        const post = {
            id: 0,
            type: "text",
            content: "Test 1"
        };
        await main.loadModules();
        await db.dbReady();
        await db.addPost(post);
        expect(await main.deletePost("p0")).toBe(true);
        expect(document.querySelector("#p0")).toBe(null);
        const posts = await db.getAllPosts();
        expect(posts.length).toBe(0);
    });
});
