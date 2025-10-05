# Exoplanet Detection System - Technical Documentation

## Overview

This system provides an end-to-end solution for exoplanet detection using machine learning. It combines ensemble ML models (Random Forest + XGBoost) with a modern web interface for researchers and enthusiasts to classify exoplanet candidates.

## Architecture

### Backend (Python/Flask)

#### Components

1. **Data Processor (`data_processor.py`)**
   - Handles data loading from NASA archives
   - Implements preprocessing pipeline:
     - Missing value imputation (median strategy)
     - Feature scaling (StandardScaler)
     - Data validation
   - Supports both training and inference modes

2. **ML Model (`model.py`)**
   - Ensemble classifier combining:
     - Random Forest: Robust to overfitting, handles non-linear relationships
     - XGBoost: Gradient boosting for high accuracy
   - Voting classifier with soft voting for probability estimates
   - Feature importance calculation
   - Cross-validation for model validation

3. **API Server (`app.py`)**
   - RESTful API endpoints:
     - `/api/predict` - Single/batch prediction
     - `/api/metrics` - Model performance metrics
     - `/api/hyperparameters` - Get/update model parameters
     - `/api/retrain` - Retrain model with new data
     - `/api/features` - Get feature information
     - `/api/sample-data` - Get sample data for testing

### Frontend (React/TypeScript)

#### Components

1. **Dashboard**
   - Real-time model metrics display
   - Feature importance visualization (bar chart)
   - Confusion matrix (pie chart)
   - Cross-validation scores

2. **Predictor**
   - Manual input form for individual predictions
   - CSV file upload for batch processing
   - Drag-and-drop interface
   - Real-time prediction results

3. **Settings**
   - Hyperparameter tuning interface
   - Model retraining controls
   - Training data upload

## Machine Learning Pipeline

### Data Preprocessing

1. **Feature Selection**
   - 12 key features from Kepler Object of Interest (KOI) data:
     - Orbital characteristics (period, epoch, impact)
     - Transit properties (duration, depth)
     - Planetary properties (radius, temperature, insolation)
     - Stellar properties (temperature, gravity, radius)
     - Signal quality (SNR)

2. **Missing Value Handling**
   - Median imputation for numerical features
   - Preserves data distribution
   - Fitted on training data, applied to test/inference

3. **Feature Scaling**
   - StandardScaler normalization
   - Zero mean, unit variance
   - Essential for distance-based algorithms

### Model Training

1. **Ensemble Architecture**
   ```
   Input Features (12)
        ↓
   ┌────────────────────────┐
   │  Random Forest         │
   │  - n_estimators: 200   │
   │  - max_depth: 20       │
   └────────────────────────┘
        ↓
   ┌────────────────────────┐
   │  XGBoost              │
   │  - n_estimators: 200   │
   │  - max_depth: 10       │
   │  - learning_rate: 0.1  │
   └────────────────────────┘
        ↓
   Soft Voting Classifier
        ↓
   Prediction + Probabilities
   ```

2. **Training Process**
   - 80/20 train-test split
   - Stratified sampling to preserve class distribution
   - 5-fold cross-validation
   - Model persistence with joblib

3. **Evaluation Metrics**
   - Accuracy: Overall correctness
   - Precision: Positive predictive value
   - Recall: True positive rate
   - F1-Score: Harmonic mean of precision/recall
   - Confusion Matrix: Detailed classification breakdown

## API Reference

### Prediction Endpoints

#### POST /api/predict
Predict exoplanet classification for input data.

**Request (JSON):**
```json
{
  "koi_period": 10.5,
  "koi_time0bk": 134.5,
  "koi_impact": 0.5,
  "koi_duration": 3.2,
  "koi_depth": 150.0,
  "koi_prad": 2.5,
  "koi_teq": 800,
  "koi_insol": 5.0,
  "koi_model_snr": 20.0,
  "koi_steff": 5500,
  "koi_slogg": 4.4,
  "koi_srad": 1.0
}
```

**Response:**
```json
{
  "success": true,
  "predictions": [{
    "prediction": "CONFIRMED",
    "confidence": 0.95,
    "probability_confirmed": 0.95,
    "probability_not_confirmed": 0.05
  }]
}
```

#### POST /api/batch-predict
Process multiple predictions at once.

**Request:**
```json
[
  { "koi_period": 10.5, ... },
  { "koi_period": 20.3, ... }
]
```

### Model Management

#### GET /api/metrics
Get current model performance metrics.

**Response:**
```json
{
  "success": true,
  "metrics": {
    "accuracy": 0.95,
    "precision": 0.93,
    "recall": 0.91,
    "f1_score": 0.92,
    "confusion_matrix": [[450, 30], [25, 495]],
    "cv_mean": 0.94,
    "cv_std": 0.02
  },
  "feature_importance": {
    "koi_model_snr": 0.25,
    "koi_depth": 0.18,
    ...
  },
  "hyperparameters": {
    "rf_n_estimators": 200,
    ...
  }
}
```

#### POST /api/hyperparameters
Update model hyperparameters.

**Request:**
```json
{
  "rf_n_estimators": 300,
  "xgb_learning_rate": 0.05
}
```

#### POST /api/retrain
Retrain model with optional new data.

**Request:** Multipart form with optional CSV file

**Response:**
```json
{
  "success": true,
  "message": "Model retrained successfully",
  "metrics": { ... }
}
```

## Data Format

### Input CSV Format

CSV files should contain the following columns:

| Column | Description | Unit | Example |
|--------|-------------|------|---------|
| koi_period | Orbital period | days | 10.5 |
| koi_time0bk | Transit epoch | BJD - 2454833 | 134.5 |
| koi_impact | Impact parameter | - | 0.5 |
| koi_duration | Transit duration | hours | 3.2 |
| koi_depth | Transit depth | ppm | 150.0 |
| koi_prad | Planetary radius | Earth radii | 2.5 |
| koi_teq | Equilibrium temperature | K | 800 |
| koi_insol | Insolation flux | Earth flux | 5.0 |
| koi_model_snr | Signal-to-noise ratio | - | 20.0 |
| koi_steff | Stellar temperature | K | 5500 |
| koi_slogg | Stellar gravity | log10(cm/s²) | 4.4 |
| koi_srad | Stellar radius | Solar radii | 1.0 |

### Training Data Format

For retraining, include an additional column:
- `koi_disposition`: One of "CONFIRMED", "CANDIDATE", or "FALSE POSITIVE"

## Performance Optimization

### Model Optimization

1. **Hyperparameter Tuning**
   - Random Forest:
     - Increase n_estimators for better accuracy (diminishing returns after 200-300)
     - Adjust max_depth to control overfitting (15-25 typically optimal)
     - min_samples_split affects tree granularity (3-10 range)
   
   - XGBoost:
     - n_estimators: More rounds = better fit (watch for overfitting)
     - learning_rate: Lower = more stable (0.01-0.3 range)
     - max_depth: Controls complexity (6-15 typical)

2. **Feature Engineering**
   - Current features are domain-specific from NASA
   - Consider adding derived features:
     - Ratios (e.g., planet/star radius ratio)
     - Interaction terms
     - Polynomial features for non-linear relationships

### API Performance

1. **Caching**
   - Model loaded once at startup
   - Processor fitted once and reused
   - Consider Redis for distributed deployments

2. **Batch Processing**
   - Use `/api/batch-predict` for multiple predictions
   - More efficient than individual requests
   - Vectorized operations in NumPy/scikit-learn

## Deployment

### Production Considerations

1. **Backend**
   - Use production WSGI server (Gunicorn, uWSGI)
   - Enable HTTPS
   - Set up proper CORS policies
   - Implement rate limiting
   - Add authentication for sensitive endpoints

2. **Frontend**
   - Build optimized production bundle: `npm run build`
   - Serve with Nginx or CDN
   - Enable compression (gzip/brotli)
   - Implement error boundaries

3. **Model Versioning**
   - Save models with timestamps
   - Track hyperparameters and metrics
   - Implement A/B testing for model updates

### Scaling

1. **Horizontal Scaling**
   - Stateless API design allows multiple instances
   - Load balancer for traffic distribution
   - Shared model storage (S3, NFS)

2. **Vertical Scaling**
   - GPU acceleration for XGBoost (set `tree_method='gpu_hist'`)
   - Increase worker processes
   - Optimize batch sizes

## NASA Data Sources

### Kepler Mission
- **URL**: https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=cumulative
- **Description**: Cumulative KOI table with all Kepler discoveries
- **Format**: CSV, IPAC Table, VOTable

### K2 Mission
- **URL**: https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=k2candidates
- **Description**: K2 Candidates and EPIC data
- **Format**: CSV, IPAC Table

### TESS Mission
- **URL**: https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=TOI
- **Description**: TESS Objects of Interest (TOI)
- **Format**: CSV, IPAC Table

### Download Instructions

1. Visit the NASA Exoplanet Archive
2. Select desired mission table
3. Choose columns (or use default)
4. Download as CSV
5. Place in `data/` directory or upload via web interface

## Troubleshooting

### Common Issues

1. **Model not loading**
   - Ensure model files exist in `backend/models/`
   - Run `python model.py` to train initial model
   - Check file permissions

2. **Prediction errors**
   - Verify all 12 features are provided
   - Check for valid numerical values
   - Ensure no extreme outliers

3. **Frontend connection issues**
   - Verify backend is running on port 5000
   - Check CORS configuration
   - Ensure proxy settings in vite.config.ts

4. **Low accuracy**
   - Check data quality and distribution
   - Adjust hyperparameters
   - Consider feature engineering
   - Increase training data size

## Future Enhancements

1. **Model Improvements**
   - Deep learning models (CNN for light curves)
   - Time series analysis
   - Ensemble with neural networks

2. **Features**
   - Light curve visualization
   - Automated data download from NASA
   - Model comparison tools
   - Export predictions to various formats

3. **Data**
   - Support for TESS and K2 data formats
   - Real-time data ingestion
   - Data augmentation techniques

4. **UI/UX**
   - Interactive light curve plots
   - 3D visualization of planetary systems
   - Educational mode for students
   - API documentation with Swagger

## References

- NASA Exoplanet Archive: https://exoplanetarchive.ipac.caltech.edu/
- Kepler Mission: https://www.nasa.gov/mission_pages/kepler/main/index.html
- TESS Mission: https://www.nasa.gov/tess-transiting-exoplanet-survey-satellite
- scikit-learn Documentation: https://scikit-learn.org/
- XGBoost Documentation: https://xgboost.readthedocs.io/
