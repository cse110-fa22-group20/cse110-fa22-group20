/**
 * @jest-environment jsdom
 */
require("fake-indexeddb/auto");
const db =  require('../db');

describe("db tests", () => {
    test("clearAllposts empties db", async () => {
        await db.dbReady();
        await db.addPost({"test": "test"});

        const beforeGetResult = await db.getAllPosts();
        
        db.clearAllPosts();

        const afterGetResult = await db.getAllPosts();
        
        expect(beforeGetResult.length).toBe(1);
        expect(afterGetResult.length).toBe(0);
    })

    test("getAllPosts returns empty array when there are no posts", async () => {
        await db.dbReady();
        const result = await db.getAllPosts();
        
        expect(result.length).toBe(0);
    });

    test("addPost adds an item to the db and does not return null", async () => {
        await db.dbReady();

        const beforeGetResult = await db.getAllPosts();
        const addResult = await db.addPost({"test": "test"});
        const afterGetResult = await db.getAllPosts();
        
        expect(beforeGetResult.length).toBe(0);
        expect(addResult).not.toBe(null);
        expect(afterGetResult.length).toBe(1);

        db.clearAllPosts();
    });

    test("addPost adds 10 items to the db", async () => {
        await db.dbReady();

        const beforeGetResult = await db.getAllPosts();

        for(let i = 0; i < 10; i++) {
            await db.addPost({"test": "test"});
        }

        const afterGetResult = await db.getAllPosts();
        
        expect(beforeGetResult.length).toBe(0);
        expect(afterGetResult.length).toBe(10);

        db.clearAllPosts();
    });

    test("deletePost removes item with valid id from db", async() => {
        await db.dbReady();

        const addResult = await db.addPost({"test": "test"});
        const beforeGetResult = await db.getAllPosts();
        const deleteResult = await db.deletePostFromDB(addResult);
        const afterGetResult = await db.getAllPosts();
        
        expect(beforeGetResult.length).toBe(1);
        expect(deleteResult).toBe(true);
        expect(afterGetResult.length).toBe(0);

        db.clearAllPosts();
    })

    test("deletePost removes nothing from db when there is an invalid id", async() => {
        await db.dbReady();

        // will be inserted w/ id = 1
        await db.addPost({"test": "test"});
        const beforeGetResult = await db.getAllPosts();
        // id = 2 does not exist
        await db.deletePostFromDB(2);
        const afterGetResult = await db.getAllPosts();
        
        expect(beforeGetResult.length).toBe(1);
        expect(afterGetResult.length).toBe(1);

        db.clearAllPosts();
    })

    test("updatePost updates post with valid id and does not add a new one", async() => {
        await db.dbReady();

        const addResult = await db.addPost({"test": "test"});
        const beforeGetResult = await db.getAllPosts();
        const updateResult = await db.updatePost({"id": addResult, "test": "newtest"});
        const afterGetResult = await db.getAllPosts();

        const getPost = await db.getPost(addResult);
        
        expect(beforeGetResult.length).toBe(1);
        expect(getPost.id).toBe(addResult);
        expect(getPost["test"]).toBe("newtest");
        expect(afterGetResult.length).toBe(1);

        db.clearAllPosts();
    })

    test("updatePost does not update post with invalid id", async() => {
        await db.dbReady();

        const addResult = await db.addPost({"test": "test"});
        db.updatePost({"id": 200, "test": "newtest"});

        const getPost = await db.getPost(addResult);
        
        expect(getPost.id).toBe(addResult);
        expect(getPost["test"]).toBe("test");

        db.clearAllPosts();
    })

    test ("getDetails returns null if there are no details submitted", async () => {
        await db.dbReady();

        const result = await db.getDetails();

        expect(result).toBe(null);
    })

    test ("addDetails adds information to db", async () => {
        await db.dbReady();

        const beforeGetResult = await db.getDetails();
        const addResult = await db.addDetails({"description": "test", "image": null, "name": "test", "primaryColor": null, "secondaryColor": null});
        const afterGetResult = await db.getDetails();

        expect(beforeGetResult).toBe(null);
        expect(addResult).toBe(true);
        expect(afterGetResult).not.toBe(null);
    })
})
