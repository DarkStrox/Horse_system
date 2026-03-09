import sys
import json
import base64
import numpy as np
import io
import os
from PIL import Image
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications import ConvNeXtBase
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import GlobalAveragePooling2D, BatchNormalization, Dropout, Dense

# Ensure utf-8 encoding for stdout
sys.stdout.reconfigure(encoding='utf-8')

def predict_image():
    try:
        # Read JSON from file provided as argument
        if len(sys.argv) < 2:
             print(json.dumps({"error": "No input file provided.", "status": "error"}))
             return
             
        input_file = sys.argv[1]
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                input_data = json.load(f)
        except Exception as e:
            print(json.dumps({"error": f"Failed to read/parse input JSON file: {str(e)}", "status": "error"}))
            return
            
        print(f"Loaded input data, keys: {input_data.keys()}", file=sys.stderr)
        
        image_data_base64 = input_data.get('ImageData')
        if not image_data_base64:
             print(json.dumps({"error": "No image data provided.", "status": "error"}))
             return

        print("Decoding base64...", file=sys.stderr)
        # Handle data URIs (e.g., data:image/png;base64,xxxx)
        if "," in image_data_base64:
            image_data_base64 = image_data_base64.split(",")[1]
            
        # Add padding if needed
        image_data_base64 = image_data_base64 + '=' * (-len(image_data_base64) % 4)

        # Decode base64 string
        try:
            base64_decoded = base64.b64decode(image_data_base64)
        except Exception as e:
             print(json.dumps({"error": f"Failed to decode base64: {str(e)}", "status": "error"}))
             return
        
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, 'horse_breed_convnext_model.keras')
        labels_path = os.path.join(base_dir, 'class_labels.json')

        # Reconstruct the Model Architecture
        base_model = ConvNeXtBase(
            weights='imagenet', 
            include_top=False, 
            input_shape=(224, 224, 3)
        )
        
        loaded_model = Sequential([
            base_model,
            GlobalAveragePooling2D(),
            BatchNormalization(),
            Dropout(0.5),
            Dense(256, activation='gelu'),
            BatchNormalization(),
            Dropout(0.3),
            Dense(7, activation='softmax')
        ])

        # Load Weights onto built architecture to bypass Keras 3 BatchNormalization bug
        loaded_model.load_weights(model_path)

        # Load the Labels
        with open(labels_path, "r", encoding="utf-8") as f:
            class_labels = json.load(f)

        # Convert Bytes to Image and resize
        img = image.load_img(io.BytesIO(base64_decoded), target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) # Add batch dimension

        # Predict
        predictions = loaded_model.predict(img_array, verbose=0)
        predicted_class_idx = str(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0])) * 100
        
        predicted_breed = class_labels[predicted_class_idx]

        # Map to Arabic for frontend
        breed_map = {
             "Akhal-Teke": "آخال تيكي",
             "Appaloosa": "أبالوزا",
             "Arabian": "خيل عربي أصيل",
             "Friesian": "فريزيان",
             "Orlov Trotter": "أورلوف تروتر",
             "Percheron": "بيرشيرون",
             "Vladimir Heavy Draft": "فلاديمير للجر الثقيل"
        }
        arabic_breed = breed_map.get(predicted_breed, predicted_breed)

        print(json.dumps({
            "breed": predicted_breed,
            "breedArabic": arabic_breed,
            "confidence": confidence,
            "status": "success"
        }, ensure_ascii=False), flush=True)

    except Exception as e:
        print(json.dumps({"error": str(e), "status": "error"}, ensure_ascii=False), flush=True)

if __name__ == "__main__":
    predict_image()
