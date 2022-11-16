/**
 * @jest-environment jsdom
 */
require("fake-indexeddb/auto");
const newUser = require("../new-user.js");
const db = require("./db-for-test.js");

describe("checkProfile tests", () => {
    test("valid profileObj", () => {
        const profileObj = {
            name: "name",
            image: "image",
            description: "test",
            primaryColor: null,
            secondaryColor: null
        };
        expect(newUser.checkProfile(profileObj)).toBe(true);
    });
    test("profileObj without a name is invalid", () => {
        const profileObj = {
            image: "image",
            description: "test",
            primaryColor: null,
            secondaryColor: null
        };
        expect(newUser.checkProfile(undefined)).toBe(false);
    });
    test("profileObj without a name length of 0 is invalid", () => {
        const profileObj = {
            name: "",
            image: "image",
            description: "test",
            primaryColor: null,
            secondaryColor: null
        };
        expect(newUser.checkProfile(undefined)).toBe(false);
    });
    test("null is invalid", () => {
        expect(newUser.checkProfile(null)).toBe(false);
    });
    test("undefined is invalid", () => {
        expect(newUser.checkProfile(undefined)).toBe(false);
    });
});

describe("checkUserExist tests", async () => {
    test("initially, user does not exist", () => {
        expect(newUser.checkUserExist()).toBe(false);
    });

    // add user to db
    await db.dbReady();
    const profileObj = {
        name: "name",
        image: "image",
        description: "test",
        primaryColor: null,
        secondaryColor: null
    };
    await db.addDetails(profileObj);

    test("user should exist now", () => {
        expect(newUser.checkUserExist()).toBe(true);
    });
});