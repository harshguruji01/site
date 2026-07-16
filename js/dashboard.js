// js/dashboard.js
import { initAuthObserver, logoutUser } from './auth.js';
import { getUserProfile } from './database.js';
import { renderSidebar, renderHeader, initSidebarLogic } from './components.js';

// Configuration
const PAGE_ID = document.body.dataset.pageId || 'dashboard';

// Initialize Layout
function initLayout() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const sidebarHTML = renderSidebar(PAGE_ID);
  const headerHTML = renderHeader();
  
  // Inject into DOM (Assuming the container has a specific structure)
  // We will expect the HTML to just have an empty <div id="app"></div> 
  // or we inject before main content
  appContainer.insertAdjacentHTML('afterbegin', sidebarHTML);
  
  const mainWrapper = document.createElement('div');
  mainWrapper.className = 'main-wrapper';
  mainWrapper.innerHTML = headerHTML;
  
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainWrapper.appendChild(mainContent);
  }
  
  appContainer.appendChild(mainWrapper);
  
  initSidebarLogic();
  
  // Setup Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await logoutUser();
    });
  }
}

// Populate User Data
async function populateUserData(user) {
  try {
    const profile = await getUserProfile(user.uid);
    if (!profile) return;

    // Update Header Avatar and Dropdown
    const avatar = document.getElementById('headerAvatar');
    const dropName = document.getElementById('dropdownName');
    const dropEmail = document.getElementById('dropdownEmail');
    
    if (avatar) {
      if (profile.photoURL) {
        avatar.style.backgroundImage = `url(${profile.photoURL})`;
        avatar.textContent = '';
      } else {
        avatar.textContent = (profile.displayName || profile.email).charAt(0).toUpperCase();
      }
    }
    if (dropName) dropName.textContent = profile.displayName || profile.username;
    if (dropEmail) dropEmail.textContent = profile.email;

    // Dispatch event so individual pages can update their specific UI
    const event = new CustomEvent('userDataLoaded', { detail: profile });
    document.dispatchEvent(event);

  } catch (error) {
    console.error("Error loading user data:", error);
  }
}

// Initialize Auth
initAuthObserver(async (user) => {
  initLayout();
  await populateUserData(user);
});
