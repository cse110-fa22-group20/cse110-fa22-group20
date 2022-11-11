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

    const submitButton = document.querySelector("#go-button");
    submitButton.addEventListener("click", uploadProfile);
 }
 
/**
 * Returns whether a valid user object exists in db
 */
const checkUserExist = async () => {
    return new Promise(async (res, rej) => {
        const userObj = await getDetails();
        if(userObj === null) rej(false);
        
        const validProfile = checkProfile(userObj);
        if(validProfile === false) rej(false);
        res(true);
    });
}

/**
 * Takes in an object and check whether the profileObj is in the form of
 * profileObj = {
 *     name: string,
 *     image: string,
 *     description: string,
 *     primaryColor: string,
 *     secondaryColor: string,
 * }
 */
const checkProfile = (profileObj) => {
    if(typeof(profileObj) !== "object") return false;

    const KEYS = ["name", "image", "description", "primaryColor", "secondaryColor"];
    const TYPES = ["string", "object", "string", "object", "object"];
    for(let i = 0; i < KEYS.length; i++) {
        // this key doesn't even exist in profileObj
        if(!(KEYS[i] in profileObj)) return false;

        // the corresponding value has a wrong type
        if(typeof(profileObj[KEYS[i]]) != TYPES[i]) return false;
    }
    
    return true;
}

 /**
  * Uploads the user profile when submit is clicked
  * 
  * returns whether the action was successful
  */
 const uploadProfile = async () => {
    const form = document.querySelector("form.user-form");

    const profileObj = getFormData(form);
    if(checkProfile(profileObj) === false) {
        console.log("Invalid profile object");
        return false;
    }

    const success = await addDetails(profileObj);
    if(success === false) {
        console.log("Add details failed");
        return false;
    }

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
 const getFormData = (form) => {
    const formData = new FormData(form);
    const profileObj = {};

    // populate profileObj
    profileObj["name"] = formData.get("user-name");
    profileObj["image"] = formData.get("user-image");
    profileObj["description"] = formData.get("user-description");
    profileObj["primaryColor"] = null;
    profileObj["secondaryColor"] = null;

    return profileObj;
 }

 export { checkUserExist, checkProfile, getFormData };