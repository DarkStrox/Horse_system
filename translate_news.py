import requests
import json

def translate_to_arabic(text):
    if not text:
        return ""

    try:
        with open('secrets.json', 'r') as f:
            secrets = json.load(f)
            api_key = secrets.get('OPENROUTER_API_KEY', "")
    except Exception as e:
        print(f"Error loading secrets.json: {e}")
        return text

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Using a popular free model. NOTE: OpenRouter often requires a non-zero balance
    # to access free models to prevent abuse. Error 402 means you need to top up.
    payload = {
        "model": "google/gemini-2.0-flash-exp:free",
        "messages": [
            {
                "role": "system",
                "content": "You are a professional translator. Translate the following text to Arabic. Output ONLY the translated text."
            },
            {
                "role": "user",
                "content": text
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 402:
            print("Error 402: OpenRouter requires a non-zero balance to use free models. Please top up your account.")
            return text
            
        response.raise_for_status()
        result = response.json()
        
        if 'choices' in result and len(result['choices']) > 0:
            return result['choices'][0]['message']['content'].strip()
        return text
            
    except Exception as e:
        print(f"Translation error: {e}")
        return text

if __name__ == "__main__":
    sample_text = "The Arabian horse is a breed of horse that originated on the Arabian Peninsula."
    print("Original:", sample_text)
    translated = translate_to_arabic(sample_text)
    print("Translated:", translated)
