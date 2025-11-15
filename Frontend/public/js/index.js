//hamburger
function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("active");
}

//like-unlike
function like(element) {
    let parent = element.closest(".like-comment");
    let before = parent.querySelector(".fa-before");
    let after = parent.querySelector(".fa-after");

    before.style.display = "none";
    after.style.display = "inline";
}

function unlike(element) {
    let parent = element.closest(".like-comment");
    let before = parent.querySelector(".fa-before");
    let after = parent.querySelector(".fa-after");

    after.style.display = "none";
    before.style.display = "inline";
}

//delete 
function openModal(postId) {
  document.getElementById(`delete-modal-${postId}`).classList.remove('hidden');
}

function closeModal(postId) {
  document.getElementById(`delete-modal-${postId}`).classList.add('hidden');
}



