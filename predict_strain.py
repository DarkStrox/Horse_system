import sys
import json
import os
import pandas as pd
import joblib
import numpy as np
import warnings

# Suppress warnings
warnings.filterwarnings("ignore")
sys.stdout.reconfigure(encoding='utf-8')

def predict_strain():
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No input file provided.", "status": "error"}))
            return
            
        input_file = sys.argv[1]
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        base_dir = os.path.dirname(os.path.abspath(__file__))
        ml_dir = os.path.join(base_dir, 'ML Things')
        
        # Load components (Retrained by me)
        model = joblib.load(os.path.join(ml_dir, 'horse_strain_rf_model.pkl'))
        scaler = joblib.load(os.path.join(ml_dir, 'scaler.pkl'))
        feature_encoders = joblib.load(os.path.join(ml_dir, 'label_encoders.pkl'))
        target_le = joblib.load(os.path.join(ml_dir, 'target_encoder.pkl'))

        # Extract features from JSON
        gender = data.get('Gender', 'Mare')
        age = float(data.get('Age', 5.0))
        height = float(data.get('Height_cm', 150.0))
        weight = float(data.get('Weight_kg', 400.0))
        body_format = data.get('Body_Format', 'Compact')
        bone_density = data.get('Bone_Density', 'Medium')
        neck_length = data.get('Neck_Length', 'Medium')
        chest_width = data.get('Chest_Width', 'Medium')

        # Encode categorical features safely
        def safe_encode(encoder, val):
            val = str(val).strip()
            classes = [str(c).strip() for c in encoder.classes_]
            if val in classes:
                return encoder.transform([encoder.classes_[classes.index(val)]])[0]
            return encoder.transform([encoder.classes_[0]])[0]

        # Features must be in the exact order as trained in train_strain_model.py:
        # ['Gender', 'Body_Format', 'Bone_Density', 'Neck_Length', 'Chest_Width']
        
        feature_list = [
            safe_encode(feature_encoders['Gender'], gender),
            safe_encode(feature_encoders['Body_Format'], body_format),
            safe_encode(feature_encoders['Bone_Density'], bone_density),
            safe_encode(feature_encoders['Neck_Length'], neck_length),
            safe_encode(feature_encoders['Chest_Width'], chest_width)
        ]
        
        # Scale and Predict
        input_df = pd.DataFrame([feature_list], columns=['Gender', 'Body_Format', 'Bone_Density', 'Neck_Length', 'Chest_Width'])
        input_scaled = scaler.transform(input_df)
        
        prediction_encoded = model.predict(input_scaled)
        probabilities = model.predict_proba(input_scaled)
        confidence = float(np.max(probabilities) * 100)
        
        # Build probability map
        class_probs = {}
        target_classes = target_le.classes_
        for cls, prob in zip(target_classes, probabilities[0]):
            class_probs[str(cls)] = float(round(prob * 100, 2))

        # Decode Name
        predicted_strain = str(target_le.inverse_transform(prediction_encoded)[0])
        
        strain_map_arabic = {
            "Abeyan": "عبيان",
            "Hadban": "هدبان",
            "Hamdani": "حمداني",
            "Kuhaylan": "كحيلان",
            "Muniqi": "معنقي",
            "Saqlawi": "صقلاوي"
        }
        
        arabic_strain = strain_map_arabic.get(predicted_strain, predicted_strain)

        # Output final JSON
        print(json.dumps({
            "predictedStrain":       predicted_strain,
            "predictedStrainArabic": arabic_strain,
            "confidence":            round(confidence, 2),
            "classProbabilities":    class_probs,
            "status":                "success"
        }, ensure_ascii=False))

    except Exception as e:
        print(json.dumps({"error": str(e), "status": "error"}))

if __name__ == "__main__":
    predict_strain()