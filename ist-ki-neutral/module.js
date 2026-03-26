
// ===================================
// MODULE PAGE INTERACTIONS (EXHIBITION TERMINAL)
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeModes();
    initializeInspector();
    initializeSourceIndex();
    initializeChaos(); // New
    initializeWindowEffects();
    initializeExitModule();
    initializeMediaModal();
});

// ===================================
// MODE SWITCHING (COMMAND ROW)
// ===================================

function initializeModes() {
    const buttons = document.querySelectorAll('.command-btn[data-mode]');
    const layers = document.querySelectorAll('.archive-layer');

    // Init: Ensure correct layer is visible based on active button
    buttons.forEach(btn => {
        if (btn.classList.contains('active')) {
            const targetId = btn.getAttribute('data-mode');
            const targetLayer = document.getElementById(targetId);
            if (targetLayer) targetLayer.classList.add('visible');
        }
    });

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetLayerId = btn.getAttribute('data-mode');

            // 1. Update Buttons
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. Glitch Switch Layers
            layers.forEach(layer => {
                // If it is the new target, make it visible with animation
                if (layer.id === targetLayerId) {
                    layer.classList.remove('visible'); // Reset to trigger animation
                    void layer.offsetWidth; // Force reflow
                    layer.classList.add('visible');
                } else {
                    layer.classList.remove('visible');
                }
            });
        });
    });
}

// ===================================
// INSPECTOR OVERLAY (SOURCES/GLOSSARY)
// ===================================

function initializeInspector() {
    const inspector = document.getElementById('inspector-overlay');
    const toggleBtns = document.querySelectorAll('.toggle-inspector'); // Buttons that open it
    const closeBtn = document.getElementById('close-inspector');

    if (!inspector) return;

    // Toggle Visibility
    const toggleInspector = () => {
        inspector.classList.toggle('visible');
    };

    // Bind Toggles
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleInspector();
        });
    });

    // Bind Close
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            inspector.classList.remove('visible');
        });
    }

    // Close on click outside (optional, but good UX)
    document.addEventListener('click', (e) => {
        if (inspector.classList.contains('visible') &&
            !inspector.contains(e.target) &&
            ![...toggleBtns].some(btn => btn.contains(e.target))) {
            inspector.classList.remove('visible');
        }
    });
}

// ===================================
// SOURCE INDEX OVERLAY (RESEARCH DESK)
// ===================================

function initializeSourceIndex() {
    const overlay = document.getElementById('source-index-overlay');
    const openBtn = document.querySelector('.btn-source-index');
    const closeBtn = document.getElementById('close-source-index');

    if (!overlay) return; // Not on all pages

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.add('visible');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.remove('visible');
        });
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (overlay.classList.contains('visible') &&
            !overlay.contains(e.target) &&
            e.target !== openBtn) {
            overlay.classList.remove('visible');
        }
    });
}

// ===================================
// SYSTEM CHAOS (ARCHIVE DESKTOP)
// ===================================

function initializeChaos() {
    const windows = document.querySelectorAll('.archive-window');
    if (windows.length === 0) return;

    // Apply random animation delays
    windows.forEach(win => {
        const delay = Math.random() * 5 + 's';
        win.style.setProperty('--delay', delay);

        // Randomly assign the jitter class
        if (Math.random() > 0.3) {
            win.classList.add('chaos-shift');
        }
    });

    // Occasional random reposition (very subtle)
    setInterval(() => {
        const randomWin = windows[Math.floor(Math.random() * windows.length)];
        if (!randomWin) return;

        const shiftX = (Math.random() - 0.5) * 4; // Max 2px move
        const shiftY = (Math.random() - 0.5) * 4;

        randomWin.style.transform = `translate(${shiftX}px, ${shiftY}px)`;

        setTimeout(() => {
            randomWin.style.transform = 'translate(0, 0)';
        }, 200); // Snap back quickly
    }, 4000);
}

// ===================================
// SOURCE MODAL (ARCHIVE DESKTOP)
// ===================================

function initializeSystemSourceModal() {
    const modal = document.getElementById('sys-source-modal');
    if (!modal) return;

    // Logic is handled by inline onclicks in HTML for simplicity in this specific module 
    // or we can bind it here if we want strictly JS.
    // Let's stick to the existing patterns or binds.
}

function initializeWindowEffects() {
    const windows = document.querySelectorAll('.fragment-window');

    windows.forEach(win => {
        win.addEventListener('mouseenter', () => {
            // Optional: could trigger specific sound or intense glitch
        });
    });
}

// ===================================
// EXIT MODULE WITH SHUTDOWN ANIMATION
// ===================================

function initializeExitModule() {
    const exitButton = document.querySelector('.exit-cmd');

    if (exitButton) {
        exitButton.addEventListener('click', (e) => {
            e.preventDefault();
            exitModule();
        });
    }
}

function exitModule() {
    // Create shutdown overlay
    const overlay = document.createElement('div');
    overlay.className = 'shutdown-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = '#000';
    overlay.style.color = '#00ff41';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.fontFamily = 'monospace';
    overlay.innerHTML = '<div class="shutdown-text">> DISCONNECTING SESSION...</div>';
    document.body.appendChild(overlay);

    // Navigate back after animation
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 800);
}

// ===================================
// MEDIA LIGHTBOX
// ===================================

function initializeMediaModal() {
    const modal = document.getElementById('media-modal');
    if (!modal) return;

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeMediaModal();
        }
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeMediaModal();
        }
    });
}

window.openMediaModal = function (src, caption) {
    const modal = document.getElementById('media-modal');
    const fullImg = document.getElementById('media-full-img');
    const captionEl = document.getElementById('media-caption');

    if (modal && fullImg && captionEl) {
        fullImg.src = src;
        // Handle placeholder error if needed
        fullImg.onerror = function () {
            this.src = 'https://placehold.co/600x400/003300/00ff41?text=IMG_ERROR';
        };

        captionEl.textContent = caption ? ('> EVIDENCE: ' + caption) : '> EVIDENCE: UNKNOWN';
        modal.classList.remove('hidden');
    }
};

window.closeMediaModal = function () {
    const modal = document.getElementById('media-modal');
    if (modal) {
        modal.classList.add('hidden');
        const fullImg = document.getElementById('media-full-img');
        if (fullImg) setTimeout(() => { fullImg.src = ''; }, 300);
    }
};
