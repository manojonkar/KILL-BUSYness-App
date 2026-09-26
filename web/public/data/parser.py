import json
import re

with open(r'C:\KILL BUSYness Website\kill-busyness-app\web\public\data\book_full.md', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('?T', '\'')

modules = []
linear_id = 1

def add_module(chapter, title, content, phase, reflection='How does this apply to your organization?'):
    global linear_id
    id_str = re.sub(r'[^a-z0-9]+', '_', title.lower()).strip('_')
    if not id_str:
        id_str = f'module_{linear_id}'
    
    # Optional phase assignment based on chapter
    if chapter in ['1', '2', '3', '4', '5', 'Introduction']:
        phase = 'Reflect'
    elif chapter in ['6']:
        phase = 'Own'
    elif chapter in ['7', '8']:
        phase = 'Assert'
    else:
        phase = 'Run'
        
    modules.append({
        'id': id_str,
        'chapter': chapter,
        'title': title,
        'core_lesson': content.strip(),
        'reflection_question': reflection,
        'phase': phase,
        'linear_id': linear_id
    })
    linear_id += 1

# 1. Foreword
fw_match = re.search(r'### Foreword\s+(.*?)(?=\n### Praise & Recommendations)', text, re.DOTALL)
if fw_match:
    add_module('Foreword', 'Foreword', fw_match.group(1), 'Reflect')

# 2. Praise
pr_match = re.search(r'### Praise & Recommendations\s+(.*?)(?=\n### Why This Book)', text, re.DOTALL)
if pr_match:
    pr_text = pr_match.group(1)
    parts = re.split(r'”\s+', pr_text)
    for p in parts:
        p = p.strip()
        if not p: continue
        if p.startswith('“'): p = p[1:]
        
        lines = p.split('\n\n')
        if len(lines) > 1:
            quote = '\n\n'.join(lines[:-1])
            person = lines[-1].strip()
        else:
            quote = lines[0]
            person = 'Testimonial'
            
        add_module('Praise & Recommendations', person, quote, 'Reflect')

# Chapters map
chapters_pattern = [
    ('Introduction', r'### Introduction: Reinventing Management'),
    ('1', r'1\s*\n+### The BUSYness Mirror|1\s*\n+The BUSYness Mirror|### The BUSYness Mirror'),
    ('2', r'2\s*\n+Purpose'),
    ('3', r'3\s*\n+Strategy'),
    ('4', r'4\s*\n+### The Competency Chain|4\s*\n+The Competency Chain|### The Competency Chain'),
    ('5', r'5\s*\n+### Reflection|5\s*\n+Reflection|### Reflection'),
    ('6', r'6\s*\n+Ownership'),
    ('7', r'7\s*\n+### Leadership Creates|7\s*\n+Leadership Creates|### Leadership Creates'),
    ('8', r'8\s*\n+### Assert the Standard|8\s*\n+Assert the Standard|### Assert the Standard'),
    ('9', r'9\s*\n+Build'),
    ('10', r'# 10\s*\n+### Sustaining Greatness')
]

indices = []
for ch_name, pat in chapters_pattern:
    m = re.search(pat, text)
    if m:
        indices.append((ch_name, m.start()))

indices.sort(key=lambda x: x[1])

for i in range(len(indices)):
    ch_name, start = indices[i]
    end = indices[i+1][1] if i+1 < len(indices) else len(text)
    ch_text = text[start:end]
    
    # Split by subheaders #### or #####
    sub_parts = re.split(r'\n(####\s+.*|#####\s+.*)', ch_text)
    
    intro = sub_parts[0].strip()
    if intro:
        lines = intro.split('\n')
        title = lines[0].replace('#', '').strip() if lines[0].startswith('#') else ch_name
        add_module(ch_name, title, intro, 'Reflect')
        
    for j in range(1, len(sub_parts), 2):
        header = sub_parts[j].replace('#', '').strip()
        content = sub_parts[j] + (sub_parts[j+1] if j+1 < len(sub_parts) else '')
        add_module(ch_name, header, content, 'Reflect')

with open(r'C:\KILL BUSYness Website\kill-busyness-app\web\public\data\all_modules.json', 'w', encoding='utf-8') as f:
    json.dump(modules, f, indent=2, ensure_ascii=False)
print('Done!')
