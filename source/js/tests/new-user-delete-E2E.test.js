const puppeteer = require('puppeteer');
var browers, page;
describe('New User', () => {
    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('http://127.0.0.1:5500/source/pages/new-user.html');
    });

    afterAll(async () => {
        await browser.close();
    });
  
    it('Check the fields are there', async () => {
        expect(await page.$('#user-image')).not.toBe(null);
        expect(await page.$('#user-name')).not.toBe(null);
        expect(await page.$('#user-description')).not.toBe(null);
    });

    it('Submitting a blank form', async () => {
        const submit = await page.$('#go-button');
        await submit.click();
        // blank form is not permitted, no redirection
        expect(await page.url()).toBe('http://127.0.0.1:5500/source/pages/new-user.html');
    }, 1000);

    it('Submitting a form without user name', async () => {
        const description = await page.$('#user-description');
        description.innerText = "A";
        const imageHandler = await page.$('#user-image');
        await imageHandler.uploadFile('./../../assets/placeholder-profile-pic.png');
        const submit = await page.$('#go-button');
        await submit.click();
        // no name is not permitted, no redirection
        expect(await page.url()).toBe('http://127.0.0.1:5500/source/pages/new-user.html');
    }, 1000);

    it('Submitting a form without profile picture', async () => {
        const name = await page.$('#user-name');
        name.innerText = "A";
        const description = await page.$('#user-description');
        description.innerText = "A";
        const submit = await page.$('#go-button');
        await submit.click();
        // no name is not permitted, no redirection
        expect(await page.url()).toBe('http://127.0.0.1:5500/source/pages/new-user.html');
    }, 1000);

    /*it('Submitting a form with everything', async () => {
        const name = await page.$('#user-name');
        name.innerText = "A";
        const description = await page.$('#user-description');
        description.innerText = "A";
        const imageHandler = await page.$('#user-image');
        await imageHandler.uploadFile('./../../assets/placeholder-profile-pic.png');
        const [response] = await Promise.all([
            page.waitForNavigation(), // The promise resolves after navigation has finished
            page.click('#go-button'), // Clicking the link will indirectly cause a navigation
        ]); 
        console.log(respose);
        expect(await page.url()).toBe('http://127.0.0.1:5500/source/pages/main.html');
    }, 10000);*/
});