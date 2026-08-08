/**
 * ads-manager.js
 * Handles the secure loading, configuration, and state management of the Advertisement Center.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Advertisement Configuration
    const AD_CONFIG = {
        enabled: true,
        provider: "PLACEHOLDER", // e.g. "ADSTERRA", "ADSENSE"
        primaryUnitId: "PRIMARY_AD_UNIT_ID",
        secondaryUnitId: "SECONDARY_AD_UNIT_ID",
        timeoutMs: 5000 // How long to wait before showing error state
    };

    if (!AD_CONFIG.enabled) {
        document.querySelectorAll(".ad-container").forEach(container => {
            const loadingState = container.querySelector(".ad-state-box.loading");
            if (loadingState) loadingState.classList.add("hidden");
        });
        return;
    }

    // Initialize an individual ad slot
    function initializeAdSlot(containerId, unitId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const loadingState = container.querySelector(".ad-state-box.loading");
        const errorState = container.querySelector(".ad-state-box.error");
        const adContent = container.querySelector(".ad-content");

        // Function to handle successful ad load
        function onAdLoaded() {
            if (loadingState) loadingState.classList.add("hidden");
            if (errorState) errorState.classList.add("hidden");
            if (adContent) adContent.classList.remove("hidden");
        }

        // Function to handle ad load failure
        function onAdError() {
            if (loadingState) loadingState.classList.add("hidden");
            if (adContent) adContent.classList.add("hidden");
            if (errorState) errorState.classList.remove("hidden");
        }

        // Simulated Ad Loading Process (Replace with actual provider logic)
        // Example:
        // const script = document.createElement("script");
        // script.src = "https://ad-provider.com/serve?id=" + unitId;
        // script.onload = onAdLoaded;
        // script.onerror = onAdError;
        // adContent.appendChild(script);

        // For now, simulate network delay
        setTimeout(() => {
            // Simulated Success
            if (adContent) {
                adContent.innerHTML = `
                    <div style="width: 100%; height: 250px; background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); border-radius: 8px;">
                        [${AD_CONFIG.provider} Unit: ${unitId}]
                    </div>
                `;
            }
            onAdLoaded();
        }, Math.random() * 1000 + 1000); // Random load time between 1-2s

        // Set fallback timeout
        setTimeout(() => {
            if (adContent && !adContent.innerHTML.trim() && !adContent.hasChildNodes()) {
                onAdError();
            }
        }, AD_CONFIG.timeoutMs);
    }

    // Initialize both slots
    initializeAdSlot("primary-ad", AD_CONFIG.primaryUnitId);
    initializeAdSlot("secondary-ad", AD_CONFIG.secondaryUnitId);
});
