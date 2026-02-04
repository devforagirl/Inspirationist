const popupToggle = document.getElementById('popup-toggle');
const fontSelect = document.getElementById('font-select');
const fontSizeSelect = document.getElementById('font-size-select');
const fontBoldToggle = document.getElementById('font-bold-toggle');

// Load saved settings
chrome.storage.sync.get(['popupEnabled', 'fontStyle', 'fontSize', 'fontBold'], (result) => {
  popupToggle.checked = result.popupEnabled !== false;
  fontSelect.value = result.fontStyle || "'Indie Flower'";
  fontSizeSelect.value = result.fontSize || "1.25rem";
  fontBoldToggle.checked = result.fontBold || false;
});

// Save settings when changed
popupToggle.addEventListener('change', () => {
  chrome.storage.sync.set({ popupEnabled: popupToggle.checked });
});

fontSelect.addEventListener('change', () => {
  chrome.storage.sync.set({ fontStyle: fontSelect.value });
});

fontSizeSelect.addEventListener('change', () => {
  chrome.storage.sync.set({ fontSize: fontSizeSelect.value });
});

fontBoldToggle.addEventListener('change', () => {
  chrome.storage.sync.set({ fontBold: fontBoldToggle.checked });
});
