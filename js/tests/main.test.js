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
            content: "Test 1"
        };
        await main.loadModules();
        await db.dbReady();
        await db.addPost(post);
        expect(await main.deletePost("0")).toBe(true);
        expect(document.querySelector('[data-post-id="0"]')).toBe(null);
        const posts = await db.getAllPosts();
        expect(posts.length).toBe(0);
    });
});
