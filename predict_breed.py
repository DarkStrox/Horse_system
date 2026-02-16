import sys
import json
import joblib
import pandas as pd
import os
import pickle

def predict():
    try:
        # Read JSON from stdin
        input_data = json.load(sys.stdin)
        
        # Load model and columns
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, 'arabian_horse_model.pkl')
        cols_path = os.path.join(base_dir, 'model_columns.pkl')
        
        # Model is actually joblib formatted
        model = joblib.load(model_path)
        
        # Columns are standard pickle
        with open(cols_path, 'rb') as f:
            model_columns = pickle.load(f)
            
        # Create a DataFrame with 0s for all columns
        df = pd.DataFrame(0, index=[0], columns=model_columns)
        
        # Numeric values
        df['Height_cm'] = float(input_data.get('Height_cm', 0))
        df['Weight_kg'] = float(input_data.get('Weight_kg', 0))
        
        # Categorical values (with one-hot encoding)
        # The frontend should send strings like "Straight", "High", etc.
        categorical_mappings = {
            'Head_Profile': input_data.get('Head_Profile'),
            'Tail_Carriage': input_data.get('Tail_Carriage'),
            'Neck_Arch': input_data.get('Neck_Arch'),
            'Rib_Count': str(input_data.get('Rib_Count')),
            'Back_Length': input_data.get('Back_Length')
        }
        
        for feature, value in categorical_mappings.items():
            if value:
                col_name = f"{feature}_{value}"
                if col_name in df.columns:
                    df[col_name] = 1
                    
        # Predict
        prediction = model.predict(df)
        
        # Map back to Arabic display name if needed
        breed_map = {
            "Arabian": "خيل عربي أصيل",
            "Thoroughbred": "ثوروبريد (إنجليزي أصيل)",
            "Quarter_Horse": "كوارتر هورس",
            "Shire": "شاير"
        }
        
        raw_breed = prediction[0]
        arabic_breed = breed_map.get(raw_breed, raw_breed)
        
        print(json.dumps({
            "breed": raw_breed, 
            "breedArabic": arabic_breed,
            "status": "success"
        }))
        
    except Exception as e:
        print(json.dumps({"error": str(e), "status": "error"}))

if __name__ == "__main__":
    predict()
