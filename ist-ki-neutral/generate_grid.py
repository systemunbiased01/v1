import random

h_lines = [71.76, 153.8, 235.83, 317.87, 396.71, 478.75]
v_lines = [84.06, 178.17, 268.06, 362.17, 456.06, 550.17, 630.17]
width = 703
height = 478.75

def generate_svg(seed):
    random.seed(seed)
    # Using specific class names that match the styling plan
    # SVG viewBox matches original grid.svg
    svg = []
    
    # Static Lines Group
    svg.append('  <g class="grid-lines">')
    for y in h_lines:
        svg.append(f'    <line x1="0" y1="{y}" x2="{width}" y2="{y}" />')
    for x in v_lines:
        svg.append(f'    <line x1="{x}" y1="0" x2="{x}" y2="{height}" />')
    svg.append('  </g>')

    # Animate Ends Group (breathes)
    svg.append('  <g class="grid-ends">')
    for y in h_lines:
        # Left side extension
        if random.random() > 0.3:
            delay = random.uniform(0, 5)
            duration = random.uniform(3, 6)
            # Lines extend outwards from 0 to negative
            svg.append(f'    <line class="breath-h-left" x1="0" y1="{y}" x2="0" y2="{y}" style="--delay: -{delay:.2f}s; --duration: {duration:.2f}s" />')
        # Right side extension
        if random.random() > 0.3:
            delay = random.uniform(0, 5)
            duration = random.uniform(3, 6)
            # Lines extend outwards from width to positive
            svg.append(f'    <line class="breath-h-right" x1="{width}" y1="{y}" x2="{width}" y2="{y}" style="--delay: -{delay:.2f}s; --duration: {duration:.2f}s" />')
    
    for x in v_lines:
        # Top side extension
        if random.random() > 0.3:
            delay = random.uniform(0, 5)
            duration = random.uniform(3, 6)
            svg.append(f'    <line class="breath-v-top" x1="{x}" y1="0" x2="{x}" y2="0" style="--delay: -{delay:.2f}s; --duration: {duration:.2f}s" />')
        # Bottom side extension
        if random.random() > 0.3:
            delay = random.uniform(0, 5)
            duration = random.uniform(3, 6)
            svg.append(f'    <line class="breath-v-bottom" x1="{x}" y1="{height}" x2="{x}" y2="{height}" style="--delay: -{delay:.2f}s; --duration: {duration:.2f}s" />')
    svg.append('  </g>')

    # Dots Group (pulses)
    svg.append('  <g class="grid-dots">')
    for y in h_lines:
        for x in v_lines:
            op = random.uniform(0.4, 0.9)
            delay = random.uniform(0, 4)
            svg.append(f'    <circle cx="{x}" cy="{y}" r="3" style="opacity: {op}; animation-delay: -{delay:.2f}s" />')
    svg.append('  </g>')
    
    return '\n'.join(svg)

print('---LEFT_START---')
print(generate_svg(42))
print('---LEFT_END---')
print('---RIGHT_START---')
print(generate_svg(101))
print('---RIGHT_END---')
