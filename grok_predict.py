import sys
import json
import requests
import os

def grok_predict():
    try:
        # Read JSON from stdin
        input_data = json.load(sys.stdin)
        
        traits = input_data.get('traits', {})
        image_data = input_data.get('image_data') # Base64 string
        ml_prediction = input_data.get('ml_prediction')
        
        # Load API key
        api_key = ""
        base_dir = os.path.dirname(os.path.abspath(__file__))
        secrets_path = os.path.join(base_dir, 'secrets.json')
        try:
            with open(secrets_path, 'r') as f:
                secrets = json.load(f)
                api_key = secrets.get('GrokOPenRouterKEy', "")
        except Exception as e:
            print(json.dumps({"error": f"Error loading secrets.json: {str(e)}", "status": "error"}))
            return

        if not api_key:
            print(json.dumps({"error": "OpenRouter API Key not found.", "status": "error"}))
            return

        # Prepare prompt
        trait_str = ", ".join([f"{k}: {v}" for k, v in traits.items()])
        prompt = f"The horse has following traits: {trait_str}. A machine learning model predicted it is a '{ml_prediction}'."
        
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        # System prompt requested by user - updated for Arabic and structured format
        system_prompt = (
            "You are a horse breeder viewer that sees the horse with the given information and determines if it is true or not. "
            "You MUST respond in JSON format with two keys: 'matches' (boolean) and 'feedback' (string). "
            "If the ML prediction is correct, set matches to true, just say the breed again in the feedback and tell one sentence of information about it. "
            "If the ML prediction is incorrect, set matches to false, say 'The correct breed is ...' in the feedback and say one line of information about that breed. "
            "Search to get the correct information. Your feedback MUST be in Arabic."
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_data}"
                        }
                    }
                ]
            }
        ]

        payload = {
            "model": "x-ai/grok-4.1-fast", 
            "messages": messages,
            "response_format": { "type": "json_object" }
        }

        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 402:
            print(json.dumps({"error": "OpenRouter account balance too low (402). Please top up.", "status": "error"}))
            return
            
        if response.status_code != 200:
            print(json.dumps({"error": f"OpenRouter API error {response.status_code}: {response.text}", "status": "error"}))
            return

        result = response.json()
        
        if 'choices' in result and len(result['choices']) > 0:
            content = result['choices'][0]['message']['content'].strip()
            # Attempt to parse as JSON, Grok should follow response_format
            try:
                grok_json = json.loads(content)
                print(json.dumps({
                    "feedback": grok_json.get("feedback", ""),
                    "matches": grok_json.get("matches", True),
                    "status": "success"
                }))
            except:
                # Fallback if JSON parsing fails
                print(json.dumps({"feedback": content, "matches": True, "status": "success"}))
        else:
            print(json.dumps({"error": "No response from Grok", "status": "error"}))
            
    except Exception as e:
        print(json.dumps({"error": str(e), "status": "error"}))

if __name__ == "__main__":
    grok_predict()
