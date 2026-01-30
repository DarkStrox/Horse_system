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
        return ""

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "xiaomi/mimo-v2-flash:free",
        "messages": [
            {
                "role": "system",
                "content": "You are a professional translator. Translate the following text to Arabic. Be direct and output ONLY the translated text without any preamble or explanations."
            },
            {
                "role": "user",
                "content": text
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status() # Raise an exception for bad status codes
        
        result = response.json()
        if 'choices' in result and len(result['choices']) > 0:
            return result['choices'][0]['message']['content'].strip()
        else:
            return text # Fallback to original text if no choice returned
            
    except Exception as e:
        print(f"Error converting to Arabic: {e}")
        return text # Fallback

if __name__ == "__main__":
    # Example usage
    sample_text = "The Arabian horse is a breed of horse that originated on the Arabian Peninsula."
    print("Original:", sample_text)
    translated = translate_to_arabic(sample_text)
    print("Translated:", translated)
