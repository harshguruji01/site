/**
 * ads-manager.js
 * Generates a high-volume ad grid and aggressively places ads everywhere on the page.
 */

document.addEventListener("DOMContentLoaded", () => {
    const AD_COUNT = 50;
    const gridContainer = document.getElementById("ad-grid");
    
    if (!gridContainer) return;

    // 1. Inject Global Page Scripts (Social Bar & Popunder)
    const injectGlobalScripts = () => {
        const socialBar = document.createElement("script");
        socialBar.src = "https://pl29598349.effectivecpmnetwork.com/1b/b2/42/1bb2424fa78f61e4f2c8b1aa6fece358.js";
        document.body.appendChild(socialBar);

        const popunder = document.createElement("script");
        popunder.src = "https://pl29598345.effectivecpmnetwork.com/3a/f9/d5/3af9d54dfbf265c3c2a18b7570c8ddea.js";
        document.body.appendChild(popunder);
    };
    injectGlobalScripts();

    // 2. Define Ad Types
    const typeA_Banner300x250 = `
        <style>body { margin: 0; display: flex; justify-content: center; align-items: center; background: transparent; }</style>
        <script>
          atOptions = {
            'key' : 'e1cde2cd382d8a1bc4b5ac24f00ed466',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script src="https://www.highperformanceformat.com/e1cde2cd382d8a1bc4b5ac24f00ed466/invoke.js"></script>
    `;

    const typeB_NativeBanner = `
        <style>body { margin: 0; display: flex; justify-content: center; align-items: center; background: transparent; }</style>
        <script async="async" data-cfasync="false" src="https://pl29598346.effectivecpmnetwork.com/a92bbcbf9b1526464cf1c46a1c967e31/invoke.js"></script>
        <div id="container-a92bbcbf9b1526464cf1c46a1c967e31"></div>
    `;

    const smartLinkUrl = "https://www.effectivecpmnetwork.com/nczuze2v0z?key=c1ab3bf3f868481bfcdc8a2035d2f662";

    // Helper function to create an isolated iframe ad
    const createAdIframe = (srcdocContent, width = "100%", height = "250") => {
        const iframe = document.createElement("iframe");
        iframe.setAttribute("srcdoc", srcdocContent);
        iframe.setAttribute("width", width);
        iframe.setAttribute("height", height);
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("scrolling", "no");
        iframe.style.border = "none";
        iframe.style.overflow = "hidden";
        iframe.style.backgroundColor = "transparent";
        return iframe;
    };

    // 3. Aggressive Placements
    
    // Sticky Left Sidebar (300x250)
    const leftSidebar = document.createElement("div");
    leftSidebar.className = "ad-sticky-sidebar ad-sticky-left";
    leftSidebar.appendChild(createAdIframe(typeA_Banner300x250, "300", "250"));
    document.body.appendChild(leftSidebar);

    // Sticky Right Sidebar (300x250)
    const rightSidebar = document.createElement("div");
    rightSidebar.className = "ad-sticky-sidebar ad-sticky-right";
    rightSidebar.appendChild(createAdIframe(typeA_Banner300x250, "300", "250"));
    document.body.appendChild(rightSidebar);

    // Sticky Bottom Bar (Native Banner)
    const bottomBar = document.createElement("div");
    bottomBar.className = "ad-sticky-bottom";
    bottomBar.appendChild(createAdIframe(typeB_NativeBanner, "100%", "90"));
    document.body.appendChild(bottomBar);

    // Hero Banner (Native Banner)
    const heroSection = document.querySelector('.ads-hero-section');
    if (heroSection) {
        const heroBanner = document.createElement("div");
        heroBanner.className = "ad-hero-banner";
        heroBanner.appendChild(createAdIframe(typeB_NativeBanner, "100%", "250"));
        heroSection.appendChild(heroBanner);
    }

    // Footer Banner (Native Banner)
    const infoSection = document.querySelector('.ads-info-section');
    if (infoSection) {
        const footerBanner = document.createElement("div");
        footerBanner.className = "ad-footer-banner";
        footerBanner.appendChild(createAdIframe(typeB_NativeBanner, "100%", "250"));
        infoSection.parentNode.insertBefore(footerBanner, infoSection.nextSibling);
    }

    // 4. Generate 50 ad containers in the grid
    for (let i = 0; i < AD_COUNT; i++) {
        const wrapper = document.createElement("div");
        wrapper.className = "ad-container-wrapper";
        
        const label = document.createElement("div");
        label.className = "ad-slot-label";
        label.textContent = `ADVERTISEMENT ${i + 1}`;
        wrapper.appendChild(label);

        const container = document.createElement("div");
        container.className = "ad-container";
        
        const adType = i % 3;

        if (adType === 0 || adType === 1) {
            setTimeout(() => {
                container.appendChild(createAdIframe(adType === 0 ? typeA_Banner300x250 : typeB_NativeBanner));
            }, i * 50); 
        } else {
            container.innerHTML = `
                <div style="text-align:center; padding: 20px;">
                    <h3 style="color:var(--text-primary); font-family:'Space Grotesk', sans-serif; margin-bottom:10px;">Exclusive Offer</h3>
                    <p style="color:var(--text-secondary); margin-bottom:20px;">Discover the best deals and premium content selected just for you.</p>
                    <a href="${smartLinkUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:10px 20px; background:var(--accent-blue); color:#fff; text-decoration:none; border-radius:8px; font-weight:600;">Claim Offer ↗</a>
                </div>
            `;
        }

        wrapper.appendChild(container);
        gridContainer.appendChild(wrapper);
    }
});
