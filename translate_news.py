import requests
import json

def translate_to_arabic(text):
    if not text:
        return ""

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": "Bearer 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",
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
