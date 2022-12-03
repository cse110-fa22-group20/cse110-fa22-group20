/**
 * File stores all the functions that make the new-user form functional
 * Also redirect to main.html if an user object already exists in db
 */
const testing = false;
var addDetails = null, dbReady = null, getDetails = null, addPost = null, updatePostOrder = null;
const loadModules = async () => {
    return new Promise((res, rej) => {
        if(!testing) {
            import('./db.js').then(exports => {
                addDetails = exports.addDetails;
                dbReady = exports.dbReady;
                getDetails = exports.getDetails;
                addPost = exports.addPost;
                updatePostOrder = exports.updatePostOrder;
                res();
                return;
            });
        } else {
            addDetails = require("./db.js").addDetails;
            dbReady = require("./db.js").dbReady;
            getDetails = require("./db.js").getDetails;
            addPost = require("./db.js").addPost;
            updatePostOrder = require("./db.js").updatePostOrder;
            res();
            return;
        }
    });
}

window.addEventListener('DOMContentLoaded', init);

// ensures that page as loaded before running anything
async function init() {
    await loadModules();
    await dbReady();
    checkUserExist().then(userExist =>{
        // redirect to main.html if an user object exists
        window.location.href = "./main.html";
    }).catch(userExist => {
        console.log("new user");
    });

    const imageInput = document.querySelector("#user-image");
    imageInput.addEventListener("change", updateImage);

    const submitButton = document.querySelector("#go-button");
    submitButton.addEventListener("click", uploadProfile);

    const uploadButton = document.querySelector('#existing-page');
    uploadButton.addEventListener('change', useJSON);
}
 
/**
 * Returns whether a valid user object exists in db
 */
const checkUserExist = async () => {
    return new Promise(async (res, rej) => {
        // check if an user object exists in db
        const userObj = await getDetails();
        if(typeof(userObj) !== "object") {
            rej(false);
            return;
        }

        // check to make sure it's valid
        const validProfile = checkProfile(userObj);
        if(validProfile === false) {
            rej(false);
            return;
        }

        res(true);
    });
}

/**
 * Takes in an object and check whether the profileObj is in the form of
 * profileObj = {
 *     name: string,
 *     image: string(base64),
 *     description: string,
 *     primaryColor: string(temporary object),
 *     secondaryColor: string(temporary object),
 * }
 */
const checkProfile = (profileObj) => {
    if(typeof(profileObj) !== "object") return false;

    const KEYS = ["name", "image", "description", "primaryColor", "secondaryColor"];
    const TYPES = ["string", "string", "string", "object", "object"];
    for(let i = 0; i < KEYS.length; i++) {
        // this key doesn't even exist in profileObj
        try {
            if(!(KEYS[i] in profileObj)) return false;

            // the corresponding value has a wrong type
            if(typeof(profileObj[KEYS[i]]) != TYPES[i]) return false;
        } catch (error) {
            return false;
        }
    }

    // name must have a positive length
    if(profileObj["name"].length <= 0) return false;

    return true;
}

/**
 * Updates the profile picture when it's being uploaded
 */
const updateImage = () => {
    const imageInput = document.querySelector("#user-image");
    const imageArea = document.querySelector("#user-image-label");

    // update profile picture
    const image = imageInput.files[0];
    imageArea.style.backgroundImage = `url(${URL.createObjectURL(image)})`;
}

/**
  * Uploads the user profile when submit is clicked
  * 
  * returns whether the action was successful
  */
const uploadProfile = async () => {
    const form = document.querySelector("form.user-form");

    const profileObj = await getFormData(form);
    if(checkProfile(profileObj) === false) return false;

    const successAdd = await addDetails(profileObj);
    if(successAdd === false) return false;

    // redirect to main.html
    window.location.href = "./main.html";
    return true;
}

/**
 * Gets data gathered from the form
 * Returns an object of the form
 * profileObj = {
 *     name: string,
 *     image: string,
 *     description: string,
 *     primaryColor: string,
 *     secondaryColor: string
 * }
 * !No error checking!
 */
const getFormData = async (form) => {
    return new Promise((res, rej) => {
        const formData = new FormData(form);
        const profileObj = {};

        // populate profileObj
        profileObj["name"] = formData.get("user-name");
        profileObj["description"] = formData.get("user-description");
        profileObj["primaryColor"] = null;
        profileObj["secondaryColor"] = null;

        const imageInput = document.querySelector("#user-image");
        const image = imageInput.files[0];
        const reader = new FileReader();
        
        reader.addEventListener("load", () => {
            profileObj["image"] = reader.result;
            res(profileObj);
            return profileObj;
        });

        reader.readAsDataURL(image);
    });
}

const useJSON = async (e) => {
    const delay = () => new Promise(res => setTimeout(res, 5000));
    const uploaded = e.target.files[0];
    let reader = new FileReader();

    try {
        reader.readAsText(uploaded);
        reader.onload = async () => {
            const obj = JSON.parse(reader.result);
            await addDetails(obj['userDetails']);
            await updatePostOrder(obj['postOrder']);
            for (const post of obj['posts']) {
                await addPost(post);
            }
            window.location.href = "./main.html";
        };
    } catch (e) {
        console.log(e);
        await delay();
        window.location.href = "./new-user.html";
    }
};

if(testing) {
    exports.loadModules = loadModules;
    exports.checkUserExist = checkUserExist;
    exports.checkProfile = checkProfile;
    exports.updateImage = updateImage;
    exports.getFormData = getFormData;
}
