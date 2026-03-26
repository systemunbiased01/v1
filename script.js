// ===================================
// STATE MANAGEMENT
// ===================================

let isActive = false;

// ===================================
// SHARED HELPERS
// ===================================

function resetRiskValue() {
    const riskValue = document.getElementById('risk-value');
    if (!riskValue) return;
    if (riskValue.dataset.burstTimer) clearTimeout(parseInt(riskValue.dataset.burstTimer));
    riskValue.classList.remove('risk-warning', 'risk-burst');
    riskValue.textContent = 'MEDIUM';
}

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializePromptInteraction();
    initializeInfoModal();
    initializeSystemCorruption();
    initializeMonitorScan();
    initializeGridInteraction();
    initializeTopRightGlitch();
    initializeGridParallax();
    restoreInitializedState();
    initializeFocusRecovery();
});

// ===================================
// PROMPT INTERACTION
// ===================================

function initializePromptInteraction() {
    const promptLine = document.getElementById('prompt-line');

    promptLine.addEventListener('click', () => {
        if (!isActive) {
            activateSystem();
        }
    });
}

function activateSystem() {
    isActive = true;

    const promptLine = document.getElementById('prompt-line');
    const promptText = document.getElementById('prompt-text');
    const cursor = document.getElementById('cursor');
    const promptResponse = document.getElementById('prompt-response');
    const networkMap = document.getElementById('network-map');

    // Persist initialized state for this session
    sessionStorage.setItem('os_initialized', 'true');

    // Mark prompt as active
    promptLine.classList.add('active');

    // Fast blink cursor for 1 second
    cursor.classList.add('fast-blink');
    setTimeout(() => {
        cursor.classList.remove('fast-blink');
    }, 1000);

    // Change prompt text
    setTimeout(() => {
        promptText.textContent = 'prompt received';
    }, 300);

    // Show response lines
    setTimeout(() => {
        promptResponse.classList.remove('hidden');
        // Show raw system hud
        const hud = document.getElementById('system-hud');
        if (hud) {
            hud.classList.remove('hidden');
        }
    }, 600);

    // Show network map with fade-in
    const networkSection = document.getElementById('network-section');
    setTimeout(() => {
        networkSection.classList.remove('hidden');
        // Trigger fade-in
        setTimeout(() => {
            networkSection.classList.add('visible');
            initializeNetworkMap();
        }, 50);
    }, 900);
}

// ===================================
// SESSION RESTORE
// ===================================

function restoreInitializedState() {
    if (sessionStorage.getItem('os_initialized') !== 'true') return;

    isActive = true;

    // Restore prompt to its post-activation state
    const promptLine = document.getElementById('prompt-line');
    const promptText = document.getElementById('prompt-text');
    const cursor = document.getElementById('cursor');
    const promptResponse = document.getElementById('prompt-response');
    const networkSection = document.getElementById('network-section');
    const hud = document.getElementById('system-hud');

    if (promptLine) promptLine.classList.add('active');
    if (promptText) promptText.textContent = 'prompt received';
    if (cursor) cursor.classList.add('hidden');

    // Show supporting UI immediately (no animation delay)
    if (promptResponse) promptResponse.classList.remove('hidden');
    if (hud) hud.classList.remove('hidden');

    if (networkSection) {
        networkSection.classList.remove('hidden');
        // One micro-tick to let display:flex resolve before adding opacity
        requestAnimationFrame(() => {
            networkSection.classList.add('visible');
            initializeNetworkMap();
        });
    }
}

// ===================================
// NETWORK MAP (MAIN NAVIGATION)
// ===================================

const networkMapNodes = {
    sprache: { x: 120, y: 260, label: 'SPRACHE' },
    politik: { x: 280, y: 260, label: 'POLITIK' },
    ton: { x: 440, y: 260, label: 'TON' },
    macht: { x: 120, y: 340, label: 'MACHT' },
    bild: { x: 280, y: 340, label: 'BILD' },
    geschlecht: { x: 120, y: 420, label: 'GESCHLECHT' }
};

const networkMapConnections = [
    { from: 'sprache', to: 'politik' },
    { from: 'politik', to: 'ton' },
    { from: 'sprache', to: 'macht' },
    { from: 'macht', to: 'geschlecht' },
    { from: 'bild', to: 'ton' },
    { from: 'geschlecht', to: 'sprache' },
    { from: 'geschlecht', to: 'bild' }
];

function initializeNetworkMap() {
    const svg = document.getElementById('network-map-svg');
    const linesGroup = document.getElementById('network-map-lines');
    const nodesGroup = document.getElementById('network-map-nodes');

    if (!svg) return;

    linesGroup.innerHTML = '';
    nodesGroup.innerHTML = '';

    // Create connections (lines) first
    networkMapConnections.forEach(conn => {
        const from = networkMapNodes[conn.from];
        const to = networkMapNodes[conn.to];
        drawRightAngleLine(linesGroup, from, to, conn.from, conn.to);
    });

    // Create nodes
    Object.keys(networkMapNodes).forEach(nodeName => {
        const node = networkMapNodes[nodeName];

        const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodeGroup.classList.add('network-map-node');
        nodeGroup.setAttribute('data-module', nodeName);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', node.x);
        rect.setAttribute('y', node.y);
        rect.setAttribute('width', 120);
        rect.setAttribute('height', 32);
        rect.classList.add('node-rect');

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', node.x + 60);
        label.setAttribute('y', node.y + 20);
        label.setAttribute('text-anchor', 'middle');
        label.classList.add('node-label');
        label.textContent = node.label;

        nodeGroup.appendChild(rect);
        nodeGroup.appendChild(label);
        nodesGroup.appendChild(nodeGroup);

        // Add event listeners
        // Add event listeners
        nodeGroup.addEventListener('mouseenter', () => {
            rect.classList.add('hover');
            label.classList.add('hover');

            // Trigger Risk Warning Glitch
            const riskValue = document.getElementById('risk-value');
            if (riskValue) {
                // Clear any pending burst cleanup
                if (riskValue.dataset.burstTimer) clearTimeout(parseInt(riskValue.dataset.burstTimer));

                riskValue.textContent = 'HIGH';
                riskValue.classList.add('risk-warning', 'risk-burst');

                // Remove the burst effect after 500ms, keep the warning sustain
                const timer = setTimeout(() => {
                    riskValue.classList.remove('risk-burst');
                }, 500);
                riskValue.dataset.burstTimer = timer;
            }
        });

        nodeGroup.addEventListener('mouseleave', () => {
            rect.classList.remove('hover');
            label.classList.remove('hover');
            resetRiskValue();
        });
        nodeGroup.addEventListener('click', () => navigateToModule(nodeName));
    });
}

// ===================================
// FOCUS / VISIBILITY RECOVERY
// ===================================

function initializeFocusRecovery() {
    // On blur: reset any stuck HIGH state so the HUD is clean on return
    window.addEventListener('blur', () => {
        resetRiskValue();
    });

    // On focus return: flush pointer-events so the browser recalculates
    // hit-testing on the SVG nodes (fixes ghost-overlay issue after tab switch)
    const flushPointerEvents = () => {
        document.body.style.pointerEvents = 'none';
        setTimeout(() => {
            document.body.style.pointerEvents = '';
        }, 10);
    };

    window.addEventListener('focus', flushPointerEvents);

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            flushPointerEvents();
        }
    });
}

function drawRightAngleLine(group, from, to, fromName, toName) {
    const fromX = from.x + 60;
    const fromY = from.y + 16;
    const toX = to.x + 60;
    const toY = to.y + 16;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    let pathData;

    // SPEZIAL-ROUTE: Bild <-> Geschlecht (Exakt wie auf deiner Skizze)
    if ((fromName === 'bild' && toName === 'geschlecht') || (fromName === 'geschlecht' && toName === 'bild')) {
        const bildNode = fromName === 'bild' ? from : to;
        const geschlechtNode = fromName === 'geschlecht' ? from : to;

        // Linie geht von Bild senkrecht nach unten, dann waagerecht nach links in Geschlecht
        pathData = `M ${bildNode.x + 60} ${bildNode.y + 16} L ${bildNode.x + 60} ${geschlechtNode.y + 16} L ${geschlechtNode.x + 60} ${geschlechtNode.y + 16}`;
    }
    // Standard-Routen für alle anderen Linien
    else if (Math.abs(fromY - toY) < 5) {
        pathData = `M ${fromX} ${fromY} L ${toX} ${toY}`;
    } else {
        const midY = (fromY + toY) / 2;
        pathData = `M ${fromX} ${fromY} L ${fromX} ${midY} L ${toX} ${midY} L ${toX} ${toY}`;
    }

    path.setAttribute('d', pathData);
    path.classList.add('network-map-line');
    path.setAttribute('data-from', fromName);
    path.setAttribute('data-to', toName);

    group.appendChild(path);
}

// ===================================
// SYSTEM CORRUPTION (SUBTLE GLITCH)
// ===================================

function initializeSystemCorruption() {
    const hudLines = document.querySelectorAll('.hud-line');
    const systemLabels = document.querySelectorAll('.system-label, .system-code, .micro-label, .network-label, .hud-header');
    const networkDivider = document.querySelector('.network-divider');

    // 1. High-Frequency Divider Glitches (2-6s freq)
    function triggerDividerGlitch() {
        if (networkDivider && Math.random() < 0.8) {
            const isStrong = Math.random() < 0.15;
            const duration = 80 + Math.random() * 170;

            networkDivider.classList.add(isStrong ? 'glitch-strong' : 'jitter');

            if (Math.random() < 0.3) {
                networkDivider.style.background = 'none';
                networkDivider.innerHTML = '<span style="font-size: 8px; letter-spacing: -1px; white-space: nowrap;">-----==--——----///</span>';
            }

            setTimeout(() => {
                networkDivider.classList.remove('jitter', 'glitch-strong');
                networkDivider.innerHTML = '';
                networkDivider.style.background = '';
                setTimeout(triggerDividerGlitch, 2000 + Math.random() * 4000);
            }, duration);
        } else {
            setTimeout(triggerDividerGlitch, 2000);
        }
    }
    triggerDividerGlitch();

    // 2. Global Flicker & HUD Interaction (6-15s freq)
    setInterval(() => {
        document.body.classList.add('signal-instability');
        if (Math.random() < 0.5) {
            const randomLine = hudLines[Math.floor(Math.random() * hudLines.length)];
            if (randomLine && randomLine.textContent.includes(': ')) {
                const originalText = randomLine.textContent;
                const parts = originalText.split(': ');
                const corruptChars = ['#', '?', '!', '0', 'X'];
                const newValue = parts[1].split('').map(char =>
                    Math.random() < 0.2 ? corruptChars[Math.floor(Math.random() * corruptChars.length)] : char
                ).join('');

                randomLine.textContent = `${parts[0]}: ${newValue}`;
                setTimeout(() => {
                    randomLine.textContent = originalText;
                }, 150);
            }
        }
        setTimeout(() => {
            document.body.classList.remove('signal-instability');
        }, 180);
    }, 6000 + Math.random() * 9000);

    // 3. Minor Element Jitter (8-20s freq)
    setInterval(() => {
        const randomLabel = systemLabels[Math.floor(Math.random() * systemLabels.length)];
        if (randomLabel && Math.random() < 0.4) {
            randomLabel.style.transform = `translateX(${Math.random() > 0.5 ? '1.5px' : '-1.5px'})`;
            setTimeout(() => {
                randomLabel.style.transform = 'none';
            }, 100);
        }
    }, 8000 + Math.random() * 12000);

    // 4. Rare Risk Escalation (60-90s deterministic freq)
    function triggerRiskEscalation() {
        const riskLine = Array.from(hudLines).find(line => line.textContent.includes('RISK: MEDIUM'));
        if (riskLine) {
            setTimeout(() => {
                const originalText = riskLine.textContent;
                riskLine.textContent = 'RISK: HIGH';
                riskLine.classList.add('risk-escalated');
                setTimeout(() => {
                    riskLine.textContent = originalText;
                    riskLine.classList.remove('risk-escalated');
                    triggerRiskEscalation();
                }, 350);
            }, 60000 + Math.random() * 30000);
        } else {
            setTimeout(triggerRiskEscalation, 10000);
        }
    }
    triggerRiskEscalation();
}

function initializeMonitorScan() {
    const scanline = document.querySelector('.monitor-scan');
    if (!scanline) return;

    function triggerScan() {
        scanline.classList.add('active');
        setTimeout(() => {
            scanline.classList.remove('active');
            setTimeout(triggerScan, 4000 + Math.random() * 6000); // More frequent: 4-10s instead of 12-20s
        }, 4000);
    }
    setTimeout(triggerScan, 3000 + Math.random() * 3000);
}

// ===================================
// NAVIGATION WITH LOADING SCREEN
// ===================================

function navigateToModule(moduleName) {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingPercent = document.getElementById('loading-percent');
    const loadingLinesContainer = document.getElementById('loading-lines');

    const bootMessages = [
        { text: '> ACCESSING MODULE...', delay: 0 },
        { text: '> LOADING EVIDENCE...', delay: 200 },
        { text: '> TRACE ENABLED', delay: 400 }
    ];

    loadingScreen.classList.remove('hidden');
    loadingLinesContainer.innerHTML = '';

    bootMessages.forEach((message, index) => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = 'loading-line';
            line.textContent = message.text;
            loadingLinesContainer.appendChild(line);
        }, message.delay);
    });

    let progress = 0;
    const duration = 600;
    const interval = 10;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);
            setTimeout(() => {
                window.location.href = `modules/${moduleName}.html`;
            }, 50);
        }
        loadingBar.style.width = progress + '%';
        loadingPercent.textContent = Math.floor(progress) + '%';
    }, interval);
}

// ===================================
// INTERACTIVE GRID
// ===================================

// ===================================
// INTERACTIVE GRID
// ===================================

function initializeGridInteraction() {
    const triggers = [
        document.getElementById('network-map'),
        document.getElementById('info-trigger'),
        document.getElementById('prompt-line') // Keeping existing trigger
    ];

    const showGrid = () => document.body.classList.add('grid-active');

    const hideGrid = () => {
        // Only hide if modal is closed
        const modal = document.getElementById('info-modal');
        if (modal && modal.classList.contains('hidden')) {
            document.body.classList.remove('grid-active');
        }
    };

    triggers.forEach(trigger => {
        if (trigger) {
            trigger.addEventListener('mouseenter', showGrid);
            trigger.addEventListener('mouseleave', hideGrid);
        }
    });
}

// ===================================
// INFO MODAL
// ===================================

function initializeInfoModal() {
    const trigger = document.getElementById('info-trigger');
    const modal = document.getElementById('info-modal');
    const closeBtn = document.getElementById('info-close');

    if (!trigger || !modal) return;

    trigger.addEventListener('click', () => {
        openModal(modal);
    });

    closeBtn.addEventListener('click', () => {
        closeModal(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal(modal);
        }
    });
}

function openModal(modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('grid-active');
}

function closeModal(modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    document.body.classList.remove('grid-active');
}

// ===================================
// TOP-RIGHT LABEL GLITCH
// ===================================

function initializeTopRightGlitch() {
    const infoTrigger = document.getElementById('info-trigger');
    if (!infoTrigger) return;

    // Random micro-glitch (jitter/opacity)
    // "occasionally... 80-140ms... rare"
    function triggerGlitch() {
        if (Math.random() < 0.25) { // 25% chance every check
            infoTrigger.classList.add('glitch-pulse');

            // Remove class after 80-140ms
            const duration = 80 + Math.random() * 60;
            setTimeout(() => {
                infoTrigger.classList.remove('glitch-pulse');
            }, duration);
        }

        // Next check: randomized timing
        // "never constant"
        const nextTime = 2000 + Math.random() * 5000;
        setTimeout(triggerGlitch, nextTime);
    }

    // Start loop
    setTimeout(triggerGlitch, 3000);

    // Stronger glitch on hover?
    // "slightly stronger on hover"
    // We handle this via CSS or JS?
    // User: "Add occasional micro-glitch even when idle (rare), and slightly stronger on hover"
    // Implementation preference: "Minimal JS that randomly toggles .glitch-pulse"
    // If we want it stronger on hover, we can just trigger it more frequently on hover or add a subclass.
    // Let's increase frequency on hover.

    let hoverInterval;

    infoTrigger.addEventListener('mouseenter', () => {
        // Trigger immediately
        infoTrigger.classList.add('glitch-pulse');
        setTimeout(() => infoTrigger.classList.remove('glitch-pulse'), 120);

        // Start frequent glitching
        hoverInterval = setInterval(() => {
            if (Math.random() < 0.4) {
                infoTrigger.classList.add('glitch-pulse');
                setTimeout(() => infoTrigger.classList.remove('glitch-pulse'), 100);
            }
        }, 600);
    });

    infoTrigger.addEventListener('mouseleave', () => {
        if (hoverInterval) clearInterval(hoverInterval);
        infoTrigger.classList.remove('glitch-pulse');
    });
}

// ===================================
// BACKGROUND GRID PARALLAX
// ===================================

function initializeGridParallax() {
    const grids = document.querySelectorAll('.grid-plate');
    if (grids.length === 0) return;

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        grids.forEach(grid => {
            grid.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
        });
    });
}
