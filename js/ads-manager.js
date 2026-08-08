/**
 * ads-manager.js
 * Generates a high-volume ad grid based on user request.
 */

document.addEventListener("DOMContentLoaded", () => {
    const AD_COUNT = 50;
    const gridContainer = document.getElementById("ad-grid");
    
    if (!gridContainer) return;

    // Adsterra 300x250 Banner configuration from ads.txt
    const adScriptContent = `
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
        
        // We use an iframe with srcdoc to isolate the adsterra script.
        // This is crucial because adsterra scripts often use document.write()
        // which would break the page if injected dynamically into the main DOM.
        const iframe = document.createElement("iframe");
        iframe.setAttribute("srcdoc", adScriptContent);
        iframe.setAttribute("width", "300");
        iframe.setAttribute("height", "250");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("scrolling", "no");
        iframe.style.border = "none";
        iframe.style.overflow = "hidden";
        iframe.style.backgroundColor = "transparent";

        // Optional: add a tiny delay between loads to avoid browser freezing
        setTimeout(() => {
            container.appendChild(iframe);
        }, i * 50); // Stagger by 50ms

        wrapper.appendChild(container);
        gridContainer.appendChild(wrapper);
    }
});
