/**
 * @jest-environment jsdom
 */
// const checkUserExist = require("../new-user.js").checkUserExist;
const checkProfile = require("../new-user.js").checkProfile;
// const updateImage = require("../new-user.js").updateImage;
// const getFormData = require("../new-user.js").getFormData;

// just a dummy test
test("Dummy test", () => {
    const profileObj = {
        name: "A"
    };
    expect(checkProfile(profileObj)).toBe(false);
});
