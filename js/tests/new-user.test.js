import { checkUserExist, checkProfile, getDetails, parseFormData } from './db.js';

// just a dummy test
test("Dummy test", () => {
    expect(checkUserExist()).toBe(true);
});