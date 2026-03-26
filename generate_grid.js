const h_lines = [71.76, 153.8, 235.83, 317.87, 396.71, 478.75];
const v_lines = [84.06, 178.17, 268.06, 362.17, 456.06, 550.17, 630.17];
const width = 703;
const height = 478.75;

function generateSvg() {
    let svg = [];

    // Static Lines
    svg.push('  <g class="grid-lines">');
    h_lines.forEach(y => svg.push(`    <line x1="0" y1="${y}" x2="${width}" y2="${y}" />`));
    v_lines.forEach(x => svg.push(`    <line x1="${x}" y1="0" x2="${x}" y2="${height}" />`));
    svg.push('  </g>');

    // Animated Ends
    svg.push('  <g class="grid-ends">');
    h_lines.forEach(y => {
        if (Math.random() > 0.3) {
            let delay = (Math.random() * 5).toFixed(2);
            let duration = (Math.random() * 3 + 3).toFixed(2);
            // Left extensions
            svg.push(`    <line class="breath-h-left" x1="0" y1="${y}" x2="0" y2="${y}" style="--delay: -${delay}s; --duration: ${duration}s" />`);
        }
        if (Math.random() > 0.3) {
            let delay = (Math.random() * 5).toFixed(2);
            let duration = (Math.random() * 3 + 3).toFixed(2);
            // Right extensions
            svg.push(`    <line class="breath-h-right" x1="${width}" y1="${y}" x2="${width}" y2="${y}" style="--delay: -${delay}s; --duration: ${duration}s" />`);
        }
    });
    v_lines.forEach(x => {
        if (Math.random() > 0.3) {
            let delay = (Math.random() * 5).toFixed(2);
            let duration = (Math.random() * 3 + 3).toFixed(2);
            // Top extensions
            svg.push(`    <line class="breath-v-top" x1="${x}" y1="0" x2="${x}" y2="0" style="--delay: -${delay}s; --duration: ${duration}s" />`);
        }
        if (Math.random() > 0.3) {
            let delay = (Math.random() * 5).toFixed(2);
            let duration = (Math.random() * 3 + 3).toFixed(2);
            // Bottom extensions
            svg.push(`    <line class="breath-v-bottom" x1="${x}" y1="${height}" x2="${x}" y2="${height}" style="--delay: -${delay}s; --duration: ${duration}s" />`);
        }
    });
    svg.push('  </g>');

    // Dots
    svg.push('  <g class="grid-dots">');
    h_lines.forEach(y => {
        v_lines.forEach(x => {
            let op = (Math.random() * 0.5 + 0.4).toFixed(2);
            let delay = (Math.random() * 4).toFixed(2);
            svg.push(`    <circle cx="${x}" cy="${y}" r="3" style="opacity: ${op}; animation-delay: -${delay}s" />`);
        });
    });
    svg.push('  </g>');

    return svg.join('\n');
}

console.log('---LEFT_START---');
console.log(generateSvg());
console.log('---LEFT_END---');
console.log('---RIGHT_START---');
console.log(generateSvg());
console.log('---RIGHT_END---');
