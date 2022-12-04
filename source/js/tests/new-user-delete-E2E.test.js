const puppeteer = require('puppeteer');
var browser, page;
const newUserUrl = 'https://cse110-fa22-group20.github.io/cse110-fa22-group20/pages/new-user.html';
const mainUrl = 'https://cse110-fa22-group20.github.io/cse110-fa22-group20/pages/main.html';
describe('New User/Delete Posts', () => {
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
        expect(page.url()).toBe(newUserUrl);
        await page.type('#user-name', "BOT", {delay: 100});
        await page.type('#user-description', "Description", {delay: 100});
        const imageHandle = await page.$('#user-image');
        await imageHandle.uploadFile('./source/assets/placeholder-profile-pic.png');
        await page.waitForTimeout(1500);
        const submit = await page.$('#go-button');
        await submit.click();
        await page.waitForTimeout(1500);
        expect(page.url()).toBe(mainUrl);
    });

    //Checking that our only page options are edit and add upon page load
    it('Check that edit/add buttons are there', async ()=>{
        expect(await page.$('#edit-button')).not.toBe(null);
        expect(await page.$('#add-button')).not.toBe(null);
    });

    //Checking that delete/save is not an option yet when posts exist, as edit mode is not toggled
    it('Check that delete/save button is not there yet', async ()=>{
        //Simulating dummy text post to delete
        const addButton = await page.$('#add-button');
        await addButton.click();
        const addTextPostButton = await page.$('#add-text-post');
        await addTextPostButton.click();
        await page.type('#text-post-textarea', 'Dummy text post');
        let submit = await page.$('#post-text');
        await submit.click();

        //checking for visibility of delete button
        let deleteIsVisible = await page.evaluate(() => {
            const deleteButton = document.querySelector('.delete-icon-container');
            if (!deleteButton)
               return false;
            const style = window.getComputedStyle(deleteButton);
            return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';    
        });

        //checking for visibility of save button
        let saveIsVisible = await page.evaluate(() => {
            const saveButton = document.querySelector('#save-button');
            if (!saveButton)
               return false;
            const style = window.getComputedStyle(saveButton);
            return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        });

        //should not exist or be visible yet
        expect(deleteIsVisible).toBe(false);
        expect(saveIsVisible).toBe(false);
    });

    //Checking that delete/save become options when in edit mode
    it('Check that delete/save button is there when edit mode is toggled', async ()=>{
        //Simulating dummy text post to delete
        const editButton = await page.$('#edit-button');
        await editButton.click();

        let deleteIsVisible = await page.evaluate(() => {
            const deleteButton = document.querySelector('.delete-icon-container');
            if (!deleteButton)
               return false;
            const style = window.getComputedStyle(deleteButton);
            return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        });

        let saveIsVisible = await page.evaluate(() => {
            const saveButton = document.querySelector('#save-button');
            if (!saveButton)
               return false;
            const style = window.getComputedStyle(saveButton);
            return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        });

        //should both exist and be visible
        expect(deleteIsVisible).toBe(true);
        expect(saveIsVisible).toBe(true);
    });

    //After saving, edit mode should end and delete/save options should be gone
    it('Check that delete/save button is not there when save is clicked', async ()=>{
        //clicks save button to end edit mode
        let saveButton = await page.$('#save-button');
        await saveButton.click();

        let deleteIsVisible = await page.evaluate(() => {
            const deleteButton = document.querySelector('.delete-icon-container');
            if (!deleteButton)
               return false;
            const style = window.getComputedStyle(deleteButton);
            return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';    
        });

        let saveIsVisible = await page.evaluate(() => {
            saveButton = document.querySelector('#save-button');
            if (!saveButton)
               return false;
            const style = window.getComputedStyle(saveButton);
            return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        });

        //should not exist or be visible anymore
        expect(deleteIsVisible).toBe(false);
        expect(saveIsVisible).toBe(false);
    });

});