describe('New User', () => {
    beforeAll(async () => {
        await page.goto('http://127.0.0.1:5500/source/pages/new-user.html');
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
    }, 1000);
});