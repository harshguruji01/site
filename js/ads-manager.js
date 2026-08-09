/**
 * ads-manager.js
 * Generates a high-volume ad grid integrating all Adsterra units perfectly.
 */

document.addEventListener("DOMContentLoaded", () => {
    const initializeAds = () => {
        const AD_COUNT = 180; // 180 / 9 distinct types = exactly 20 of each type!
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

    // 2. Define Ad Types & Configurations
    const baseStyle = "<style>body { margin: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }</style>";

    const adTypes = [
        // 0: Banner 300x250
        {
            width: 300,
            height: 250,
            content: `
                ${baseStyle}
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
            `
        },
        // 1: Native Banner 2:1
        {
            width: "100%", // Responsive width
            height: 250, // Approximate height for native banner
            content: `
                ${baseStyle}
                <script async="async" data-cfasync="false" src="https://pl29598346.effectivecpmnetwork.com/a92bbcbf9b1526464cf1c46a1c967e31/invoke.js"></script>
                <div id="container-a92bbcbf9b1526464cf1c46a1c967e31"></div>
            `
        },
        // 2: Banner 468x60
        {
            width: 468,
            height: 60,
            content: `
                ${baseStyle}
                <script>
                  atOptions = {
                    'key' : '784d54be67d2324455389eee4f872160',
                    'format' : 'iframe',
                    'height' : 60,
                    'width' : 468,
                    'params' : {}
                  };
                </script>
                <script src="https://www.highperformanceformat.com/784d54be67d2324455389eee4f872160/invoke.js"></script>
            `
        },
        // 3: Banner 160x300
        {
            width: 160,
            height: 300,
            content: `
                ${baseStyle}
                <script>
                  atOptions = {
                    'key' : 'd4e497999e9c83c123694f22e5269b27',
                    'format' : 'iframe',
                    'height' : 300,
                    'width' : 160,
                    'params' : {}
                  };
                </script>
                <script src="https://www.highperformanceformat.com/d4e497999e9c83c123694f22e5269b27/invoke.js"></script>
            `
        },
        // 4: Banner 160x600 (Skyscraper)
        {
            width: 160,
            height: 600,
            content: `
                ${baseStyle}
                <script>
                  atOptions = {
                    'key' : 'f1f011b8642a5e31f02962df60cd152b',
                    'format' : 'iframe',
                    'height' : 600,
                    'width' : 160,
                    'params' : {}
                  };
                </script>
                <script src="https://www.highperformanceformat.com/f1f011b8642a5e31f02962df60cd152b/invoke.js"></script>
            `
        },
        // 5: Banner 728x90 (Leaderboard)
        {
            width: 728,
            height: 90,
            content: `
                ${baseStyle}
                <script>
                  atOptions = {
                    'key' : 'def1355cdf5980ec10195148717781dc',
                    'format' : 'iframe',
                    'height' : 90,
                    'width' : 728,
                    'params' : {}
                  };
                </script>
                <script src="https://www.highperformanceformat.com/def1355cdf5980ec10195148717781dc/invoke.js"></script>
            `
        },
        // 6: Banner 320x50 (Mobile Leaderboard)
        {
            width: 320,
            height: 50,
            content: `
                ${baseStyle}
                <script>
                  atOptions = {
                    'key' : '9c7b57148a88f2509a01c88da332d3cd',
                    'format' : 'iframe',
                    'height' : 50,
                    'width' : 320,
                    'params' : {}
                  };
                </script>
                <script src="https://www.highperformanceformat.com/9c7b57148a88f2509a01c88da332d3cd/invoke.js"></script>
            `
        },
        // 7: Smart Link 1 (Original)
        {
            isSmartLink: true,
            content: `
                <div style="text-align:center; padding: 20px; display:flex; flex-direction:column; justify-content:center; height:100%;">
                    <h3 style="color:var(--text-primary); font-family:'Space Grotesk', sans-serif; margin-bottom:10px;">Exclusive Offer</h3>
                    <p style="color:var(--text-secondary); margin-bottom:20px;">Discover the best deals and premium content selected just for you.</p>
                    <a href="https://www.effectivecpmnetwork.com/nczuze2v0z?key=c1ab3bf3f868481bfcdc8a2035d2f662" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:10px 20px; background:var(--accent-blue); color:#fff; text-decoration:none; border-radius:8px; font-weight:600;">Claim Offer ↗</a>
                </div>
            `
        },
        // 8: Smart Link 2 (New)
        {
            isSmartLink: true,
            content: `
                <div style="text-align:center; padding: 20px; display:flex; flex-direction:column; justify-content:center; height:100%;">
                    <h3 style="color:var(--text-primary); font-family:'Space Grotesk', sans-serif; margin-bottom:10px;">Special Rewards</h3>
                    <p style="color:var(--text-secondary); margin-bottom:20px;">Unlock special rewards and access premium content instantly.</p>
                    <a href="https://www.effectivecpmnetwork.com/p5beq3sts?key=f0ebce1e6689deecd8a3dc50235a7d92" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:10px 20px; background:var(--accent-primary); color:#000; text-decoration:none; border-radius:8px; font-weight:600;">Unlock Now ↗</a>
                </div>
            `
        }
    ];

    // Helper function to create an isolated iframe ad
    const createAdIframe = (srcdocContent, width, height) => {
        const iframe = document.createElement("iframe");
        iframe.setAttribute("srcdoc", srcdocContent);
        
        // Handle responsive vs fixed widths gracefully
        if (typeof width === 'number') {
            iframe.style.width = width + "px";
            iframe.style.maxWidth = "100%"; // Prevent breaking out of grid on small screens
        } else {
            iframe.style.width = width;
        }

        iframe.style.height = height + "px";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("scrolling", "no");
        iframe.style.border = "none";
        iframe.style.overflow = "hidden";
        iframe.style.backgroundColor = "transparent";
        return iframe;
    };

    // 3. Sidebars (Banner 300x250)
    const leftSidebar = document.createElement("div");
    leftSidebar.className = "ad-sticky-sidebar ad-sticky-left";
    leftSidebar.appendChild(createAdIframe(adTypes[0].content, adTypes[0].width, adTypes[0].height));
    document.body.appendChild(leftSidebar);

    const rightSidebar = document.createElement("div");
    rightSidebar.className = "ad-sticky-sidebar ad-sticky-right";
    rightSidebar.appendChild(createAdIframe(adTypes[0].content, adTypes[0].width, adTypes[0].height));
    document.body.appendChild(rightSidebar);

    // 4. Generate 120 ad containers in the grid
    for (let i = 0; i < AD_COUNT; i++) {
        const wrapper = document.createElement("div");
        wrapper.className = "ad-container-wrapper";
        
        const label = document.createElement("div");
        label.className = "ad-slot-label";
        label.textContent = `ADVERTISEMENT ${i + 1}`;
        wrapper.appendChild(label);

        const container = document.createElement("div");
        container.className = "ad-container";
        // Allow the container to adjust based on iframe height
        container.style.height = "auto";
        container.style.minHeight = "250px";
        container.style.display = "flex";
        container.style.justifyContent = "center";
        container.style.alignItems = "center";
        
        // Cycle through all 8 ad types
        const adConfig = adTypes[i % adTypes.length];

        if (adConfig.isSmartLink) {
            container.innerHTML = adConfig.content;
        } else {
            // Stagger loading to prevent browser locking up
            setTimeout(() => {
                container.appendChild(createAdIframe(adConfig.content, adConfig.width, adConfig.height));
            }, i * 20); 
        }

        wrapper.appendChild(container);
        gridContainer.appendChild(wrapper);
    }
    }; // end initializeAds

    if (sessionStorage.getItem('partner_ads_verified') === 'true') {
        initializeAds();
    } else {
        window.addEventListener('PartnerAdsVerified', initializeAds);
    }
});
