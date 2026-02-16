import requests
import json

def translate_to_arabic(text):
    if not text:
        return ""

    try:
        with open('secrets.json', 'r') as f:
            secrets = json.load(f)
            # Use GrokOPenRouterKEy as primary if available
            api_key = secrets.get('GrokOPenRouterKEy', "")
            if not api_key:
                api_key = secrets.get('OPENROUTER_API_KEY', "")
    except Exception as e:
        print(f"Error loading secrets.json: {e}")
        return text

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Using gpt-4o-mini which is superior for structured translation and handles HTML well.
    payload = {
        "model": "openai/gpt-oss-20b",
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a professional English-to-Arabic translator. "
                    "Translate the provided text into fluent Arabic. "
                    "CRITICAL: If the input contains HTML tags (like <div>, <b>, <p>, etc.), you MUST preserve every single tag and attribute exactly where they are. "
                    "Only translate the text inside the tags. Do not remove, move, or change any HTML tags. "
                    "Do NOT add any preamble or extra text. Output ONLY the translated Arabic content."
                )
            },
            {
                "role": "user",
                "content": text
            }
        ]
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        
        # Log for backend debugging
        with open('backend_translation_debug.txt', 'a', encoding='utf-8') as debug_file:
            debug_file.write(f"--- Translation Attempt ---\n")
            debug_file.write(f"Input: {text[:100]}...\n")
            debug_file.write(f"Status: {response.status_code}\n")
            if response.status_code != 200:
                debug_file.write(f"Error Body: {response.text}\n")
            else:
                debug_file.write(f"Result: {response.json().get('choices', [{}])[0].get('message', {}).get('content', '')[:50]}...\n")

        if response.status_code != 200:
            print(f"Translation API error {response.status_code}")
            return text
            
        result = response.json()
        if 'choices' in result and len(result['choices']) > 0:
            return result['choices'][0]['message']['content'].strip()
        
        return text
            
    except Exception as e:
        print(f"Translation exception: {e}")
        return text

if __name__ == "__main__":
    import sys
    # Force UTF-8 for stdin/stdout on Windows
    if hasattr(sys.stdin, 'reconfigure'):
        sys.stdin.reconfigure(encoding='utf-8')
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')

    # If data is piped in, read from stdin
    if not sys.stdin.isatty():
        sample_text = sys.stdin.read().strip()
        if sample_text:
            translated = translate_to_arabic(sample_text)
            # Output ONLY the translation for the C# bridge
            print(translated)
        else:
            print("")
    else:
        # Interactive mode for manual testing
        sample_text = "The Arabian horse is a breed of horse that originated on the Arabian Peninsula."
        print("Original:", sample_text)
        translated = translate_to_arabic(sample_text)
        print("Translated:", translated)
