import { checkUserExist, checkProfile, updateImage, getFormData } from './new-user.js';

// just a dummy test
test("Dummy test", () => {
    expect(checkUserExist()).toBe(true);
});