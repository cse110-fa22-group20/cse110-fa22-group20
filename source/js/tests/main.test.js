/**
 * @jest-environment jsdom
 */
require("fake-indexeddb/auto");
const main =  require('../main');
const db = require('../db');

test("'populatePosts' zero posts.", () => {
    expect(1).toBe(1);
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
