from pathlib import Path
from PIL import Image, ImageDraw
import json

root = Path('docs/qa')
routes = json.loads(Path('src/data/pages.json').read_text(encoding='utf-8'))
slugs = [('home' if p['route'] == '/' else ('insights' if p['name'] == 'INSIGHTS' else p['route'].strip('/').replace('/', '-'))) for p in routes] + ['design-foundation', 'insights-template', '404']
for group in range(5):
    sheet = Image.new('RGB', (2000, 1360), '#ddd')
    draw = ImageDraw.Draw(sheet)
    for row, slug in enumerate(slugs[group*4:group*4+4]):
        x = 0
        for width in [390, 768, 1280, 1440, 1920]:
            im = Image.open(root / 'final' / f'{slug}-{width}-viewport.png').convert('RGB')
            im.thumbnail((540, 300))
            draw.text((x+5, row*340+5), f'{slug} / {width}', fill='#111')
            sheet.paste(im, (x, row*340+30))
            x += im.width+12
    sheet.save(root / f'contact-sheet-{group+1}.jpg')
