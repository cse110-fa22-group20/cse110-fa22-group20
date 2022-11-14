/**
 * @jest-environment jsdom
 */
require("fake-indexeddb/auto");
const newUser = require("../new-user.js");

// just a dummy test
test("Dummy test", () => {
    expect(newUser.checkProfile(null)).toBe(false);
});
