/**
 * @file File stores all the functions that make the new-user form functional. Also redirect to main.html if an user object already exists in db
 */
const testing = false;
var addDetails = null, dbReady = null, getDetails = null;
const loadModules = async () => {
    return new Promise((res, rej) => {
        if(!testing) {
            import('./db.js').then(exports => {
                addDetails = exports.addDetails;
                dbReady = exports.dbReady;
                getDetails = exports.getDetails;
                res();
                return;
            });
        } else {
            addDetails = require("./db.js").addDetails;
            dbReady = require("./db.js").dbReady;
            getDetails = require("./db.js").getDetails;
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
        // new user
    });

    const imageInput = document.querySelector("#user-image");
    imageInput.addEventListener("change", updateImage);

    const submitButton = document.querySelector("#go-button");
    submitButton.addEventListener("click", uploadProfile);
}
 
/**
 * @return whether a valid user object exists in db
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
 * @param {object} profileObj - object to be checked
 * @return whether the profile matches the form mentioned above
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

    // name must be at most 20 characters
    if(profileObj["name"].length > 20) {
        alert("The maximum length of name is 20 characters!");
        return false;
    }

    // name must have a positive length
    if(profileObj["name"].length <= 0) {
        alert("Please enter your name!");
        return false;
    }

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
    if(!image) return;
    imageArea.style.backgroundImage = `url(${URL.createObjectURL(image)})`;
}

/**
  * Uploads the user profile to the database when submit is clicked
  * 
  * @return whether the action was successful
  */
const uploadProfile = async () => {
    const form = document.querySelector("form.user-form");

    const profileObj = await getFormData(form);
    if(checkProfile(profileObj) === false) {
        return false;
    }

    const successAdd = await addDetails(profileObj);
    if(successAdd === false) {
        return false;
    }

    // redirect to main.html
    window.location.href = "./main.html";
    return true;
}

/**
 * Gets data gathered from the form and build them into a profile object
 * that has the form
 * profileObj = {
 *     name: string,
 *     image: string,
 *     description: string,
 *     primaryColor: string,
 *     secondaryColor: string
 * }
 * @return an object of the form or null if the profile picture does not exist
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

        // grab the image and convert it to base64
        const imageInput = document.querySelector("#user-image");
        const image = imageInput.files[0];
        const reader = new FileReader();
        
        reader.addEventListener("load", () => {
            profileObj["image"] = reader.result;
            res(profileObj);
            return profileObj;
        });

        if(!image) {
            alert("Please upload a profile picture!");
            res(null);
            return null;
        }
        reader.readAsDataURL(image);
    });
}

if(testing) {
    exports.loadModules = loadModules;
    exports.checkUserExist = checkUserExist;
    exports.checkProfile = checkProfile;
    exports.updateImage = updateImage;
    exports.getFormData = getFormData;
}
