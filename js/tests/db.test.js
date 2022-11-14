/**
 * @jest-environment jsdom
 */
 require("fake-indexeddb/auto");
 const db = require("../db.js");
 
 // just a dummy test
 test("Dummy test for dbReady", () => {
    return db.dbReady().then(res => {
        expect(res).toBe(true);
    })
 });
 
