/**
 * HarshGuruJi Private Chat System
 * Production-ready one-to-one real-time messaging with Supabase
 */
import { supabase } from './supabase.js';

// Global state
const ChatState = {
  currentUser: null,
  currentProfile: null,
  activeConversation: null,
  activePartner: null,
  conversations: [],
  messages: [],
  onlineUserIds: new Set(),
  blockedUsers: new Set(),     // IDs that current user has blocked
  blockedByUsers: new Set(),   // IDs that have blocked current user
  realtimeChannel: null,
  presenceChannel: null,
  searchDebounceTimer: null,
  selectedMsgForDelete: null
};

// DOM Elements cache
const DOM = {};

document.addEventListener('DOMContentLoaded', async () => {
  cacheDOMElements();
  bindEventHandlers();
  await initChat();
});

function cacheDOMElements() {
  DOM.container = document.getElementById('chat-app-container');
  DOM.sidebar = document.getElementById('chat-sidebar');
  DOM.main = document.getElementById('chat-main');
  
  // Current user info
  DOM.myAvatar = document.getElementById('my-avatar');
  DOM.myDisplayName = document.getElementById('my-display-name');
  DOM.myUsername = document.getElementById('my-username');
  DOM.myHgjId = document.getElementById('my-hgj-id');
  DOM.myGoldenTick = document.getElementById('my-golden-tick');
  DOM.copyMyIdBtn = document.getElementById('copy-my-id-btn');

  // Search
  DOM.searchInput = document.getElementById('chat-search-input');
  DOM.searchClearBtn = document.getElementById('search-clear-btn');
  DOM.searchSpinner = document.getElementById('search-spinner');
  DOM.searchDropdown = document.getElementById('chat-search-dropdown');
  DOM.searchDropdownList = document.getElementById('search-dropdown-list');

  // Conversations
  DOM.conversationsCount = document.getElementById('conversations-count');
  DOM.conversationsSkeleton = document.getElementById('conversations-skeleton');
  DOM.conversationsEmpty = document.getElementById('conversations-empty');
  DOM.conversationsList = document.getElementById('conversations-list');

  // Active Chat Screen
  DOM.noActiveView = document.getElementById('chat-no-active');
  DOM.activeScreen = document.getElementById('chat-active-screen');
  DOM.chatBackBtn = document.getElementById('chat-back-btn');
  DOM.activeAvatar = document.getElementById('active-user-avatar');
  DOM.activeOnlineDot = document.getElementById('active-online-dot');
  DOM.activeName = document.getElementById('active-user-name');
  DOM.activeGoldenTick = document.getElementById('active-golden-tick');
  DOM.activeHandle = document.getElementById('active-user-handle');
  DOM.activeStatus = document.getElementById('active-user-status');
  DOM.headerMenuBtn = document.getElementById('header-menu-btn');
  DOM.headerDropdownMenu = document.getElementById('header-dropdown-menu');

  // Messages & Composer
  DOM.messagesContainer = document.getElementById('chat-messages-container');
  DOM.messagesList = document.getElementById('messages-list');
  DOM.blockedBanner = document.getElementById('chat-blocked-banner');
  DOM.blockedBannerText = document.getElementById('blocked-banner-text');
  DOM.unblockBannerBtn = document.getElementById('unblock-banner-btn');
  DOM.composerWrap = document.getElementById('chat-composer-wrap');
  DOM.composerForm = document.getElementById('chat-composer-form');
  DOM.composerInput = document.getElementById('chat-message-input');
  DOM.composerSendBtn = document.getElementById('composer-send-btn');
  DOM.emptySearchFocusBtn = document.getElementById('empty-search-focus-btn');

  // Modals & Menu Items
  DOM.menuViewProfile = document.getElementById('menu-view-profile');
  DOM.menuDeleteConv = document.getElementById('menu-delete-conv');
  DOM.menuBlockUser = document.getElementById('menu-block-user');
  DOM.modalOverlay = document.getElementById('chat-modal-overlay');
  DOM.toastContainer = document.getElementById('chat-toast-container');
}

function bindEventHandlers() {
  // Copy ID
  DOM.copyMyIdBtn?.addEventListener('click', handleCopyId);

  // Search input events
  DOM.searchInput?.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) {
      DOM.searchClearBtn.style.display = 'block';
    } else {
      DOM.searchClearBtn.style.display = 'none';
      hideSearchDropdown();
    }
    clearTimeout(ChatState.searchDebounceTimer);
    ChatState.searchDebounceTimer = setTimeout(() => handleSearch(val), 250);
  });

  DOM.searchClearBtn?.addEventListener('click', () => {
    DOM.searchInput.value = '';
    DOM.searchClearBtn.style.display = 'none';
    hideSearchDropdown();
    DOM.searchInput.focus();
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!DOM.searchDropdown?.contains(e.target) && e.target !== DOM.searchInput) {
      hideSearchDropdown();
    }
    if (!DOM.headerDropdownMenu?.contains(e.target) && !DOM.headerMenuBtn?.contains(e.target)) {
      DOM.headerDropdownMenu.style.display = 'none';
    }
  });

  // Mobile Back button
  DOM.chatBackBtn?.addEventListener('click', () => {
    DOM.container.classList.remove('mobile-chat-open');
  });

  // Empty state find friends button
  DOM.emptySearchFocusBtn?.addEventListener('click', () => {
    DOM.searchInput.focus();
  });

  // Composer auto-resize and Enter to send
  DOM.composerInput?.addEventListener('input', () => {
    DOM.composerInput.style.height = 'auto';
    DOM.composerInput.style.height = Math.min(DOM.composerInput.scrollHeight, 120) + 'px';
    const hasText = DOM.composerInput.value.trim().length > 0;
    DOM.composerSendBtn.disabled = !hasText;
  });

  DOM.composerInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!DOM.composerSendBtn.disabled) {
        handleSendMessage();
      }
    }
  });

  DOM.composerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSendMessage();
  });

  // Chat options menu toggle
  DOM.headerMenuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = DOM.headerDropdownMenu.style.display === 'block';
    DOM.headerDropdownMenu.style.display = isVisible ? 'none' : 'block';
  });

  // Menu Options
  DOM.menuViewProfile?.addEventListener('click', () => {
    DOM.headerDropdownMenu.style.display = 'none';
    showProfileModal(ChatState.activePartner);
  });

  DOM.menuDeleteConv?.addEventListener('click', () => {
    DOM.headerDropdownMenu.style.display = 'none';
    confirmDeleteConversation();
  });

  DOM.menuBlockUser?.addEventListener('click', () => {
    DOM.headerDropdownMenu.style.display = 'none';
    confirmBlockUser();
  });

  DOM.unblockBannerBtn?.addEventListener('click', () => {
    if (ChatState.activePartner) {
      unblockUser(ChatState.activePartner.id);
    }
  });
}

/**
 * Initialize Chat Application
 */
async function initChat() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (!session || !session.user) {
      showLoginRequiredModal();
      return;
    }

    ChatState.currentUser = session.user;
    
    // Load and ensure user profile with HGJ ID
    await loadOrCreateProfile(session.user);
    
    // Setup Realtime & Presence
    setupPresence();
    setupGlobalMessageListener();

    // Load initial data
    await Promise.all([
      loadBlocks(),
      loadConversations()
    ]);

    // Check URL parameters for direct chat initiation (?u=userId or ?hgj=HGJ-XXXXXX)
    handleUrlParameters();

  } catch (err) {
    console.error("Chat init error:", err);
    showToast("Connection issue. Please refresh.", "⚠️");
  }
}

/**
 * Load or initialize current user profile
 */
async function loadOrCreateProfile(user) {
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // If hgj_id missing, generate one
  if (!profile || !profile.hgj_id) {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newHgjId = `HGJ-${randomHex}`;
    const baseUsername = profile?.username || (user.email ? user.email.split('@')[0] : 'user');

    const updatePayload = {
      id: user.id,
      hgj_id: profile?.hgj_id || newHgjId,
      username: profile?.username || baseUsername,
      display_name: profile?.display_name || user.user_metadata?.full_name || baseUsername,
      avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || null,
      updated_at: new Date().toISOString()
    };

    const { data: updated } = await supabase
      .from('profiles')
      .upsert(updatePayload)
      .select()
      .maybeSingle();

    profile = updated || updatePayload;
  }

  ChatState.currentProfile = profile;

  // Render current user in UI
  const displayName = profile.display_name || (user.email ? user.email.split('@')[0] : 'User');
  const avatarUrl = profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  DOM.myDisplayName.textContent = displayName;
  DOM.myUsername.textContent = `@${profile.username || 'user'}`;
  DOM.myHgjId.textContent = profile.hgj_id || 'HGJ-USER';
  DOM.myAvatar.src = avatarUrl;
  
  if (profile.golden_tick) {
    DOM.myGoldenTick.style.display = 'inline-flex';
  }
}

/**
 * Setup Supabase Presence for live online indicator
 */
function setupPresence() {
  if (!ChatState.currentUser) return;

  const channel = supabase.channel('hg_chat_presence', {
    config: { presence: { key: ChatState.currentUser.id } }
  });

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      ChatState.onlineUserIds = new Set(Object.keys(state));
      updateOnlineStatusIndicators();
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: ChatState.currentUser.id,
          online_at: new Date().toISOString()
        });
      }
    });

  ChatState.presenceChannel = channel;
}

/**
 * Listen for new incoming messages globally
 */
function setupGlobalMessageListener() {
  if (!ChatState.currentUser) return;

  const channel = supabase
    .channel('global_chat_messages')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `receiver_id=eq.${ChatState.currentUser.id}`
    }, async (payload) => {
      const newMsg = payload.new;
      handleIncomingMessage(newMsg);
    })
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'messages'
    }, (payload) => {
      const updatedMsg = payload.new;
      handleMessageUpdated(updatedMsg);
    })
    .subscribe();

  ChatState.realtimeChannel = channel;
}

/**
 * Handle new incoming message in real time
 */
async function handleIncomingMessage(msg) {
  // If this message belongs to the currently active conversation
  if (ChatState.activeConversation && ChatState.activeConversation.id === msg.conversation_id) {
    // Append to messages list
    ChatState.messages.push(msg);
    renderSingleMessage(msg);
    scrollToBottom();

    // Mark as seen immediately since conversation is open
    await markMessagesAsSeen(msg.conversation_id);
  } else {
    // Show toast alert
    showToast(`New message received`, "💬");
  }

  // Refresh conversation list to update preview and unread badge
  await loadConversations();
}

/**
 * Handle updated message (e.g. status changed to seen or deleted)
 */
function handleMessageUpdated(updatedMsg) {
  // If in active conversation
  if (ChatState.activeConversation && ChatState.activeConversation.id === updatedMsg.conversation_id) {
    const idx = ChatState.messages.findIndex(m => m.id === updatedMsg.id);
    if (idx !== -1) {
      ChatState.messages[idx] = updatedMsg;
      updateMessageElement(updatedMsg);
    }
  }
}

/**
 * Copy user's HarshGuruJi ID
 */
function handleCopyId() {
  const hgjId = ChatState.currentProfile?.hgj_id;
  if (!hgjId) return;

  navigator.clipboard.writeText(hgjId).then(() => {
    showToast(`HarshGuruJi ID copied: ${hgjId}`, "📋");
    const chip = DOM.copyMyIdBtn;
    if (chip) {
      chip.classList.add('copied');
      setTimeout(() => chip.classList.remove('copied'), 1500);
    }
  }).catch(() => {
    showToast(`ID: ${hgjId}`, "📋");
  });
}

/**
 * Search users by username (with/without @) or HarshGuruJi ID
 */
async function handleSearch(query) {
  if (!query) {
    hideSearchDropdown();
    return;
  }

  DOM.searchSpinner.style.display = 'block';
  const clean = query.replace(/^@/, '').trim().toLowerCase();

  try {
    const { data: results, error } = await supabase
      .from('profiles')
      .select('id, display_name, username, hgj_id, avatar_url, golden_tick')
      .neq('id', ChatState.currentUser.id)
      .or(`username.ilike.%${clean}%,hgj_id.ilike.%${clean}%,display_name.ilike.%${clean}%`)
      .limit(10);

    DOM.searchSpinner.style.display = 'none';

    if (error) {
      console.warn("Search error:", error);
      return;
    }

    // Sort by priority ranking
    const sorted = (results || []).sort((a, b) => {
      const uA = (a.username || '').toLowerCase();
      const uB = (b.username || '').toLowerCase();
      const idA = (a.hgj_id || '').toLowerCase();
      const idB = (b.hgj_id || '').toLowerCase();

      // 1. Exact username
      if (uA === clean && uB !== clean) return -1;
      if (uB === clean && uA !== clean) return 1;

      // 2. Starts with username
      if (uA.startsWith(clean) && !uB.startsWith(clean)) return -1;
      if (uB.startsWith(clean) && !uA.startsWith(clean)) return 1;

      // 3. ID match
      if (idA.includes(clean) && !idB.includes(clean)) return -1;
      if (idB.includes(clean) && !idA.includes(clean)) return 1;

      return 0;
    });

    renderSearchResults(sorted, query);

  } catch (err) {
    DOM.searchSpinner.style.display = 'none';
    console.error("Search exception:", err);
  }
}

/**
 * Render Live Search Results Dropdown
 */
function renderSearchResults(users, query) {
  DOM.searchDropdownList.innerHTML = '';

  if (users.length === 0) {
    DOM.searchDropdownList.innerHTML = `
      <div class="search-no-results">
        <h5>No users found</h5>
        <p>Try searching with another username or HarshGuruJi ID.</p>
      </div>
    `;
    DOM.searchDropdown.style.display = 'block';
    return;
  }

  users.forEach(user => {
    const item = document.createElement('div');
    item.className = 'search-result-item';
    const isOnline = ChatState.onlineUserIds.has(user.id);
    const displayName = user.display_name || user.username || 'User';
    const avatar = user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

    item.innerHTML = `
      <div class="search-user-info-block">
        <div class="search-user-avatar-wrap">
          <img src="${avatar}" alt="${escapeHtml(displayName)}" />
        </div>
        <div class="search-user-details">
          <div class="search-user-name-line">
            <span>${escapeHtml(displayName)}</span>
            ${user.golden_tick ? `<span class="golden-tick-badge">✓</span>` : ''}
          </div>
          <div class="search-user-sub-line">
            <span>@${escapeHtml(user.username || 'user')}</span>
            <span class="id-separator">•</span>
            <span class="hgj-tag">${escapeHtml(user.hgj_id || '')}</span>
          </div>
        </div>
      </div>
      <button type="button" class="search-msg-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        Message
      </button>
    `;

    item.addEventListener('click', () => {
      hideSearchDropdown();
      DOM.searchInput.value = '';
      DOM.searchClearBtn.style.display = 'none';
      startOrOpenConversation(user);
    });

    DOM.searchDropdownList.appendChild(item);
  });

  DOM.searchDropdown.style.display = 'block';
}

function hideSearchDropdown() {
  if (DOM.searchDropdown) {
    DOM.searchDropdown.style.display = 'none';
  }
}

/**
 * Load all user conversations
 */
async function loadConversations() {
  if (!ChatState.currentUser) return;

  try {
    const currentId = ChatState.currentUser.id;

    const { data: convs, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`participant_one.eq.${currentId},participant_two.eq.${currentId}`)
      .order('last_message_at', { ascending: false });

    DOM.conversationsSkeleton.style.display = 'none';

    if (error) {
      console.warn("Error loading conversations:", error);
      return;
    }

    if (!convs || convs.length === 0) {
      DOM.conversationsEmpty.style.display = 'block';
      DOM.conversationsList.innerHTML = '';
      DOM.conversationsCount.textContent = '0';
      return;
    }

    DOM.conversationsEmpty.style.display = 'none';
    DOM.conversationsCount.textContent = convs.length;

    // Collect all partner IDs
    const partnerIds = convs.map(c => c.participant_one === currentId ? c.participant_two : c.participant_one);

    // Batch fetch partner profiles
    const { data: partnerProfiles } = await supabase
      .from('profiles')
      .select('id, display_name, username, hgj_id, avatar_url, golden_tick')
      .in('id', partnerIds);

    const profileMap = new Map((partnerProfiles || []).map(p => [p.id, p]));

    // Batch fetch unread message counts for each conversation
    const { data: unreadRows } = await supabase
      .from('messages')
      .select('conversation_id')
      .eq('receiver_id', currentId)
      .neq('status', 'seen')
      .in('conversation_id', convs.map(c => c.id));

    const unreadMap = new Map();
    (unreadRows || []).forEach(r => {
      unreadMap.set(r.conversation_id, (unreadMap.get(r.conversation_id) || 0) + 1);
    });

    // Render list
    ChatState.conversations = convs.map(c => {
      const partnerId = c.participant_one === currentId ? c.participant_two : c.participant_one;
      return {
        ...c,
        partner: profileMap.get(partnerId) || { id: partnerId, display_name: 'User', username: 'user' },
        unreadCount: unreadMap.get(c.id) || 0
      };
    });

    renderConversationsList();

  } catch (err) {
    console.error("loadConversations exception:", err);
  }
}

/**
 * Render the conversations list in the sidebar
 */
function renderConversationsList() {
  DOM.conversationsList.innerHTML = '';

  ChatState.conversations.forEach(c => {
    const partner = c.partner;
    const isOnline = ChatState.onlineUserIds.has(partner.id);
    const isActive = ChatState.activeConversation && ChatState.activeConversation.id === c.id;
    const displayName = partner.display_name || partner.username || 'User';
    const avatar = partner.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
    const preview = c.last_message ? escapeHtml(c.last_message) : 'No messages yet';
    const timeStr = c.last_message_at ? formatTime(c.last_message_at) : '';

    const el = document.createElement('div');
    el.className = `conversation-item ${isActive ? 'active' : ''}`;
    el.dataset.id = c.id;

    el.innerHTML = `
      <div class="conv-avatar-wrap">
        <img src="${avatar}" alt="${escapeHtml(displayName)}" />
        <span class="conv-online-dot ${isOnline ? 'is-online' : ''}" data-partner-id="${partner.id}"></span>
      </div>
      <div class="conv-content">
        <div class="conv-row-top">
          <div class="conv-name-block">
            <span class="conv-name">${escapeHtml(displayName)}</span>
            ${partner.golden_tick ? `<span class="golden-tick-badge">✓</span>` : ''}
          </div>
          <span class="conv-time">${timeStr}</span>
        </div>
        <div class="conv-row-bottom">
          <span class="conv-preview">${preview}</span>
          ${c.unreadCount > 0 ? `<span class="conv-unread-badge">${c.unreadCount}</span>` : ''}
        </div>
      </div>
    `;

    el.addEventListener('click', () => {
      openConversation(c, partner);
    });

    DOM.conversationsList.appendChild(el);
  });
}

/**
 * Start or open existing conversation between current user and partner
 */
async function startOrOpenConversation(partnerUser) {
  if (!ChatState.currentUser || !partnerUser) return;

  const currentId = ChatState.currentUser.id;
  const p1 = currentId < partnerUser.id ? currentId : partnerUser.id;
  const p2 = currentId < partnerUser.id ? partnerUser.id : currentId;

  try {
    // Check if conversation already exists
    let { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .eq('participant_one', p1)
      .eq('participant_two', p2)
      .maybeSingle();

    if (!existing) {
      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          participant_one: p1,
          participant_two: p2,
          last_message: null,
          last_message_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      existing = newConv;
    }

    const convObj = {
      ...existing,
      partner: partnerUser,
      unreadCount: 0
    };

    // Open conversation immediately
    await openConversation(convObj, partnerUser);
    await loadConversations();

  } catch (err) {
    console.error("startOrOpenConversation error:", err);
    showToast("Could not start conversation.", "⚠️");
  }
}

/**
 * Open Conversation View
 */
async function openConversation(conv, partner) {
  ChatState.activeConversation = conv;
  ChatState.activePartner = partner;

  // Highlight active conversation in sidebar
  document.querySelectorAll('.conversation-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === conv.id);
  });

  // Switch right panel view
  DOM.noActiveView.style.display = 'none';
  DOM.activeScreen.style.display = 'flex';

  // Mobile layout switch
  DOM.container.classList.add('mobile-chat-open');

  // Update Header UI
  const displayName = partner.display_name || partner.username || 'User';
  const avatar = partner.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
  const isOnline = ChatState.onlineUserIds.has(partner.id);

  DOM.activeAvatar.src = avatar;
  DOM.activeName.textContent = displayName;
  DOM.activeHandle.textContent = `@${partner.username || 'user'}`;
  DOM.activeGoldenTick.style.display = partner.golden_tick ? 'inline-flex' : 'none';
  DOM.activeOnlineDot.className = `active-online-dot ${isOnline ? 'is-online' : ''}`;
  DOM.activeStatus.textContent = isOnline ? 'Online' : 'Offline';
  DOM.activeStatus.className = `active-status ${isOnline ? 'is-online' : ''}`;

  // Check Block Status
  checkBlockStatus(partner.id);

  // Load Messages for this conversation
  await loadMessages(conv.id);

  // Mark all unread messages in this conversation as seen
  await markMessagesAsSeen(conv.id);

  // Focus input
  DOM.composerInput.focus();
}

/**
 * Check if users have blocked each other
 */
function checkBlockStatus(partnerId) {
  const isBlockedByMe = ChatState.blockedUsers.has(partnerId);
  const isBlockedByThem = ChatState.blockedByUsers.has(partnerId);

  if (isBlockedByMe) {
    DOM.blockedBanner.style.display = 'flex';
    DOM.blockedBannerText.textContent = 'You blocked this user.';
    DOM.unblockBannerBtn.style.display = 'inline-block';
    DOM.composerWrap.style.display = 'none';
  } else if (isBlockedByThem) {
    DOM.blockedBanner.style.display = 'flex';
    DOM.blockedBannerText.textContent = "You can't send messages to this user.";
    DOM.unblockBannerBtn.style.display = 'none';
    DOM.composerWrap.style.display = 'none';
  } else {
    DOM.blockedBanner.style.display = 'none';
    DOM.composerWrap.style.display = 'block';
  }
}

/**
 * Load Messages for active conversation
 */
async function loadMessages(conversationId) {
  DOM.messagesList.innerHTML = '<div style="text-align:center; padding:2rem; color:#64748b;">Loading messages...</div>';

  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(150);

    if (error) {
      console.warn("Error loading messages:", error);
      DOM.messagesList.innerHTML = '<div style="text-align:center; padding:2rem; color:#ef4444;">Failed to load messages.</div>';
      return;
    }

    ChatState.messages = messages || [];
    renderMessagesList();
    scrollToBottom();

  } catch (err) {
    console.error("loadMessages exception:", err);
  }
}

/**
 * Render all messages grouped by date
 */
function renderMessagesList() {
  DOM.messagesList.innerHTML = '';

  if (ChatState.messages.length === 0) {
    DOM.messagesList.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem; color:#94a3b8;">
        <div style="font-size:2rem; margin-bottom:0.5rem;">👋</div>
        <strong style="color:#fff; display:block; margin-bottom:0.25rem;">Say hello to start chatting!</strong>
        <span style="font-size:0.8rem; color:#64748b;">Messages are private and end-to-end encrypted in transit.</span>
      </div>
    `;
    return;
  }

  let lastDateStr = null;

  ChatState.messages.forEach(msg => {
    // Check if deleted for current user
    const isSender = msg.sender_id === ChatState.currentUser.id;
    if (isSender && msg.deleted_for_sender) return;
    if (!isSender && msg.deleted_for_receiver) return;

    // Date separator
    const msgDateStr = getDateSeparator(msg.created_at);
    if (msgDateStr !== lastDateStr) {
      const sep = document.createElement('div');
      sep.className = 'chat-date-separator';
      sep.innerHTML = `<span>${msgDateStr}</span>`;
      DOM.messagesList.appendChild(sep);
      lastDateStr = msgDateStr;
    }

    renderSingleMessage(msg);
  });
}

/**
 * Render a single message row
 */
function renderSingleMessage(msg) {
  const isSender = msg.sender_id === ChatState.currentUser.id;
  const isDeleted = msg.deleted_for_everyone;

  const row = document.createElement('div');
  row.className = `message-row ${isSender ? 'outgoing' : 'incoming'}`;
  row.id = `msg-${msg.id}`;

  const timeStr = formatMessageTime(msg.created_at);
  const statusCheck = isSender ? getStatusCheckHtml(msg.status) : '';

  let contentHtml = isDeleted
    ? `<span>🚫 Message deleted</span>`
    : escapeHtml(msg.content);

  row.innerHTML = `
    <div class="msg-bubble ${isDeleted ? 'is-deleted' : ''}">
      <div class="msg-text">${contentHtml}</div>
      <div class="msg-meta-line">
        <span>${timeStr}</span>
        ${statusCheck}
      </div>
    </div>
    ${!isDeleted ? `
      <button type="button" class="msg-actions-trigger" title="Message options" aria-label="Message options">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
      </button>
    ` : ''}
  `;

  // Bind message options (delete)
  const actionBtn = row.querySelector('.msg-actions-trigger');
  if (actionBtn) {
    actionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMessageDeleteModal(msg);
    });
  }

  DOM.messagesList.appendChild(row);
}

function updateMessageElement(msg) {
  const row = document.getElementById(`msg-${msg.id}`);
  if (!row) return;

  const isSender = msg.sender_id === ChatState.currentUser.id;
  const isDeleted = msg.deleted_for_everyone;

  const bubble = row.querySelector('.msg-bubble');
  const textEl = row.querySelector('.msg-text');
  const metaLine = row.querySelector('.msg-meta-line');

  if (isDeleted) {
    bubble.classList.add('is-deleted');
    textEl.innerHTML = `<span>🚫 Message deleted</span>`;
    const actionBtn = row.querySelector('.msg-actions-trigger');
    if (actionBtn) actionBtn.remove();
  }

  if (isSender && metaLine) {
    const timeStr = formatMessageTime(msg.created_at);
    metaLine.innerHTML = `
      <span>${timeStr}</span>
      ${getStatusCheckHtml(msg.status)}
    `;
  }
}

function getStatusCheckHtml(status) {
  if (status === 'seen') {
    return `<span class="msg-status-icon seen" title="Seen">✓✓</span>`;
  } else if (status === 'delivered') {
    return `<span class="msg-status-icon" title="Delivered">✓✓</span>`;
  }
  return `<span class="msg-status-icon" title="Sent">✓</span>`;
}

/**
 * Send Message
 */
async function handleSendMessage() {
  const text = DOM.composerInput.value.trim();
  if (!text || !ChatState.activeConversation || !ChatState.activePartner) return;

  DOM.composerInput.value = '';
  DOM.composerInput.style.height = 'auto';
  DOM.composerSendBtn.disabled = true;

  const convId = ChatState.activeConversation.id;
  const partnerId = ChatState.activePartner.id;
  const senderId = ChatState.currentUser.id;

  try {
    // 1. Insert message
    const { data: msg, error: msgErr } = await supabase
      .from('messages')
      .insert({
        conversation_id: convId,
        sender_id: senderId,
        receiver_id: partnerId,
        content: text,
        status: 'sent'
      })
      .select()
      .single();

    if (msgErr) throw msgErr;

    // 2. Update conversation record
    await supabase
      .from('conversations')
      .update({
        last_message: text,
        last_message_at: new Date().toISOString(),
        last_sender_id: senderId,
        updated_at: new Date().toISOString()
      })
      .eq('id', convId);

    // Append to local list
    ChatState.messages.push(msg);
    renderSingleMessage(msg);
    scrollToBottom();

    // Refresh conversation list in sidebar
    await loadConversations();

  } catch (err) {
    console.error("SendMessage error:", err);
    showToast("Message could not be sent. Please retry.", "⚠️");
  }
}

/**
 * Mark messages in conversation as seen
 */
async function markMessagesAsSeen(conversationId) {
  if (!ChatState.currentUser || !conversationId) return;

  try {
    await supabase
      .from('messages')
      .update({
        status: 'seen',
        seen_at: new Date().toISOString()
      })
      .eq('conversation_id', conversationId)
      .eq('receiver_id', ChatState.currentUser.id)
      .neq('status', 'seen');

  } catch (err) {
    console.warn("markMessagesAsSeen error:", err);
  }
}

/**
 * Message Delete Modal
 */
function openMessageDeleteModal(msg) {
  const isSender = msg.sender_id === ChatState.currentUser.id;

  const content = `
    <div class="chat-modal-box">
      <div class="chat-modal-header">
        <h4>Delete Message</h4>
        <button type="button" class="chat-modal-close-btn" id="modal-close-btn">&times;</button>
      </div>
      <div class="chat-modal-body">
        <p style="color:#cbd5e1; font-size:0.92rem; margin-bottom:1rem;">
          Do you want to delete this message?
        </p>
        <div style="background:rgba(255,255,255,0.05); padding:10px 14px; border-radius:8px; font-size:0.85rem; color:#94a3b8; font-style:italic;">
          "${escapeHtml(msg.content.substring(0, 80))}${msg.content.length > 80 ? '...' : ''}"
        </div>
      </div>
      <div class="chat-modal-footer">
        <button type="button" class="btn-secondary" id="delete-for-me-btn">Delete for me</button>
        ${isSender ? `<button type="button" class="btn-danger" id="delete-for-everyone-btn">Delete for everyone</button>` : ''}
      </div>
    </div>
  `;

  showModal(content);

  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);

  document.getElementById('delete-for-me-btn')?.addEventListener('click', async () => {
    closeModal();
    await deleteMessage(msg, false);
  });

  document.getElementById('delete-for-everyone-btn')?.addEventListener('click', async () => {
    closeModal();
    await deleteMessage(msg, true);
  });
}

/**
 * Delete message execution
 */
async function deleteMessage(msg, forEveryone) {
  try {
    const isSender = msg.sender_id === ChatState.currentUser.id;

    if (forEveryone) {
      await supabase
        .from('messages')
        .update({
          deleted_for_everyone: true,
          content: 'This message was deleted'
        })
        .eq('id', msg.id);

      msg.deleted_for_everyone = true;
      msg.content = 'This message was deleted';
      updateMessageElement(msg);
      showToast("Message deleted for everyone", "🗑️");
    } else {
      const updateField = isSender ? { deleted_for_sender: true } : { deleted_for_receiver: true };
      await supabase
        .from('messages')
        .update(updateField)
        .eq('id', msg.id);

      // Remove row locally
      document.getElementById(`msg-${msg.id}`)?.remove();
      showToast("Message deleted for you", "🗑️");
    }
  } catch (err) {
    console.error("deleteMessage error:", err);
    showToast("Failed to delete message", "⚠️");
  }
}

/**
 * Block Confirmation Modal
 */
function confirmBlockUser() {
  const partner = ChatState.activePartner;
  if (!partner) return;

  const displayName = partner.display_name || partner.username || 'this user';

  const content = `
    <div class="chat-modal-box">
      <div class="chat-modal-header">
        <h4>Block ${escapeHtml(displayName)}?</h4>
        <button type="button" class="chat-modal-close-btn" id="modal-close-btn">&times;</button>
      </div>
      <div class="chat-modal-body">
        <p style="color:#cbd5e1; font-size:0.92rem;">
          Blocked users cannot send you messages and cannot communicate with you in private chat.
        </p>
      </div>
      <div class="chat-modal-footer">
        <button type="button" class="btn-secondary" id="modal-cancel-btn">Cancel</button>
        <button type="button" class="btn-danger" id="confirm-block-btn">Block User</button>
      </div>
    </div>
  `;

  showModal(content);

  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('modal-cancel-btn')?.addEventListener('click', closeModal);
  document.getElementById('confirm-block-btn')?.addEventListener('click', async () => {
    closeModal();
    await blockUser(partner.id);
  });
}

/**
 * Block user execution
 */
async function blockUser(partnerId) {
  try {
    await supabase
      .from('user_blocks')
      .insert({
        blocker_id: ChatState.currentUser.id,
        blocked_id: partnerId
      });

    ChatState.blockedUsers.add(partnerId);
    checkBlockStatus(partnerId);
    showToast("User blocked successfully", "🚫");
  } catch (err) {
    console.error("blockUser error:", err);
    showToast("Failed to block user", "⚠️");
  }
}

/**
 * Unblock user execution
 */
async function unblockUser(partnerId) {
  try {
    await supabase
      .from('user_blocks')
      .delete()
      .eq('blocker_id', ChatState.currentUser.id)
      .eq('blocked_id', partnerId);

    ChatState.blockedUsers.delete(partnerId);
    checkBlockStatus(partnerId);
    showToast("User unblocked", "✓");
  } catch (err) {
    console.error("unblockUser error:", err);
    showToast("Failed to unblock user", "⚠️");
  }
}

/**
 * Load user blocks
 */
async function loadBlocks() {
  if (!ChatState.currentUser) return;

  try {
    const { data: myBlocks } = await supabase
      .from('user_blocks')
      .select('blocked_id')
      .eq('blocker_id', ChatState.currentUser.id);

    const { data: blockedMe } = await supabase
      .from('user_blocks')
      .select('blocker_id')
      .eq('blocked_id', ChatState.currentUser.id);

    ChatState.blockedUsers = new Set((myBlocks || []).map(b => b.blocked_id));
    ChatState.blockedByUsers = new Set((blockedMe || []).map(b => b.blocker_id));
  } catch (err) {
    console.warn("loadBlocks error:", err);
  }
}

/**
 * Delete Conversation confirmation
 */
function confirmDeleteConversation() {
  const partner = ChatState.activePartner;
  if (!partner || !ChatState.activeConversation) return;

  const content = `
    <div class="chat-modal-box">
      <div class="chat-modal-header">
        <h4>Delete Conversation?</h4>
        <button type="button" class="chat-modal-close-btn" id="modal-close-btn">&times;</button>
      </div>
      <div class="chat-modal-body">
        <p style="color:#cbd5e1; font-size:0.92rem;">
          This conversation will be removed from your messages list.
        </p>
      </div>
      <div class="chat-modal-footer">
        <button type="button" class="btn-secondary" id="modal-cancel-btn">Cancel</button>
        <button type="button" class="btn-danger" id="confirm-del-conv-btn">Delete</button>
      </div>
    </div>
  `;

  showModal(content);

  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('modal-cancel-btn')?.addEventListener('click', closeModal);
  document.getElementById('confirm-del-conv-btn')?.addEventListener('click', async () => {
    closeModal();
    await deleteConversation(ChatState.activeConversation.id);
  });
}

/**
 * Delete Conversation execution
 */
async function deleteConversation(convId) {
  try {
    await supabase
      .from('conversations')
      .delete()
      .eq('id', convId);

    ChatState.activeConversation = null;
    ChatState.activePartner = null;
    DOM.activeScreen.style.display = 'none';
    DOM.noActiveView.style.display = 'flex';
    DOM.container.classList.remove('mobile-chat-open');

    await loadConversations();
    showToast("Conversation deleted", "🗑️");
  } catch (err) {
    console.error("deleteConversation error:", err);
    showToast("Failed to delete conversation", "⚠️");
  }
}

/**
 * Profile Modal
 */
function showProfileModal(user) {
  if (!user) return;

  const displayName = user.display_name || user.username || 'User';
  const avatar = user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
  const isOnline = ChatState.onlineUserIds.has(user.id);
  const isBlocked = ChatState.blockedUsers.has(user.id);

  const content = `
    <div class="chat-modal-box">
      <div class="chat-modal-header">
        <h4>User Profile</h4>
        <button type="button" class="chat-modal-close-btn" id="modal-close-btn">&times;</button>
      </div>
      <div class="chat-modal-body" style="text-align:center;">
        <div style="position:relative; width:80px; height:80px; margin:0 auto 1rem auto;">
          <img src="${avatar}" alt="${escapeHtml(displayName)}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; border:2.5px solid #ff6b4a;" />
          <span style="position:absolute; bottom:2px; right:2px; width:14px; height:14px; border-radius:50%; background:${isOnline ? 'var(--online-green)' : '#64748b'}; border:2.5px solid #0f1420;"></span>
        </div>
        <h3 style="color:#fff; margin-bottom:0.25rem; font-size:1.25rem; display:flex; align-items:center; justify-content:center; gap:6px;">
          ${escapeHtml(displayName)}
          ${user.golden_tick ? `<span class="golden-tick-badge">✓</span>` : ''}
        </h3>
        <div style="color:#94a3b8; font-family:monospace; font-size:0.85rem; margin-bottom:1rem;">
          @${escapeHtml(user.username || 'user')}
        </div>
        <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(255,107,74,0.12); border:1px solid rgba(255,107,74,0.3); padding:4px 12px; border-radius:8px; color:#ff8b70; font-family:monospace; font-weight:600; font-size:0.82rem; margin-bottom:1.5rem;">
          <span>HarshGuruJi ID: ${escapeHtml(user.hgj_id || 'HGJ-UNKNOWN')}</span>
        </div>
        <div>
          <button type="button" class="${isBlocked ? 'btn-secondary' : 'btn-danger'}" id="profile-block-toggle-btn" style="width:100%;">
            ${isBlocked ? 'Unblock User' : 'Block User'}
          </button>
        </div>
      </div>
    </div>
  `;

  showModal(content);

  document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
  document.getElementById('profile-block-toggle-btn')?.addEventListener('click', async () => {
    closeModal();
    if (isBlocked) {
      await unblockUser(user.id);
    } else {
      await blockUser(user.id);
    }
  });
}

/**
 * Login Required Modal
 */
function showLoginRequiredModal() {
  const content = `
    <div class="chat-modal-box" style="text-align:center;">
      <div class="chat-modal-body" style="padding:2.5rem 1.5rem;">
        <div style="font-size:3rem; margin-bottom:1rem;">🔒</div>
        <h3 style="color:#fff; font-size:1.35rem; margin-bottom:0.5rem;">Sign In to Access Chat</h3>
        <p style="color:#94a3b8; font-size:0.9rem; line-height:1.5; margin-bottom:1.5rem;">
          Private one-to-one messaging is available only for registered HarshGuruJi members. Please sign in or create an account to start chatting!
        </p>
        <a href="login.html?redirect=chat.html" class="start-chat-btn" style="width:100%; justify-content:center; text-decoration:none;">
          Log In to HarshGuruJi
        </a>
      </div>
    </div>
  `;

  showModal(content);
}

/**
 * Modal utilities
 */
function showModal(html) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'chat-modal-overlay';
  overlay.id = 'chat-modal-overlay';
  overlay.innerHTML = html;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.body.appendChild(overlay);
}

function closeModal() {
  const existing = document.getElementById('chat-modal-overlay');
  if (existing) existing.remove();
}

/**
 * Toast Notifications
 */
function showToast(text, icon = "💬") {
  if (!DOM.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'chat-toast';
  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(text)}</span>`;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastSlideIn 0.2s reverse forwards';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}

/**
 * Update online indicators across UI
 */
function updateOnlineStatusIndicators() {
  // Update sidebar list
  document.querySelectorAll('.conv-online-dot').forEach(dot => {
    const partnerId = dot.dataset.partnerId;
    dot.classList.toggle('is-online', ChatState.onlineUserIds.has(partnerId));
  });

  // Update active chat header
  if (ChatState.activePartner) {
    const isOnline = ChatState.onlineUserIds.has(ChatState.activePartner.id);
    DOM.activeOnlineDot.className = `active-online-dot ${isOnline ? 'is-online' : ''}`;
    DOM.activeStatus.textContent = isOnline ? 'Online' : 'Offline';
    DOM.activeStatus.className = `active-status ${isOnline ? 'is-online' : ''}`;
  }
}

/**
 * Handle URL query params (e.g. chat.html?u=userId or chat.html?hgj=HGJ-XXXXXX)
 */
async function handleUrlParameters() {
  const params = new URLSearchParams(window.location.search);
  const targetUserId = params.get('u');
  const targetHgjId = params.get('hgj');

  if (targetUserId) {
    const { data: user } = await supabase
      .from('profiles')
      .select('id, display_name, username, hgj_id, avatar_url, golden_tick')
      .eq('id', targetUserId)
      .maybeSingle();

    if (user) startOrOpenConversation(user);
  } else if (targetHgjId) {
    const { data: user } = await supabase
      .from('profiles')
      .select('id, display_name, username, hgj_id, avatar_url, golden_tick')
      .eq('hgj_id', targetHgjId.toUpperCase())
      .maybeSingle();

    if (user) startOrOpenConversation(user);
  }
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    if (DOM.messagesContainer) {
      DOM.messagesContainer.scrollTop = DOM.messagesContainer.scrollHeight;
    }
  });
}

function getDateSeparator(isoString) {
  if (!isoString) return 'Today';
  const date = new Date(isoString);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatMessageTime(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
