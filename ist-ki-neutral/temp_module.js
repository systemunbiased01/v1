
// ===================================
// SPRACHE MODULE INTERACTION (REDESIGN)
// ===================================

function initializeSpracheModule() {
    const container = document.getElementById('sprache-system');
    if (!container) return;

    // Analysis Layer Trigger
    container.addEventListener('mousemove', (e) => {
        const y = e.clientY / window.innerHeight;
        // If mouse is in bottom 30%, show analysis
        const analysis = document.querySelector('.layer-analysis');
        if (analysis) {
            if (y > 0.7) {
                analysis.style.opacity = '1';
                analysis.style.transform = 'translateX(-50%) translateY(0)';
            } else {
                analysis.style.opacity = '0';
                analysis.style.transform = 'translateX(-50%) translateY(20px)';
            }
        }
    });

    // Live Clock & Status
    setInterval(() => {
        const timeEl = document.getElementById('sys-time');
        const riskEl = document.getElementById('sys-risk');
        if (timeEl) {
            const now = new Date();
            const timeStr = now.getHours().toString().padStart(2, '0') + ':' +
                now.getMinutes().toString().padStart(2, '0') + ':' +
                now.getSeconds().toString().padStart(2, '0');
            timeEl.innerText = 'SYS_TIME: ' + timeStr;
        }

        // Random Status Glitch
        if (riskEl && Math.random() < 0.1) {
            riskEl.innerText = 'RISK_LEVEL: CALC...';
            setTimeout(() => { if (riskEl) riskEl.innerText = 'RISK_LEVEL: MONITORING'; }, 500);
        }

    }, 1000);
}

// Global functions for inline calls in sprache.html
window.toggleEvidence = function (show) {
    const overlay = document.getElementById('evidence-overlay');
    if (overlay) {
        if (show) {
            overlay.classList.add('visible');
        } else {
            overlay.classList.remove('visible');
        }
    }
};

window.viewEvidence = function (id) {
    console.log("Viewing evidence: " + id);
    alert("> ACCESSING SECURE FILE: " + id + "\n> PERMISSION GRANTED.");
};

// Initialize if on the page
document.addEventListener('DOMContentLoaded', initializeSpracheModule);
