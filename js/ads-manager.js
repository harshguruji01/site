/**
 * ads-manager.js
 * Generates a high-volume ad grid integrating all Adsterra units perfectly.
 */

document.addEventListener("DOMContentLoaded", () => {
    const AD_COUNT = 50;
    const gridContainer = document.getElementById("ad-grid");
    
    if (!gridContainer) return;

    // 1. Inject Global Page Scripts (Social Bar & Popunder)
    const injectGlobalScripts = () => {
        // Social Bar
        const socialBar = document.createElement("script");
        socialBar.src = "https://pl29598349.effectivecpmnetwork.com/1b/b2/42/1bb2424fa78f61e4f2c8b1aa6fece358.js";
        document.body.appendChild(socialBar);

        // Popunder
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

    // Generate 50 ad containers
    for (let i = 0; i < AD_COUNT; i++) {
        const wrapper = document.createElement("div");
        wrapper.className = "ad-container-wrapper";
        
        const label = document.createElement("div");
        label.className = "ad-slot-label";
        label.textContent = `ADVERTISEMENT ${i + 1}`;
        wrapper.appendChild(label);

        const container = document.createElement("div");
        container.className = "ad-container";
        
        // Cycle through ad types
        const adType = i % 3;

        if (adType === 0 || adType === 1) {
            // Type A or Type B using iframe isolation
            const iframe = document.createElement("iframe");
            iframe.setAttribute("srcdoc", adType === 0 ? typeA_Banner300x250 : typeB_NativeBanner);
            iframe.setAttribute("width", "100%");
            iframe.setAttribute("height", "250");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("scrolling", "no");
            iframe.style.border = "none";
            iframe.style.overflow = "hidden";
            iframe.style.backgroundColor = "transparent";

            setTimeout(() => {
                container.appendChild(iframe);
            }, i * 50); // Stagger by 50ms

        } else {
            // Type C: Smart Link Card
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
