from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import json
from model import ExoplanetClassifier
from data_processor import ExoplanetDataProcessor

app = Flask(__name__)
CORS(app)

# Initialize classifier
classifier = ExoplanetClassifier(model_type='ensemble')

# Try to load existing model, otherwise train new one
try:
    classifier.load()
    print("Loaded existing model")
except FileNotFoundError:
    print("No existing model found. Training new model...")
    classifier.train()
    classifier.save()
    print("Model trained and saved")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'message': 'Exoplanet API is running'})

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Predict exoplanet classification for input data.
    Accepts JSON with feature values or CSV file upload.
    """
    try:
        if request.is_json:
            # JSON input
            data = request.json
            
            if isinstance(data, list):
                # Multiple predictions
                df = pd.DataFrame(data)
            else:
                # Single prediction
                df = pd.DataFrame([data])
            
            results = classifier.predict(df)
            return jsonify({'success': True, 'predictions': results})
        
        elif 'file' in request.files:
            # CSV file upload
            file = request.files['file']
            df = pd.read_csv(file)
            results = classifier.predict(df)
            return jsonify({'success': True, 'predictions': results})
        
        else:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    """Get current model performance metrics."""
    try:
        metrics = classifier.get_metrics()
        feature_importance = classifier.get_feature_importance()
        
        return jsonify({
            'success': True,
            'metrics': metrics,
            'feature_importance': feature_importance,
            'hyperparameters': classifier.hyperparameters
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/feature-importance', methods=['GET'])
def get_feature_importance():
    """Get feature importance rankings."""
    try:
        importance = classifier.get_feature_importance()
        return jsonify({'success': True, 'feature_importance': importance})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/hyperparameters', methods=['GET', 'POST'])
def manage_hyperparameters():
    """Get or update model hyperparameters."""
    try:
        if request.method == 'GET':
            return jsonify({
                'success': True,
                'hyperparameters': classifier.hyperparameters
            })
        
        elif request.method == 'POST':
            new_params = request.json
            classifier.update_hyperparameters(new_params)
            
            return jsonify({
                'success': True,
                'message': 'Hyperparameters updated. Retrain model to apply changes.',
                'hyperparameters': classifier.hyperparameters
            })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/retrain', methods=['POST'])
def retrain_model():
    """
    Retrain the model with optional new data.
    Can accept CSV file or use existing training data.
    """
    try:
        data_path = None
        
        if 'file' in request.files:
            # Save uploaded file temporarily
            file = request.files['file']
            data_path = 'temp_training_data.csv'
            file.save(data_path)
        
        # Retrain model
        print("Retraining model...")
        metrics = classifier.train(data_path=data_path)
        classifier.save()
        
        # Clean up temp file
        if data_path and os.path.exists(data_path):
            os.remove(data_path)
        
        return jsonify({
            'success': True,
            'message': 'Model retrained successfully',
            'metrics': metrics
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/features', methods=['GET'])
def get_features():
    """Get list of required features for prediction."""
    try:
        features = classifier.processor.get_feature_names()
        
        feature_descriptions = {
            'koi_period': 'Orbital period (days)',
            'koi_time0bk': 'Transit epoch (BJD - 2454833)',
            'koi_impact': 'Impact parameter',
            'koi_duration': 'Transit duration (hours)',
            'koi_depth': 'Transit depth (ppm)',
            'koi_prad': 'Planetary radius (Earth radii)',
            'koi_teq': 'Equilibrium temperature (K)',
            'koi_insol': 'Insolation flux (Earth flux)',
            'koi_model_snr': 'Transit signal-to-noise ratio',
            'koi_steff': 'Stellar effective temperature (K)',
            'koi_slogg': 'Stellar surface gravity (log10(cm/s²))',
            'koi_srad': 'Stellar radius (Solar radii)'
        }
        
        feature_info = [
            {'name': feat, 'description': feature_descriptions.get(feat, '')}
            for feat in features
        ]
        
        return jsonify({
            'success': True,
            'features': feature_info
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/sample-data', methods=['GET'])
def get_sample_data():
    """Get sample data for testing."""
    try:
        processor = ExoplanetDataProcessor()
        df = processor.load_kepler_data()
        
        # Return first 5 rows as sample
        sample = df[processor.feature_columns].head(5).to_dict('records')
        
        return jsonify({
            'success': True,
            'sample_data': sample
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/batch-predict', methods=['POST'])
def batch_predict():
    """
    Batch prediction endpoint for processing multiple entries.
    """
    try:
        data = request.json
        
        if not isinstance(data, list):
            return jsonify({'success': False, 'error': 'Expected list of data points'}), 400
        
        df = pd.DataFrame(data)
        results = classifier.predict(df)
        
        # Add input data to results
        for i, result in enumerate(results):
            result['input'] = data[i]
        
        return jsonify({
            'success': True,
            'total': len(results),
            'predictions': results
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Exoplanet Detection API...")
    print("API available at http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
