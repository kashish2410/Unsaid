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

async function loginUser(event) {
    event.preventDefault(); // stop form from refreshing

    const email = document.getElementById("email").value;
    const password = document.getElementById("pass").value;

    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.success) {
        alert(data.message);
        return;
    }

    // Store session token info (if needed)
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);

    // ⭐ redirect to myPosts
    window.location.href = "/unsaid/myPosts";
}

async function signupUser() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    alert(data.message);
}
