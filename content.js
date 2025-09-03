// Listen for messages from popup
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "removeClass") {
    let totalCount = 0;

    // 1. Remove "nzzinteraction" class from all elements
    const nzzElements = document.querySelectorAll(".nzzinteraction");
    nzzElements.forEach(el => {
      el.classList.remove("nzzinteraction");
    });
    totalCount += nzzElements.length;

    // 2. Remove DIVs with "disabled-overlay disabled-overlay--show" classes
    const overlayElements = document.querySelectorAll("div.disabled-overlay.disabled-overlay--show");
    overlayElements.forEach(el => {
      el.remove(); // Completely remove the element from DOM
    });
    totalCount += overlayElements.length;

    // Send response back
    sendResponse({
      success: true,
      count: totalCount,
      details: {
        nzzInteraction: nzzElements.length,
        overlays: overlayElements.length
      }
    });
  } else if (request.action === "checkJsStatus") {
    sendResponse({ jsEnabled: true });
  }

  return true; // Keep the message channel open for async response
});

// Optional: Auto-remove class on page load (uncomment if desired)
window.addEventListener('load', function () {
  const elements = document.querySelectorAll(".nzzinteraction");
  elements.forEach(el => {
    el.classList.remove("nzzinteraction");
  });
  const overlayElements = document.querySelectorAll("div.disabled-overlay.disabled-overlay--show");
  overlayElements.forEach(el => {
    el.remove(); // Completely remove the element from DOM
  });

});