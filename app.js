/* ============================================================
   devfinder — app.js
   ============================================================ */

// ---- DOM refs ----
const themeToggle = document.getElementById("themeToggle");
const toggleLabel = document.getElementById("toggleLabel");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const errorMsg = document.getElementById("errorMsg");
const profileCard = document.getElementById("profileCard");

// Profile fields
const avatar = document.getElementById("avatar");
const displayName = document.getElementById("displayName");
const joinDate = document.getElementById("joinDate");
const username = document.getElementById("username");
const bio = document.getElementById("bio");
const repoCount = document.getElementById("repoCount");
const followersCount = document.getElementById("followersCount");
const followingCount = document.getElementById("followingCount");

// Info items
const infoLocation = document.getElementById("infoLocation");
const locationText = document.getElementById("locationText");
const infoTwitter = document.getElementById("infoTwitter");
const twitterLink = document.getElementById("twitterLink");
const infoBlog = document.getElementById("infoBlog");
const blogLink = document.getElementById("blogLink");
const infoCompany = document.getElementById("infoCompany");
const companyText = document.getElementById("companyText");

// ============================================================
// Theme
// ============================================================

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("devfinder-theme", theme);
  toggleLabel.textContent = theme === "dark" ? "LIGHT" : "DARK";
}

function initTheme() {
  const saved = localStorage.getItem("devfinder-theme");
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  applyTheme(saved || preferred);
}

themeToggle.addEventListener("click", () => {
  const current = document.body.dataset.theme;
  applyTheme(current === "dark" ? "light" : "dark");
});

// ============================================================
// Search
// ============================================================

function showError() {
  errorMsg.hidden = false;
}

function clearError() {
  errorMsg.hidden = true;
}

async function searchUser(query) {
  if (!query) return;

  clearError();

  try {
    const res = await fetch(`https://api.github.com/users/${query}`);
    if (!res.ok) {
      showError();
      return;
    }
    const data = await res.json();
    renderProfile(data);
  } catch {
    showError();
  }
}

searchBtn.addEventListener("click", () => {
  searchUser(searchInput.value.trim());
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchUser(searchInput.value.trim());
  }
});

// ============================================================
// Render
// ============================================================

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(iso) {
  const d = new Date(iso);
  return `Joined ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function setInfoItem(itemEl, textEl, value, isLink = false) {
  const isEmpty = !value || value.trim() === "";

  if (isEmpty) {
    itemEl.classList.add("unavailable");
    if (isLink) {
      textEl.textContent = "Not available";
      textEl.removeAttribute("href");
    } else {
      textEl.textContent = "Not available";
    }
  } else {
    itemEl.classList.remove("unavailable");
    if (isLink) {
      let href = value.trim();
      if (!/^https?:\/\//i.test(href)) {
        href = "https://" + href;
      }
      textEl.textContent = value.trim();
      textEl.href = href;
    } else {
      textEl.textContent = value.trim();
    }
  }
}

function renderProfile(data) {
  // Avatar
  avatar.src = data.avatar_url;
  avatar.alt = `${data.login}'s avatar`;

  // Name — fall back to login if no display name
  displayName.textContent = data.name || data.login;

  // Join date
  joinDate.textContent = formatDate(data.created_at);

  // @username link
  username.textContent = `@${data.login}`;
  username.href = data.html_url;

  // Bio
  if (data.bio) {
    bio.textContent = data.bio;
    bio.classList.remove("no-bio");
  } else {
    bio.textContent = "This profile has no bio.";
    bio.classList.add("no-bio");
  }

  // Stats
  repoCount.textContent = data.public_repos ?? 0;
  followersCount.textContent = data.followers ?? 0;
  followingCount.textContent = data.following ?? 0;

  // Info items
  setInfoItem(infoLocation, locationText, data.location);

  // Twitter needs special href/label formatting
  if (data.twitter_username) {
    infoTwitter.classList.remove("unavailable");
    twitterLink.textContent = `@${data.twitter_username}`;
    twitterLink.href = `https://x.com/${data.twitter_username}`;
  } else {
    infoTwitter.classList.add("unavailable");
    twitterLink.textContent = "Not available";
    twitterLink.removeAttribute("href");
  }

  setInfoItem(infoBlog, blogLink, data.blog, true);
  setInfoItem(infoCompany, companyText, data.company);

  profileCard.hidden = false;
}

// ============================================================
// Init
// ============================================================

initTheme();
searchUser("octocat");
