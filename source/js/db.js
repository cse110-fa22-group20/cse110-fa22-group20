const testing = false;
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

// integer is the version number for the database
// changing it will trigger onupgradeneeded
const request = indexedDB.open("UnpluggdDatabase", 3);

request.onerror = (event) => {
    console.error("An error occurred with IndexedDB");
    console.error(event);
}

// run whenever a new db is created or the version changes
request.onupgradeneeded = () => {
    const db = request.result;

    if(!db.objectStoreNames.contains('posts')) {
        // create a table/collection to store posts
        // keyPath is the primary key and will be auto incremented
        const posts = db.createObjectStore("posts", {keyPath: "id", autoIncrement: true});
    }

    if(!db.objectStoreNames.contains('post-order')) {
        // create a table/collection to store the order of posts
        const postOrder = db.createObjectStore("post-order");
        postOrder.put([], 'post-order');
    }

    if(!db.objectStoreNames.contains('details')) {
        // create a table/collection to store user details
        const details = db.createObjectStore("details", {keyPath: "name"});
    }
}

/*
    Returns a promise that resolves once 'request' is ready.
*/
const dbReady = () => {
    const delay = (ms) => {
        return new Promise((timerRes) => {
            setTimeout(timerRes, ms);
        });
    }
    return new Promise(async (res) => {
        while (request.readyState !== 'done') {
            await delay(200);
        }
        res(true);
    });
};


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
    return new Promise((res, rej) => {
        const db = request.result;
        const transaction = db.transaction("posts", "readwrite");
        const posts = transaction.objectStore("posts");

        let success;
        const query = posts.add(post);

        query.onsuccess = (e) => {
            // this returns the ID assigned to the new obj.
            // used for tracking the order of posts when new posts are added
            res(e.target.result); 
        }

        query.onerror = (event) => {
            console.error(`An error occured with IndexedDB: (post)\n${JSON.stringify(post)}`);
            console.error(event);
            rej(false);
        }
    });
};

/** 
 * Update post in the posts table.
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

    console.log(post);

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
    return new Promise((res, rej) => {
        const db = request.result;
        const transaction = db.transaction("posts", "readwrite");
        const posts = transaction.objectStore("posts");
    
        const query = posts.getAll();
    
        query.onsuccess = (event) => {
            for(const post of query.result) {
                if(post.id === id) {
                    res(post);
                    break;
                }
            }
        }
    
        query.onerror = (event) => {
            console.error("An error occured with IndexedDB");
            console.error(event);
            rej(null);
        }
    });
}

/** 
 * Get all posts in the posts table.
 * 
 * return an array of post JSON objects
 */
const getAllPosts = async () => {
    return new Promise((res, rej) => {
        const db = request.result;
        const transaction = db.transaction("posts", "readwrite");
        const posts = transaction.objectStore("posts");

        let query = posts.getAll();

        query.onsuccess = () => {
            console.log("Successfully retrieved all posts from db.");
            res(query.result);
        }

        query.onerror = (event) => {
            console.log("An error occured with IndexedDB");
            console.log(event);
            rej([]);
        }
    });
}

/** 
 * Delete post with the given id from the posts table.
 * 
 * id = integer
 * 
 * return true if successful, false otherwise
 */
const deletePostFromDB = (id) => {
    return new Promise((res, rej) => {
        const db = request.result;
        const transaction = db.transaction("posts", "readwrite");
        const posts = transaction.objectStore("posts");

        let success = false;
        let query = posts.delete(id);

        query.onsuccess = () => {
            res(true);
        }

        query.onerror = (event) => {
            console.log("An error occured with IndexedDB");
            console.log(event);
            rej(false);
        }
    });
}

const getPostOrder = () => {
    return new Promise((res, rej) => {
        const db = request.result;
        const transaction = db.transaction("post-order", "readwrite");
        const postOrder = transaction.objectStore("post-order");
    
        const query = postOrder.getAll();
    
        query.onsuccess = (event) => {
            if (query.result.length) {
                res(query.result[0]);
            }
            res(query.result);
        }
    
        query.onerror = (event) => {
            console.error("An error occured with IndexedDB");
            console.error(event);
            rej(null);
        }
    });
}

const updatePostOrder = (orderArray) => {
    const db = request.result;
    const transaction = db.transaction("post-order", "readwrite");
    const postOrder = transaction.objectStore("post-order");

    let success = false;
    let query = postOrder.put(orderArray, 'post-order');

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
 * Adds user details to the details table.
 * 
 * details = {
 *     name: string,
 *     image: string,
 *     description: string,
 *     primaryColor: string,
 *     secondaryColor: string,
 * }
 * 
 * return true if successful, false otherwise
 */
 const addDetails = (detailsObj) => {
    return new Promise((res, rej) => {
        const db = request.result;
        const transaction = db.transaction("details", "readwrite");
        const details = transaction.objectStore("details");

        let query = details.add(detailsObj);

        query.onsuccess = () => {
            console.log(); // fill in later
            res(true);
        }

        query.onerror = (event) => {
            console.log("An error occured with IndexedDB");
            console.log(event);
            rej(false);
        }
    });
}

/** 
 * Update user details in the details table.
 * 
 * details = {
 *     name: string,
 *     image: string,
 *     description: string,
 *     primaryColor: string,
 *     secondaryColor: string,
 * }
 * 
 * return true if successful, false otherwise
 */
const updateDetails = (detailsObj) => {
    const db = request.result;
    const transaction = db.transaction("details", "readwrite");
    const details = transaction.objectStore("details");

    let success = false;
    let query = details.put(detailsObj);

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
 * Get user details from the details table.
 * 
 * return a single details JSON object
 */
const getDetails = () => {
    return new Promise((res, rej) => {
        const db = request.result;
        const transaction = db.transaction("details", "readwrite");
        const details = transaction.objectStore("details");

        // since there is only one item we can just call getAll()
        let query = details.getAll();

        query.onsuccess = () => {
            res(query.result[0]);
        }

        query.onerror = (event) => {
            console.log("An error occured with IndexedDB");
            console.log(event);
            rej(null);
        }
    });
}

/** 
 * Delete users details from details table.
 * 
 * return true if successful, false otherwise
 */
const deleteDetails = () => {
    const db = request.result;
    const transaction = db.transaction("details", "readwrite");
    const details = transaction.objectStore("details");

    let success = false;
    let query = details.clear();

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

if (testing) {
    exports.dbReady = dbReady;
    exports.addPost = addPost;
    exports.updatePost = updatePost;
    exports.getPost = getPost;
    exports.getAllPosts = getAllPosts;
    exports.getPostOrder = getPostOrder;
    exports.updatePostOrder = updatePostOrder;
    exports.deletePostFromDB = deletePostFromDB;
    exports.addDetails = addDetails;
    exports.updateDetails = updateDetails;
    exports.getDetails = getDetails;
    exports.deleteDetails = deleteDetails;
}

// 14 lines
export { 
    dbReady,
    addPost, 
    updatePost, 
    getPost, 
    getAllPosts, 
    deletePostFromDB, 
    getPostOrder,
    updatePostOrder,
    addDetails, 
    updateDetails, 
    getDetails, 
    deleteDetails,
};