import json
import os
import asyncio
import edge_tts
import re

async def generate_female_audio():
    json_path = r"C:\KILL BUSYness Website\kill-busyness-app\web\public\data\all_modules.json"
    audio_dir = r"C:\KILL BUSYness Website\kill-busyness-app\web\public\audio"
    
    with open(json_path, 'r', encoding='utf-8') as f:
        modules = json.load(f)
        
    voice = "en-IN-NeerjaNeural" # Professional Indian female voice
    
    for m in modules:
        linear_id = m.get('linear_id')
        if linear_id == 2:
            text = m.get('core_lesson', '')
            # Clean text
            text = re.sub(r'!\[.*?\]\(.*?\)', '', text)
            text = re.sub(r'[#*`_\|-]', '', text)
            text = text.strip()
            
            output_file = os.path.join(audio_dir, f"module_{linear_id}.mp3")
            print(f"Generating Female Audio for Module {linear_id}...")
            
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(output_file)
            print("Done!")
            break

if __name__ == "__main__":
    asyncio.run(generate_female_audio())
