/**
 * @jest-environment jsdom
 */
//require("fake-indexeddb/auto");
const main =  require('../main');

test("'populatePosts' zero posts.", () => {
    const state = {
        postIDCounter: 0,
        posts: [],
    };

    const postContainer = document.createElement('section');
    postContainer.setAttribute('id', '#posts-wrapper');
    const typeSelector = document.createElement('div');
    typeSelector.setAttribute('id', 'post-type-selector');
    typeSelector.setAttribute('class', 'hidden');
    postContainer.appendChild(typeSelector);
    document.body.innerHTML = '<div id="root"></div>'
    document.querySelector('#root').appendChild(postContainer);

    main.populatePosts(state);
    expect(postContainer.childElementCount).toBe(1);
});

