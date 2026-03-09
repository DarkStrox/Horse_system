import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import os

def train_model():
    # Load data
    data_path = 'e:/Graduation Project/ML Things/horse strain data.csv'
    df = pd.read_csv(data_path)
    
    # Define features and target
    features = ['Gender', 'Body_Format', 'Bone_Density', 'Neck_Length', 'Chest_Width']
    target = 'Strain'
    
    # Filter only necessary columns
    df = df[features + [target]].dropna()
    
    # Print Class Distribution
    print("--- Class Distribution ---")
    print(df[target].value_counts())
    
    # Encode Categorical Features
    cat_features = ['Gender', 'Body_Format', 'Bone_Density', 'Neck_Length', 'Chest_Width']
    label_encoders = {}
    for col in cat_features:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        label_encoders[col] = le
        
    # Encode Target
    target_le = LabelEncoder()
    df[target] = target_le.fit_transform(df[target].astype(str))
    
    # Split Data
    X = df[features]
    y = df[target]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale ALL features to maintain consistency with predict_strain.py
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Calculate Accuracy
    accuracy = model.score(X_test_scaled, y_test)
    print(f"\nTraining Complete. Test Accuracy: {accuracy*100:.2f}%")
    print(f"Target Classes: {target_le.classes_}")
    
    # Save Components
    ml_dir = 'e:/Graduation Project/ML Things'
    joblib.dump(model, os.path.join(ml_dir, 'horse_strain_rf_model.pkl'))
    joblib.dump(scaler, os.path.join(ml_dir, 'scaler.pkl'))
    joblib.dump(label_encoders, os.path.join(ml_dir, 'label_encoders.pkl'))
    joblib.dump(target_le, os.path.join(ml_dir, 'target_encoder.pkl'))
    
    print(f"Models and encoders saved to {ml_dir}")

if __name__ == "__main__":
    train_model()
