const SUPABASE_URL = "https://rbeukamufvuciynutepl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiZXVrYW11ZnZ1Y2l5bnV0ZXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NzY3NzgsImV4cCI6MjA4NTI1Mjc3OH0.1KB76wPBdctxppMD0-bOqa5LU_Cbf5jOw-X_ctxkB-g";
const API_URL = `${SUPABASE_URL}/rest/v1/rpc/get_random_inspiration`;

const textElement = document.getElementById("inspiration-text");
const prevBtn = document.getElementById("prev-btn");
const copyBtn = document.getElementById("copy-btn");
const controls = document.getElementById("controls");
const spinner = document.getElementById("spinner");

let history = [];
let currentIndex = -1;
let hideTimeout = null;

function showControls() {
  controls.classList.add("visible");
  
  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }
  
  // Set timer to hide after 2 seconds
  hideTimeout = setTimeout(() => {
    controls.classList.remove("visible");
    hideTimeout = null;
  }, 2000);
}

async function fetchNewInspiration() {
  // Set loading state
  textElement.classList.add("loading");
  spinner.style.display = "block";
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    const storage = await chrome.storage.local.get(['seenIds']);
    let seenIds = storage.seenIds || [];

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ excluded_ids: seenIds }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    let data = await response.json();
    
    if ((!data || data.length === 0) && seenIds.length > 0) {
      await chrome.storage.local.set({ seenIds: [] });
      return fetchNewInspiration(); 
    }

    if (data && data.length > 0 && data[0].text) {
      const advice = data[0].text;
      const newId = data[0].id;

      seenIds.push(newId);
      await chrome.storage.local.set({ seenIds: seenIds });

      if (currentIndex < history.length - 1) {
        history = history.slice(0, currentIndex + 1);
      }
      history.push(advice);
      currentIndex = history.length - 1;
      updateDisplay();
    }
  } catch (error) {
    console.error("Error fetching inspiration:", error);
    if (error.name === 'AbortError') {
      textElement.textContent = "Request timed out. Please try again.";
    } else {
      textElement.textContent = "Failed to load inspiration. Check your connection.";
    }
    // Remove italic for error messages to make them clearer
    textElement.style.fontStyle = "normal";
  } finally {
    // Reset loading state
    textElement.classList.remove("loading");
    spinner.style.display = "none";
  }
}

function updateDisplay() {
  if (currentIndex >= 0 && currentIndex < history.length) {
    textElement.textContent = `"${history[currentIndex]}"`;
  }
  prevBtn.disabled = currentIndex <= 0;
}

// Logic for "Next" or "Forward" in history
function goForward() {
  if (currentIndex < history.length - 1) {
    currentIndex++;
    updateDisplay();
  } else {
    fetchNewInspiration();
  }
}

prevBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Don't trigger the body "Next" click
  if (currentIndex > 0) {
    currentIndex--;
    updateDisplay();
    showControls(); // Reset timer
  }
});

copyBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Don't trigger the body "Next" click
  if (currentIndex >= 0) {
    const text = history[currentIndex];
    navigator.clipboard.writeText(text).then(() => {
      const originalContent = copyBtn.textContent;
      copyBtn.textContent = "✔";
      setTimeout(() => {
        copyBtn.textContent = originalContent;
      }, 1000);
      showControls(); // Reset timer
    });
  }
});

// Click on the text to go to next inspiration
textElement.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent duplicate trigger from body listener
  goForward();
  showControls();
});

// Click anywhere on body (background) to JUST show buttons
document.body.addEventListener("click", () => {
  showControls();
});

// Initial load
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(['popupEnabled', 'fontStyle', 'fontSize', 'fontBold'], (result) => {
    const selectedFont = result.fontStyle || "'Indie Flower'";
    const selectedSize = result.fontSize || "1.25rem";
    const isBold = result.fontBold || false;
    
    // Apply Font Family
    if (selectedFont !== 'default') {
      textElement.style.fontFamily = `${selectedFont}, cursive, sans-serif`;
    }
    
    // Apply Font Size
    textElement.style.fontSize = selectedSize;
    
    // Apply Bold Weight
    textElement.style.fontWeight = isBold ? "bold" : "normal";

    if (result.popupEnabled === false) {
      textElement.textContent = "Inspirationist is disabled. Enable it in the Side Panel (Right-click icon -> Open side panel).";
      textElement.style.fontSize = "1rem";
      textElement.style.fontStyle = "normal";
      controls.style.display = "none";
      document.body.style.cursor = "default";
    } else {
      fetchNewInspiration();
    }
  });
});
