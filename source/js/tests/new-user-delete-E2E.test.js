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
        expect(page.url()).toBe('http://127.0.0.1:5500/source/pages/new-user.html');
    });

    it('Submitting a form without user name', async () => {
        const description = await page.$('#user-description');
        description.innerText = "A";
        const imageHandler = await page.$('#user-image');
        await imageHandler.uploadFile('./../../assets/placeholder-profile-pic.png');
        const submit = await page.$('#go-button');
        await submit.click();
        // no name is not permitted, no redirection
        expect(page.url()).toBe('http://127.0.0.1:5500/source/pages/new-user.html');
    });

    it('Submitting a form without profile picture', async () => {
        const name = await page.$('#user-name');
        name.innerText = "A";
        const description = await page.$('#user-description');
        description.innerText = "A";
        const submit = await page.$('#go-button');
        await submit.click();
        // no name is not permitted, no redirection
        expect(page.url()).toBe('http://127.0.0.1:5500/source/pages/new-user.html');
    });

    it('Submitting a form with everything', async () => {
        await page.type('#user-name', "BOT");
        await page.type('#user-description', "Description");
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click('#user-image-label'), // some button that triggers file selection
        ]);
        await fileChooser.accept(['./source/assets/placeholder-profile-pic.png']);
        const submit = await page.$('#go-button');
        await submit.click();
        await page.waitForNavigation();
        expect(page.url()).toBe('http://127.0.0.1:5500/source/pages/main.html');
    });

    it('Should be redirected to main instantly', async () => {
        page.goto('http://127.0.0.1:5500/source/pages/new-user.html');
        expect(page.url()).toBe('http://127.0.0.1:5500/source/pages/main.html');
    });
});