/**
 * File stores all the functions used to interact with IndexedDB. 
 */

// make sure to enable indexedDB for older browsers
const indexedDB = 
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

const request = indexedDB.open("UnpluggdDatabase", 1);

request.onerror = (event) => {
    console.error("An error occurred with IndexedDB");
    console.error(event);
}

// run whenever a new db is created or the version changes
request.onupgradeneeded = () => {
    const db = request.result;

    // create a table/collection to store posts
    // keyPath is the primary key and will be auto incremented
    const postsStore = db.createObjectStore("posts", {keyPath: "id", autoIncrement: true});

    // createIndex allows for searching by a "column" name
    // in this case, sorting/searching by "type" is enabled
    postsStore.createIndex("type", ["type"], {unique: false});
}


/** 
 * Adds post to the posts table.
 * 
 * post = {
 *     id: integer,
 *     type: string,
 *     content: 
 *         // type = text
 *         string,
 *         // type = image
 *         [
 *          {
 *              id: integer,
 *              image: string,
 *              caption: string,
 *          }
 *         ],
 * }
 * 
 * return true if successful, false otherwise
 */
const addPost = (post) => {
    const db = request.result;
    const transaction = db.transaction("posts", "readwrite");
    const posts = transaction.objectStore("posts");

    let success = false;
    let query = posts.add(post);

    query.onsuccess = () => {
        console.log(); // fill in later
        success = true;
    }

    query.onerror = (event) => {
        console.log("An error occured with IndexedDB");
        console.log(event);
        success = false;
    }

    return success;
}

/** 
 * Update post with the given id in the posts table.
 * 
 * id = integer
 * post = {
 *     id: integer,
 *     type: string,
 *     content: 
 *         // type = text
 *         string,
 *         // type = image
 *         [
 *          {
 *              id: integer,
 *              image: string,
 *              caption: string,
 *          }
 *         ],
 * }
 * 
 * return true if successful, false otherwise
 */
const updatePost = (post) => {
    const db = request.result;
    const transaction = db.transaction("posts", "readwrite");
    const posts = transaction.objectStore("posts");

    let success = false;
    let query = posts.put(post);

    query.onsuccess = () => {
        console.log(); // fill in later
        success = true;
    }

    query.onerror = (event) => {
        console.log("An error occured with IndexedDB");
        console.log(event);
        success = false;
    }

    return success;
}

/** 
 * Get post from the posts table with the given id.
 * 
 * id = integer
 * 
 * return a single post JSON object
 */
const getPost = (id) => {
    const db = request.result;
    const transaction = db.transaction("posts", "readwrite");
    const posts = transaction.objectStore("posts");

    let post = null;
    let query = posts.get(id);

    query.onsuccess = () => {
        post = query.result[0];
    }

    query.onerror = (event) => {
        console.log("An error occured with IndexedDB");
        console.log(event);
    }

    return post;
}

/** 
 * Get all posts in the posts table.
 * 
 * return an array of post JSON objects
 */
const getAllPosts = () => {
    const db = request.result;
    const transaction = db.transaction("posts", "readwrite");
    const posts = transaction.objectStore("posts");

    let postsArray = null;
    let query = posts.getAll();

    query.onsuccess = () => {
        postsArray = query.result;
    }

    query.onerror = (event) => {
        console.log("An error occured with IndexedDB");
        console.log(event);
    }

    return postsArray;
}

/** 
 * Delete post with the given id from the posts table.
 * 
 * id = integer
 * 
 * return true if successful, false otherwise
 */
const deletePost = (id) => {
    const db = request.result;
    const transaction = db.transaction("posts", "readwrite");
    const posts = transaction.objectStore("posts");

    let success = false;
    let query = posts.delete(id);

    query.onsuccess = () => {
        success = true;
    }

    query.onerror = (event) => {
        console.log("An error occured with IndexedDB");
        console.log(event);
        success = false;
    }

    return success;
}

export { addPost, updatePost, getPost, getAllPosts, deletePost };