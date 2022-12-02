const postDOM = document.querySelectorAll(".content");
for(const post of postDOM) {
    if(post.parentNode.classList.contains("image-post")) {
        post.onclick = async () => {
            if(state.editMode) await propogateImagePopup(post.parentNode);
        }
    }
}