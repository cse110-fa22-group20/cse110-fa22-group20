const puppeteer = require('puppeteer');
const fs = require("fs");
var browers, page;
const newUserUrl = 'https://cse110-fa22-group20.github.io/cse110-fa22-group20/pages/new-user.html';
const mainUrl = 'https://cse110-fa22-group20.github.io/cse110-fa22-group20/pages/main.html';
describe('New User', () => {
    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto(newUserUrl);
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
        expect(page.url()).toBe(newUserUrl);
    });

    it('Submitting a form without user name', async () => {
        const description = await page.$('#user-description');
        description.innerText = "A";
        const imageHandler = await page.$('#user-image');
        await imageHandler.uploadFile('./../../assets/placeholder-profile-pic.png');
        const submit = await page.$('#go-button');
        await submit.click();
        // no name is not permitted, no redirection
        expect(page.url()).toBe(newUserUrl);
    });

    it('Submitting a form without profile picture', async () => {
        const name = await page.$('#user-name');
        name.innerText = "A";
        const description = await page.$('#user-description');
        description.innerText = "A";
        const submit = await page.$('#go-button');
        await submit.click();
        // no name is not permitted, no redirection
        expect(page.url()).toBe(newUserUrl);
    });

    it('Submitting a form with everything', async () => {
        await page.type('#user-name', "BOT");
        await page.type('#user-description', "Description");
        const imageHandle = await page.$('#user-image');
        await imageHandle.uploadFile('./source/assets/placeholder-profile-pic.png');
        const submit = await page.$('#go-button');
        await submit.click();
        await page.waitForTimeout(1500);
        expect(page.url()).toBe(mainUrl);
    });

    /*it('Should be redirected to main instantly', async () => {
        page.goto(newUserUrl);
        expect(page.url()).toBe(mainUrl);
    });*/
});