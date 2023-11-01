const modeToggle = document.getElementById("toggle-switch");
const body = document.body;
const modeText = document.querySelector('.toggle-text span');
const form = document.querySelector("form");
const profileBox = document.querySelector(".profile-box");

let isDarkMode = false;
let lastUserData = null;

// Function to set the dark mode
function setDarkMode() {
    isDarkMode = true;
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    modeText.textContent = "";
    const sunIcon = document.createElement("img");
    sunIcon.src = "./assets/icon-sun.svg";
    modeToggle.innerHTML = "LIGHT";
    modeToggle.appendChild(sunIcon);
    localStorage.setItem("mode", "dark");
}

// Function to set the light mode
function setLightMode() {
    isDarkMode = false;
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    modeText.textContent = "";
    const moonIcon = document.createElement("img");
    moonIcon.src = "./assets/icon-moon.svg";
    modeToggle.innerHTML = "DARK";
    modeToggle.appendChild(moonIcon);
    localStorage.setItem("mode", "light");
}

// Function to load the user's mode preference from local storage
function loadModeFromLocalStorage() {
    const mode = localStorage.getItem("mode");
    if (mode === "dark") {
        setDarkMode();
    } else {
        setLightMode();
    }
}

loadModeFromLocalStorage();


function toggleMode() {
    if (isDarkMode) {
        setLightMode();
    } else {
        setDarkMode();
    }
    updateProfileWithMode();
}


function updateProfileWithMode() {
    renderUserProfile(lastUserData);
}

modeToggle.addEventListener("click", toggleMode);

function saveUserDataToLocalStorage(userData) {
    localStorage.setItem("lastUserData", JSON.stringify(userData));
}

function loadUserDataFromLocalStorage() {
    const userData = localStorage.getItem("lastUserData");
    return userData ? JSON.parse(userData) : null;
}

function fetchDefaultProfile() {
    const userData = loadUserDataFromLocalStorage();
    if (userData) {
        lastUserData = userData;
        renderUserProfile(userData);
    } else {
        fetch("https://api.github.com/users/octocat")
            .then((response) => response.json())
            .then((userData) => {
                saveUserDataToLocalStorage(userData);
                lastUserData = userData;
                renderUserProfile(userData);
            })
            .catch((error) => {
                console.error("Error fetching default profile:", error);
            });
    }
}

window.addEventListener("load", fetchDefaultProfile);

function renderUserProfile(userData) {
    saveUserDataToLocalStorage(userData); 
    lastUserData = userData;

    const profileImage = userData.avatar_url;
    const displayName = userData.name || userData.login;
    const username = `@${userData.login}`;
    const joinedDate = new Date(userData.created_at).toDateString();
    const bio = userData.bio || "No bio available";
    const repos = userData.public_repos;
    const followers = userData.followers;
    const following = userData.following;

    const locationLink = userData.location
    ? `<a href="https://www.google.com/maps/place/${encodeURI(userData.location)}" target="_blank" class="profile-links">${userData.location}</a>`
    : "Not Available";

const websiteLink = userData.blog
    ? `<a href="${userData.blog}" target="_blank" class="profile-links">${userData.blog}</a>`
    : "Not Available";

const twitterLink = userData.twitter_username
    ? `<a href="https://twitter.com/${userData.twitter_username}" target="_blank" class="profile-links">${userData.twitter_username}</a>`
    : "Not Available";

    const companyLink = userData.company
    ? `<a href="https://www.google.com/search?q=${encodeURIComponent(userData.company)}" target="_blank" class="profile-links">${userData.company}</a>`
    : "Not Available";

    const locationIcon = isDarkMode
        ? "./assets/icon-location-white.svg"
        : "./assets/icon-location.svg";
    const websiteIcon = isDarkMode
        ? "./assets/icon-website-white.svg"
        : "./assets/icon-website.svg";
    const twitterIcon = isDarkMode
        ? "./assets/icon-twitter-white.svg"
        : "./assets/icon-twitter.svg";
    const companyIcon = isDarkMode
        ? "./assets/icon-company-white.svg"
        : "./assets/icon-company.svg";

    const profileHTML = `
    <div class="profile-basic">
        <div class="profile-image">
            <img class="profile-photo" src="${profileImage}" alt="Profile Photo">
        </div>
        <div class="profile-info">
            <h3 class="profile-info-display-name">${displayName}</h3>
            <h6 class="profile-info-username">${username}</h6>
            <h6 class="profile-info-date">Joined ${joinedDate}</h6>
        </div>
    </div>

    <div class="profile-bio">
        <p>${bio}</p>
    </div>

    <div class="stats-box">
        <div><span style="font-size: 11px; font-weight: 400;">Repos</span><br><span style="font-size: 16px; font-weight: 700;">${repos}</span></div>
        <div><span style="font-size: 11px; font-weight: 400;">Followers</span><br><span style="font-size: 16px; font-weight: 700;">${followers}</span></div>
        <div><span style="font-size: 11px; font-weight: 400;">Following</span><br><span style="font-size: 16px; font-weight: 700;">${following}</span></div>
    </div>

    <div class="profile-links">
        <div class="profile-link">
            <div class="profile-link-icon">
                <img src="${locationIcon}">
            </div>
            ${locationLink}
        </div>
        <div class="profile-link">
            <div class="profile-link-icon">
                <img src="${websiteIcon}">
            </div>
            ${websiteLink}
        </div>
        <div class="profile-link">
            <div class="profile-link-icon">
                <img src="${twitterIcon}">
            </div>
            ${twitterLink}
        </div>
        <div class="profile-link">
            <div class="profile-link-icon">
                <img src="${companyIcon}">
            </div>
            ${companyLink}
        </div>
    </div>
    `;
    
    profileBox.innerHTML = profileHTML;
}

function handleSubmit(e) {
    e.preventDefault();

    const username = document.querySelector(".search-input").value.trim();
    const searchInput = document.querySelector(".search-input");
    const userNotFoundMessage = document.querySelector(".user-not-found-message"); 

    fetch(`https://api.github.com/users/${username}`)
        .then((r) => r.json())
        .then((userData) => {
            if (userData.message === "Not Found") {
                searchInput.value = "";
                userNotFoundMessage.textContent = "No such user"; 
                userNotFoundMessage.classList.add("user-not-found"); 
            } else {
                searchInput.placeholder = "Search GitHub username...";
                userNotFoundMessage.textContent = "";
                userNotFoundMessage.classList.remove("user-not-found"); 
                saveUserDataToLocalStorage(userData);
                lastUserData = userData;
                renderUserProfile(userData);
            }
        });
}

form.addEventListener("submit", handleSubmit);

