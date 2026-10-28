import os
import zipfile
import re

dist_dir = 'dist'
assets_dir = os.path.join(dist_dir, 'assets')
public_dir = 'public'

# Find JS and CSS files
js_file = None
css_file = None

for f in os.listdir(assets_dir):
    if f.endswith('.js'):
        js_file = os.path.join(assets_dir, f)
    elif f.endswith('.css'):
        css_file = os.path.join(assets_dir, f)

print(f"Found JS: {js_file}, CSS: {css_file}")

with open(js_file, 'r', encoding='utf-8') as f:
    js_content = f.read()

with open(css_file, 'r', encoding='utf-8') as f:
    css_content = f.read()

with open(os.path.join(dist_dir, 'index.html'), 'r', encoding='utf-8') as f:
    html_template = f.read()

# 1. Create single-file HTML where CSS and JS are completely inlined
# Remove script and link tags pointing to external assets
clean_html = re.sub(r'<script type="module" crossorigin src="/assets/[^"]+"></script>', '', html_template)
clean_html = re.sub(r'<link rel="stylesheet" crossorigin href="/assets/[^"]+">', '', clean_html)

single_file_html = clean_html.replace(
    '</head>',
    f'<style>\n{css_content}\n</style>\n</head>'
).replace(
    '</body>',
    f'<script>\n{js_content}\n</script>\n</body>'
)

standalone_path = os.path.join(dist_dir, 'sentence_dice_standalone.html')
with open(standalone_path, 'w', encoding='utf-8') as f:
    f.write(single_file_html)

# Also create relative index.html
relative_html = html_template.replace('src="/assets/', 'src="./assets/').replace('href="/assets/', 'href="./assets/')
with open(os.path.join(dist_dir, 'index_relative.html'), 'w', encoding='utf-8') as f:
    f.write(relative_html)

# Create README.txt
readme_text = """============================================================
Sentence Dice 句子骰子 - Classroom Chinese Learning Game
============================================================

HOW TO USE / 使用说明:

Option 1 (Easiest - Single File / 最简单直接双击打开):
- Simply double-click "sentence_dice_standalone.html" in any web browser 
  (Chrome, Safari, Edge, Firefox, Smartboard browser).
  No server or installation required! Works completely offline.

Option 2 (Standard Web Folder / 网页文件夹):
- Open "index_relative.html" or host the folder on any classroom web server.

Features included:
- Tactile 3D tumbling Chinese dice for all 6 categories (Subject, Time, Location, Modifier, Verb, Object)
- Preposition 在 added to all Location vocabulary
- Speech Synthesis (Read Aloud 朗读) in standard Mandarin (zh-CN)
- Sentence Line with draggable slots and punctuation tray
- Full Vocabulary Selector covering Lessons 1 through 11
- Offline persistence (localStorage)

Designed for middle school Chinese language classrooms.
"""

with open(os.path.join(dist_dir, 'README.txt'), 'w', encoding='utf-8') as f:
    f.write(readme_text)

# 2. Package everything into sentence-dice-game.zip
os.makedirs(public_dir, exist_ok=True)
zip_path = os.path.join(public_dir, 'sentence-dice-game.zip')

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    zf.write(standalone_path, 'sentence_dice_standalone.html')
    zf.write(os.path.join(dist_dir, 'index_relative.html'), 'index.html')
    zf.write(os.path.join(dist_dir, 'README.txt'), 'README.txt')
    for root, _, files in os.walk(assets_dir):
        for file in files:
            full_path = os.path.join(root, file)
            arcname = os.path.relpath(full_path, dist_dir)
            zf.write(full_path, arcname)

print(f"Created {zip_path} successfully! Size: {os.path.getsize(zip_path)} bytes")
