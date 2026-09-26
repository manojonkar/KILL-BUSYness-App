import json
import os
import asyncio
import edge_tts
import re

async def generate_audio():
    # Load JSON
    json_path = r"C:\KILL BUSYness Website\kill-busyness-app\web\public\data\all_modules.json"
    audio_dir = r"C:\KILL BUSYness Website\kill-busyness-app\web\public\audio"
    
    if not os.path.exists(audio_dir):
        os.makedirs(audio_dir)
        
    with open(json_path, 'r', encoding='utf-8') as f:
        modules = json.load(f)
        
    voice = "en-IN-PrabhatNeural" # Professional, authoritative Indian male voice
    
    print(f"Found {len(modules)} modules. Starting audio generation...")
    
    for m in modules:
        linear_id = m.get('linear_id')
        text = m.get('core_lesson', '')
        
        # Clean text: remove markdown tags, images, etc.
        text = re.sub(r'!\[.*?\]\(.*?\)', '', text) # remove images
        text = re.sub(r'[#*`_\|-]', '', text) # remove markdown symbols
        text = text.strip()
        
        if not text:
            continue
            
        output_file = os.path.join(audio_dir, f"module_{linear_id}.mp3")
        
        if os.path.exists(output_file):
            continue # skip if already generated
            
        print(f"Generating audio for Module {linear_id}...")
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_file)

if __name__ == "__main__":
    asyncio.run(generate_audio())
