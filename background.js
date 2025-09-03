// Store blocked domains
let blockedDomains = new Set();

// Load blocked domains on startup
browser.storage.local.get('blockedDomains').then(result => {
  if (result.blockedDomains) {
    blockedDomains = new Set(result.blockedDomains);
  }
});

// Listen for messages from popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateBlockedDomains') {
    blockedDomains = new Set(request.blockedDomains);
    browser.storage.local.set({
      blockedDomains: request.blockedDomains
    });
  }
});

// Block JavaScript requests for blocked domains
browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    try {
      const url = new URL(details.url);
      const domain = url.hostname;
      
      // Only process nzz.ch domains
      if (!domain.includes('nzz.ch')) {
        return {};
      }
      
      // Check if this domain should have JavaScript blocked
      if (blockedDomains.has(domain)) {
        // Block JavaScript files
        if (details.type === 'script' || 
            details.url.endsWith('.js') || 
            details.url.includes('.js?')) {
          console.log('Blocking JavaScript:', details.url);
          return { cancel: true };
        }
      }
    } catch (e) {
      console.error('Error processing request:', e);
    }
    
    return {};
  },
  {
    urls: ["*://*.nzz.ch/*"],
    types: ["script"]
  },
  ["blocking"]
);

// Also block inline scripts by injecting CSP header
browser.webRequest.onHeadersReceived.addListener(
  function(details) {
    try {
      const url = new URL(details.url);
      const domain = url.hostname;
      
      // Only process nzz.ch domains
      if (!domain.includes('nzz.ch')) {
        return {};
      }
      
      if (blockedDomains.has(domain)) {
        // Add CSP header to block inline scripts
        details.responseHeaders.push({
          name: 'Content-Security-Policy',
          value: "script-src 'none';"
        });
        
        return { responseHeaders: details.responseHeaders };
      }
    } catch (e) {
      console.error('Error processing headers:', e);
    }
    
    return {};
  },
  {
    urls: ["*://*.nzz.ch/*"],
    types: ["main_frame", "sub_frame"]
  },
  ["blocking", "responseHeaders"]
);

console.log("Extension background script loaded");