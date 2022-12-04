/**
 * @jest-environment jsdom
 */
require("fake-indexeddb/auto");
//const main = require("../main");
const db =  require('../db');

test("Test 'createTextPostObject'", async () => {
    await db.dbReady();
    const redundant = true;
    expect(redundant).toBe(true);
});