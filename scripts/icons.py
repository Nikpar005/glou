import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RES = ROOT / 'android/app/src/main/res'
OUT = ROOT / 'resources/icons'

VARIANTS = {
    'classic': {'bg': ('#0b3a5c', '#1592c0'), 'drop': ('#ffffff', '#bfeefd'), 'ink': '#0b3a5c', 'cheek': '#f6a5b0', 'sparkle': '#9fe3ff'},
    'night': {'bg': ('#0b1030', '#3a2a7a'), 'drop': ('#e8f7ff', '#8fd7f4'), 'ink': '#0b1030', 'cheek': '#f6a5b0', 'sparkle': '#ffe08a'},
    'sunset': {'bg': ('#f6b26b', '#d0503a'), 'drop': ('#ffffff', '#ffe3cc'), 'ink': '#6a2a1c', 'cheek': '#f07c8a', 'sparkle': '#fff3c4'},
    'mint': {'bg': ('#d9f6e6', '#58c294'), 'drop': ('#ffffff', '#c8f1ff'), 'ink': '#14543e', 'cheek': '#f6a5b0', 'sparkle': '#ffffff'},
}

DROP = 'M54 26C61.5 37.3 71.8 47.6 71.8 59.8a17.8 17.8 0 0 1-35.6 0C36.2 47.6 46.5 37.3 54 26z'


def background(v):
    a, b = v['bg']
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient>
<radialGradient id="l" cx="0.3" cy="0.2" r="0.8"><stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>
<rect width="108" height="108" fill="url(#g)"/><rect width="108" height="108" fill="url(#l)"/>
</svg>'''


def foreground(v):
    top, bottom = v['drop']
    ink = v['ink']
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108">
<defs><linearGradient id="d" x1="0.3" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/></linearGradient>
<radialGradient id="s" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#000" stop-opacity="0.22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="54" cy="80" rx="16" ry="3" fill="url(#s)"/>
<path d="{DROP}" fill="url(#d)"/>
<path d="M44.5 52c1.2-4.6 3.8-8.6 6.8-12.4" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.9"/>
<ellipse cx="48.6" cy="58" rx="2.1" ry="2.7" fill="{ink}"/><ellipse cx="59.4" cy="58" rx="2.1" ry="2.7" fill="{ink}"/>
<circle cx="49.4" cy="57" r="0.8" fill="#fff"/><circle cx="60.2" cy="57" r="0.8" fill="#fff"/>
<ellipse cx="45.4" cy="63" rx="2.2" ry="1.4" fill="{v['cheek']}" opacity="0.6"/><ellipse cx="62.6" cy="63" rx="2.2" ry="1.4" fill="{v['cheek']}" opacity="0.6"/>
<path d="M50.2 63.2q3.8 3.8 7.6 0" stroke="{ink}" stroke-width="1.5" stroke-linecap="round" fill="none"/>
<path d="M75 32l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="{v['sparkle']}"/>
<circle cx="33" cy="42" r="1.4" fill="{v['sparkle']}" opacity="0.8"/>
</svg>'''


def full(v):
    bg = background(v).split('\n', 1)[1].rsplit('</svg>', 1)[0]
    fg = foreground(v).split('\n', 1)[1].rsplit('</svg>', 1)[0]
    fg = fg.replace('id="d"', 'id="d2"').replace('url(#d)', 'url(#d2)').replace('id="s"', 'id="s2"').replace('url(#s)', 'url(#s2)')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="18 18 72 72">{bg}{fg}</svg>'


def render(svg, path, size, round_mask=False):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = OUT / '_tmp.svg'
    content = svg
    if round_mask:
        content = svg.replace('viewBox="18 18 72 72">', 'viewBox="18 18 72 72"><clipPath id="r"><circle cx="54" cy="54" r="36"/></clipPath><g clip-path="url(#r)">').replace('</svg>', '</g></svg>')
    tmp.write_text(content)
    subprocess.run(['rsvg-convert', '-w', str(size), '-h', str(size), str(tmp), '-o', str(path)], check=True)
    tmp.unlink()


DENSITIES = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, v in VARIANTS.items():
        suffix = '' if name == 'classic' else f'_{name}'
        (OUT / f'{name}-background.svg').write_text(background(v))
        (OUT / f'{name}-foreground.svg').write_text(foreground(v))
        (OUT / f'{name}.svg').write_text(full(v))
        for density, scale in DENSITIES.items():
            folder = RES / f'mipmap-{density}'
            render(full(v), folder / f'ic_launcher{suffix}.png', int(48 * scale))
            render(full(v), folder / f'ic_launcher{suffix}_round.png', int(48 * scale), round_mask=True)
            render(foreground(v), folder / f'ic_launcher{suffix}_foreground.png', int(108 * scale))
            render(background(v), folder / f'ic_launcher{suffix}_background.png', int(108 * scale))
        for shape in ('', '_round'):
            (RES / 'mipmap-anydpi-v26' / f'ic_launcher{suffix}{shape}.xml').write_text(
                '<?xml version="1.0" encoding="utf-8"?>\n'
                '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
                f'    <background android:drawable="@mipmap/ic_launcher{suffix}_background"/>\n'
                f'    <foreground android:drawable="@mipmap/ic_launcher{suffix}_foreground"/>\n'
                '</adaptive-icon>\n'
            )
    render(full(VARIANTS['classic']), ROOT / 'public/icon-512.png', 512)
    print('icons written', file=sys.stderr)


if __name__ == '__main__':
    main()
