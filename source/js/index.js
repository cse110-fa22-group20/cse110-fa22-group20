const testing = false;
var dbReady = null, getDetails = null;
const loadModules = async () => {
    return new Promise((res, rej) => {
        if(!testing) {
            import('./db.js').then(exports => {
                dbReady = exports.dbReady;
                getDetails = exports.getDetails;
                res();
                return;
            });
        } else {
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

    const details = await getDetails();

    if(details) {
        window.location.href = "./pages/main.html";
    }
    else {
        window.location.href = "./pages/new-user.html";
    }
}