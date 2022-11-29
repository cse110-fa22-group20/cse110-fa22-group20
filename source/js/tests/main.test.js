/**
 * @jest-environment jsdom
 */
require("fake-indexeddb/auto");
const main =  require('../main');
const db = require('../db');

/*
describe("populatePosts tests", () => {
    test("zero posts.", () => {
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
        main.populatePosts(state.posts);
        expect(postContainer.childElementCount).toBe(1);
    });

    test("five posts.", async () => {
        await main.loadModules();
        await db.dbReady();
        //jest.spyOn(db, 'getPostOrder').mockImplementation(() => [0, 1, 2, 3, 4]);
        //db.updatePostOrder([0, 1, 2, 3, 4]);
        const posts = [];
    
        for (let i = 0; i < 5; i++) {
            const newPost = {
                id: i,
                type: 'text',
                content: 'dummy text'
            };
            posts.push(newPost);
        }
    
        const postContainer = document.createElement('section');
        postContainer.setAttribute('id', 'posts-wrapper');
        const typeSelector = document.createElement('div');
        typeSelector.setAttribute('id', 'post-type-selector');
        typeSelector.setAttribute('class', 'hidden');
        postContainer.appendChild(typeSelector);
        document.body.innerHTML = '<div id="root"></div>'
        document.querySelector('#root').appendChild(postContainer);
    
        main.populatePosts(posts);
        expect(postContainer.childElementCount).toBe(6);
    });
});
*/


test("Test 'createTextPostObject'", () => {
    const newPost = {
        id: 20,
        type: 'text',
        content: 'dummy text',
    };

    const post = main.createTextPostObject(newPost);
    expect(post.tagName).toBe('DIV');
    expect(post.getAttribute('data-post-id')).toBe('20');
    expect(post.getAttribute('class')).toBe('post text-post');
    expect(post.querySelector('pre').innerText).toBe('dummy text');
});

describe("appendPost tests", () => {
    test("one time.", () => {
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
        expect(el.getAttribute('data-post-id')).toBe('0');
        expect(el.getAttribute('class')).toBe('post text-post');
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
        expect(el1.getAttribute('data-post-id')).toBe('0');
        expect(el1.getAttribute('class')).toBe('post text-post');
        expect(el1.querySelector('pre').innerText).toBe('dummy text');
    
        const el2 = document.querySelector('#root').firstChild.firstChild.nextSibling;
        expect(el2.tagName).toBe('DIV');
        expect(el2.getAttribute('data-post-id')).toBe('1');
        expect(el2.getAttribute('class')).toBe('post text-post');
        expect(el2.querySelector('pre').innerText).toBe('dummy text');
    });
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
    expect(el1.getAttribute('data-post-id')).toBe('1');
    expect(el1.getAttribute('class')).toBe('post text-post');
    expect(el1.querySelector('pre').innerText).toBe('dummy text');

    const el2 = document.querySelector('#root').firstChild.firstChild.nextSibling;
    expect(el2.tagName).toBe('DIV');
    expect(el2.getAttribute('data-post-id')).toBe('0');
    expect(el2.getAttribute('class')).toBe('post text-post');
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
            content: "Test 1-1"
        };
        await main.loadModules();
        await db.dbReady();
        
        await db.addPost(post);
        const postContainer = document.createElement('section');
        postContainer.setAttribute('id', '#posts-wrapper');
        const samplePost = main.createTextPostObject(post);
        postContainer.appendChild(samplePost);
        document.body.innerHTML = '<div id="root"></div>'
        document.querySelector('#root').appendChild(postContainer);

        expect(await main.deletePost("0")).toBe(true);
        expect(document.querySelector('[data-post-id="0"]')).toBe(null);
        const posts = await db.getAllPosts();
        expect(posts.length).toBe(0);
    });

    test("delete one post with valid postID(1)", async () => {
        const post = [
            {
                id: 0,
                type: "text",
                content: "Test 2-1"
            },
            {
                id: 1,
                type: "text",
                content: "Test 2-2"
            },
            {
                id: 2,
                type: "text",
                content: "Test 2-3"
            }
        ];
        await main.loadModules();
        await db.dbReady();
        
        await db.addPost(post[0]);
        await db.addPost(post[1]);
        await db.addPost(post[2]);
        const postContainer = document.createElement('section');
        postContainer.setAttribute('id', '#posts-wrapper');
        for(let i = 0; i < 3; i++) {
            const samplePost = main.createTextPostObject(post[i]);
            postContainer.appendChild(samplePost);
        }
        document.body.innerHTML = '<div id="root"></div>'
        document.querySelector('#root').appendChild(postContainer);

        expect(await main.deletePost("1")).toBe(true);
        expect(document.querySelector('[data-post-id="0"]')).not.toBe(null);
        expect(document.querySelector('[data-post-id="1"]')).toBe(null);
        expect(document.querySelector('[data-post-id="2"]')).not.toBe(null);
        const posts = await db.getAllPosts();
        expect(posts.length).toBe(2);
    });
});
