/**
 * @jest-environment jsdom
 */
require("fake-indexeddb/auto");
const newUser = require("../new-user.js");
const db = require("../db.js");

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

describe("checkUserExist tests", () => {
    test("no user", async () => {
        await newUser.loadModules();
        await db.dbReady();
        await expect(newUser.checkUserExist()).rejects.toBe(false);
    });

    test("valid user", async () => {
        await newUser.loadModules();
        await db.dbReady();
        const details = { 
            name: "string", image: "string", description: "string", 
            primaryColor: null, secondaryColor: null
        };
        await db.addDetails(details)
        await expect(newUser.checkUserExist()).resolves.toBe(true);
    });

    test("invalid user", async () => {
        await newUser.loadModules();
        await db.dbReady();
        const details = { 
            name: "", image: "string", description: "string", 
            primaryColor: null, secondaryColor: null
        };
        await db.addDetails(details)
        await expect(newUser.checkUserExist()).rejects.toBe(false);
    });
});