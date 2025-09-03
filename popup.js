// Store JavaScript blocking state
let blockedDomains = new Set();

// Load blocked domains from storage
browser.storage.local.get('blockedDomains').then(result => {
  if (result.blockedDomains) {
    blockedDomains = new Set(result.blockedDomains);
  }
  updateButtonState();
});

// Update button state based on current domain
function updateButtonState() {
  browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
    if (tabs[0]) {
      const currentUrl = new URL(tabs[0].url);
      const domain = currentUrl.hostname;
      const button = document.getElementById('toggleJs');
      
      if (blockedDomains.has(domain)) {
        button.textContent = 'JavaScript: Deaktiviert';
        button.classList.add('disabled');
      } else {
        button.textContent = 'JavaScript: Aktiviert';
        button.classList.remove('disabled');
      }
    }
  });
}

// Toggle JavaScript button
document.getElementById('toggleJs').addEventListener('click', function() {
  browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
    if (tabs[0]) {
      const currentUrl = new URL(tabs[0].url);
      const domain = currentUrl.hostname;
      
      // Check if we're on NZZ.ch
      if (!domain.includes('nzz.ch')) {
        document.getElementById('status').textContent = 'Diese Extension funktioniert nur auf nzz.ch';
        return;
      }
      
      const button = document.getElementById('toggleJs');
      
      if (blockedDomains.has(domain)) {
        // Enable JavaScript
        blockedDomains.delete(domain);
        button.textContent = 'JavaScript: Aktiviert';
        button.classList.remove('disabled');
        document.getElementById('status').textContent = 'JavaScript aktiviert. Seite wird neu geladen...';
      } else {
        // Disable JavaScript
        blockedDomains.add(domain);
        button.textContent = 'JavaScript: Deaktiviert';
        button.classList.add('disabled');
        document.getElementById('status').textContent = 'JavaScript deaktiviert. Seite wird neu geladen...';
      }
      
      // Save to storage
      browser.storage.local.set({
        blockedDomains: Array.from(blockedDomains)
      });
      
      // Send message to background script
      browser.runtime.sendMessage({
        action: 'updateBlockedDomains',
        blockedDomains: Array.from(blockedDomains)
      });
      
      // Reload the tab after a short delay
      setTimeout(() => {
        browser.tabs.reload(tabs[0].id);
      }, 500);
    }
  });
});

// Remove class button
document.getElementById('removeClass').addEventListener('click', function() {
  browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
    browser.tabs.sendMessage(tabs[0].id, {action: "removeClass"}).then(response => {
      if (response && response.success) {
        document.getElementById('status').textContent = `${response.count} Element(e) bearbeitet.`;
      }
    }).catch(error => {
      document.getElementById('status').textContent = 'Fehler: Seite muss neu geladen werden.';
      console.error(error);
    });
  });
});