/**
 * File stores all the functions that make the new-user form functional
 * Also redirect to main.html if an user object already exists in db
 */
 import { addDetails, dbReady, getDetails } from './db.js';

 window.addEventListener('DOMContentLoaded', init);

 // ensures that page as loaded before running anything
 async function init() {
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
        if(!(KEYS[i] in profileObj)) return false;

        // the corresponding value has a wrong type
        if(typeof(profileObj[KEYS[i]]) != TYPES[i]) return false;
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

 export { checkUserExist, checkProfile, updateImage, getFormData };