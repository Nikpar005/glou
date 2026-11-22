import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RES = ROOT / 'android/app/src/main/res'
OUT = ROOT / 'resources/icons'

DROP = 'M54 16C69.5 36.5 90 52.5 90 76.5a36 36 0 0 1-72 0C18 52.5 38.5 36.5 54 16z'

VARIANTS = {
    'classic': {'bg': ('#070b26', '#2b2468'), 'drop': ('#e6f8ff', '#8fd7f4', '#3a9fd6'), 'ink': '#0b1030', 'stars': '#ffe7a3', 'wink': True},
    'night': {'bg': ('#06192b', '#0f4c75'), 'drop': ('#c9f1ff', '#5cc6ef', '#1d86c4'), 'ink': '#0b2a42', 'stars': None, 'wink': False},
    'sunset': {'bg': ('#7a2140', '#f08a5d'), 'drop': ('#fff5ec', '#ffd2b8', '#f29a7a'), 'ink': '#4a1726', 'stars': '#fff3c4', 'wink': True},
    'mint': {'bg': ('#0c3b33', '#2f9e7f'), 'drop': ('#f0fffa', '#a8f0d6', '#4cc3a0'), 'ink': '#0c3b33', 'stars': None, 'wink': False},
}


def stars(color):
    if not color:
        return ''
    return (f'<g fill="{color}"><path d="M80 26l1.1 2.7 2.7 1.1-2.7 1.1-1.1 2.7-1.1-2.7-2.7-1.1 2.7-1.1z"/>'
            '<circle cx="27" cy="29" r="0.9"/><circle cx="86" cy="42" r="0.7"/></g>')


def background(v):
    a, b = v['bg']
    return (f'<radialGradient id="bg" cx="0.5" cy="0.3" r="0.8"><stop offset="0" stop-color="{b}"/><stop offset="1" stop-color="{a}"/></radialGradient>'
            f'<rect x="0" y="0" width="108" height="108" fill="url(#bg)"/>{stars(v["stars"])}')


def foreground(v):
    a, b, edge = v['drop']
    ink = v['ink']
    right = (f'<path d="M58.6 71.4q5-5.4 10 0" stroke="{ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>' if v['wink']
             else f'<ellipse cx="63.5" cy="70" rx="4.8" ry="6.2" fill="{ink}"/><circle cx="65.3" cy="67.6" r="2" fill="#fff"/>')
    return (f'<radialGradient id="dr" cx="0.36" cy="0.4" r="0.8"><stop offset="0" stop-color="{a}"/><stop offset="0.65" stop-color="{b}"/><stop offset="1" stop-color="{edge}"/></radialGradient>'
            f'<path d="{DROP}" fill="url(#dr)"/>'
            '<path d="M31 58c2-9 7-17 13-24" stroke="#fff" stroke-width="4.2" stroke-linecap="round" fill="none" opacity="0.9"/>'
            '<circle cx="30.5" cy="66" r="1.8" fill="#fff" opacity="0.85"/>'
            f'<ellipse cx="44.5" cy="70" rx="4.8" ry="6.2" fill="{ink}"/><circle cx="46.3" cy="67.6" r="2" fill="#fff"/>{right}'
            f'<path d="M48.5 81q5.5 5.4 11 0" stroke="{ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
            '<ellipse cx="36" cy="80" rx="4.4" ry="2.6" fill="#ff9fb0" opacity="0.55"/><ellipse cx="72" cy="80" rx="4.4" ry="2.6" fill="#ff9fb0" opacity="0.55"/>')


def svg(body, view='0 0 108 108'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}">{body}</svg>'


def scaled_foreground(v):
    return f'<g transform="translate(54 58) scale(0.72) translate(-54 -58)">{foreground(v)}</g>'


def full(v, shape=None):
    body = background(v) + foreground(v)
    if shape == 'round':
        return svg(f'<clipPath id="r"><circle cx="54" cy="54" r="36"/></clipPath><g clip-path="url(#r)">{body}</g>', '18 18 72 72')
    if shape == 'rounded':
        return svg(f'<clipPath id="r"><rect x="18" y="18" width="72" height="72" rx="17"/></clipPath><g clip-path="url(#r)">{body}</g>', '18 18 72 72')
    return svg(body, '18 18 72 72')


def render(content, path, size):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = OUT / '_tmp.svg'
    tmp.write_text(content)
    subprocess.run(['rsvg-convert', '-w', str(size), '-h', str(size), str(tmp), '-o', str(path)], check=True)
    tmp.unlink()


FACES = {
    'happy': '<ellipse cx="44.5" cy="70" rx="4.8" ry="6.2" fill="#0b2a42"/><ellipse cx="63.5" cy="70" rx="4.8" ry="6.2" fill="#0b2a42"/>'
             '<circle cx="46.3" cy="67.6" r="2" fill="#fff"/><circle cx="65.3" cy="67.6" r="2" fill="#fff"/>'
             '<path d="M48.5 81q5.5 5.4 11 0" stroke="#0b2a42" stroke-width="2.6" fill="none" stroke-linecap="round"/>',
    'thirsty': '<path d="M38 63.4l8 -2.6M70 63.4l-8 -2.6" stroke="#0b2a42" stroke-width="2.2" stroke-linecap="round"/>'
               '<ellipse cx="44.5" cy="70" rx="4.4" ry="5.6" fill="#0b2a42"/><ellipse cx="63.5" cy="70" rx="4.4" ry="5.6" fill="#0b2a42"/>'
               '<circle cx="46" cy="67.8" r="1.8" fill="#fff"/><circle cx="65" cy="67.8" r="1.8" fill="#fff"/>'
               '<ellipse cx="54" cy="83" rx="3.2" ry="3.8" fill="#0b2a42"/>'
               '<path d="M80 40c2.6 4 4.6 6.4 4.6 9a4.6 4.6 0 0 1-9.2 0c0-2.6 2-5 4.6-9z" fill="#8fd7f4"/>',
    'proud': '<path d="M39.5 71q5-6 10 0M58.5 71q5-6 10 0" stroke="#0b2a42" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
             '<path d="M47 78.5q7 12 14 0z" fill="#0b2a42"/><path d="M50.5 83.6q3.5 2.2 7 0q-3.5 2.8-7 0z" fill="#ff8aa0"/>'
             '<path d="M80 30l1.4 3.4 3.4 1.4-3.4 1.4-1.4 3.4-1.4-3.4-3.4-1.4 3.4-1.4z" fill="#ffd166"/>',
}


def notification_face(mood):
    body = ('<radialGradient id="dr" cx="0.36" cy="0.4" r="0.8"><stop offset="0" stop-color="#e6f8ff"/>'
            '<stop offset="0.65" stop-color="#8fd7f4"/><stop offset="1" stop-color="#3a9fd6"/></radialGradient>'
            f'<path d="{DROP}" fill="url(#dr)"/>'
            '<path d="M31 58c2-9 7-17 13-24" stroke="#fff" stroke-width="4.2" stroke-linecap="round" fill="none" opacity="0.9"/>'
            f'{FACES[mood]}'
            '<ellipse cx="36" cy="80" rx="4.4" ry="2.6" fill="#ff9fb0" opacity="0.55"/><ellipse cx="72" cy="80" rx="4.4" ry="2.6" fill="#ff9fb0" opacity="0.55"/>')
    return svg(body, '3 14 102 102')


DENSITIES = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, v in VARIANTS.items():
        suffix = '' if name == 'classic' else f'_{name}'
        (OUT / f'{name}.svg').write_text(full(v, 'rounded'))
        for density, scale in DENSITIES.items():
            folder = RES / f'mipmap-{density}'
            render(full(v, 'rounded'), folder / f'ic_launcher{suffix}.png', int(48 * scale))
            render(full(v, 'round'), folder / f'ic_launcher{suffix}_round.png', int(48 * scale))
            render(svg(scaled_foreground(v)), folder / f'ic_launcher{suffix}_foreground.png', int(108 * scale))
            render(svg(background(v)), folder / f'ic_launcher{suffix}_background.png', int(108 * scale))
        render(full(v, 'rounded'), ROOT / f'public/icons/{name}.png', 192)
    render(full(VARIANTS['classic'], 'rounded'), ROOT / 'public/icon-512.png', 512)
    for mood in FACES:
        render(notification_face(mood), RES / 'drawable-nodpi' / f'glou_{mood}.png', 256)
    print('icons written', file=sys.stderr)


if __name__ == '__main__':
    main()
