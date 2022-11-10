/**
 * File stores all the functions that make the new-user form functional
 * Also redirect to main.html if an user object already exists in db
 */
 import { addDetails, getDetails } from './db.js';

 window.addEventListener('DOMContentLoaded', init);

 // ensures that page as loaded before running anything
 function init() {
    const userExist = checkUserExist();
    if(userExist === true) {
        // TODO 1: redirect to main.html
    }

    const submitButton = document.querySelector("#go-button");
    submitButton.onclick = uploadProfile;
 }
 
/**
 * Returns whether a valid user object exists in db
 */
const checkUserExist = () => {
    // TODO 2
    return true;
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
    // TODO 3
    return true;
}

 /**
  * Uploads the user profile when submit is clicked
  * 
  * returns whether the action was successful
  */
 const uploadProfile = () => {
    // TODO 4: grab form from html
    const formData = getFormData(form);

    // parse formData into an obj
    const profileObj = parseFormData(formData);
    if(checkProfile(profileObj) === false) {
        // TODO 5: handle invalid profile
        return false;
    }

    const success = addDetails(profileObj);
    if(success === false) {
        // TODO 6: handle db error
        return false;
    }
    return true;
 }

 /**
  * Returns the data gathered from the form
  * !No error checking!
  */
 const getFormData = (form) => {
    // TODO 7
 }

 /**
  * Gets an formdata and parse it into an object
  * !No error checking!
  */
 const parseFormData = (formData) => {
    // TODO 8
 }

 export { checkUserExist, checkProfile, getDetails, parseFormData };