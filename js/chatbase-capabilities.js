/**
 * ============================================================================
 * ChatBase 2.0 — Central Platform Capability Matrix & Policy Engine
 * Official Product: ChatBase by HarshGuruJi
 * Domain: webguruji.online | Web App: chat.webguruji.online
 * ============================================================================
 */

export const PlatformCapabilityMatrix = {
  // Current client platform detection
  currentPlatform: (function() {
    if (typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)) {
      return 'android';
    }
    return 'web';
  })(),

  // Capability declarations (Section 1)
  matrix: {
    textMessaging: {
      android: { supported: true, authRequired: true, limit: 5000 },
      web: { supported: true, authRequired: true, limit: 5000 }
    },
    emojiAndReactions: {
      android: { supported: true, authRequired: true },
      web: { supported: true, authRequired: true }
    },
    imageSharing: {
      android: { supported: true, authRequired: true, maxSizeBytes: 25 * 1024 * 1024, maxCount: 10 },
      web: { supported: true, authRequired: true, maxSizeBytes: 10 * 1024 * 1024, maxCount: 5 }
    },
    videoSharing: {
      android: { supported: true, authRequired: true, maxSizeBytes: 50 * 1024 * 1024, maxSeconds: 120 },
      web: { supported: true, authRequired: true, maxSizeBytes: 25 * 1024 * 1024, maxSeconds: 60 }
    },
    voiceMessages: {
      android: { supported: true, authRequired: true, maxDurationSec: 180, format: 'audio/mp4' },
      web: { supported: true, authRequired: true, maxDurationSec: 60, format: 'audio/webm' }
    },
    documentSharing: {
      android: { supported: true, authRequired: true, maxSizeBytes: 30 * 1024 * 1024, allowedTypes: ['pdf', 'doc', 'docx', 'zip', 'txt'] },
      web: { supported: true, authRequired: true, maxSizeBytes: 15 * 1024 * 1024, allowedTypes: ['pdf', 'txt', 'zip'] }
    },
    locationSharing: {
      android: { supported: true, authRequired: true, permissionRequired: 'ACCESS_FINE_LOCATION' },
      web: { supported: true, authRequired: true, consentRequired: true }
    },
    pushNotifications: {
      android: { supported: true, native: true },
      web: { supported: true, requiresBrowserPermission: true }
    },
    messageEditing: {
      android: { supported: true, windowMinutes: 15 },
      web: { supported: true, windowMinutes: 15 }
    },
    messageDeletionForEveryone: {
      android: { supported: true, windowMinutes: 60 },
      web: { supported: true, windowMinutes: 60 }
    },
    storyCreation: {
      android: { supported: true, expiresHours: 24 },
      web: { supported: true, expiresHours: 24 }
    },
    uniqueHgjIdDiscovery: {
      android: { supported: true, prefix: 'HGJ-' },
      web: { supported: true, prefix: 'HGJ-' }
    }
  },

  // Check if a feature is supported on target platform
  canUse(featureKey, platform = this.currentPlatform) {
    const feat = this.matrix[featureKey];
    if (!feat) return false;
    const platConfig = feat[platform];
    return !!(platConfig && platConfig.supported);
  },

  // Get specific limit for feature
  getLimit(featureKey, limitKey, platform = this.currentPlatform) {
    const feat = this.matrix[featureKey];
    if (!feat || !feat[platform]) return null;
    return feat[platform][limitKey] ?? null;
  },

  // Validate file attachment according to platform policies
  validateUpload(file, type = 'image', platform = this.currentPlatform) {
    if (!file) return { valid: false, error: 'No file provided' };
    
    let key = 'imageSharing';
    if (type === 'video') key = 'videoSharing';
    if (type === 'document') key = 'documentSharing';
    if (type === 'voice') key = 'voiceMessages';

    const maxBytes = this.getLimit(key, 'maxSizeBytes', platform);
    if (maxBytes && file.size > maxBytes) {
      const mbLimit = Math.round(maxBytes / (1024 * 1024));
      return {
        valid: false,
        error: `File size exceeds the ${platform.toUpperCase()} limit of ${mbLimit} MB.`
      };
    }

    return { valid: true };
  }
};

// Global export for vanilla scripts
if (typeof window !== 'undefined') {
  window.ChatBaseCapabilities = PlatformCapabilityMatrix;
}

export default PlatformCapabilityMatrix;
