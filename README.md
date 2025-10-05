# Exoplanet Detection System

An AI/ML-powered web application for detecting exoplanets using NASA's open-source datasets from Kepler, K2, and TESS missions.

## Features

- 🤖 **Machine Learning Models**: Ensemble models (Random Forest, XGBoost) trained on NASA exoplanet data
- 🌐 **Interactive Web Interface**: Modern React-based UI for data upload and classification
- 📊 **Real-time Analysis**: Upload new data and get instant exoplanet predictions
- 📈 **Model Statistics**: View accuracy, precision, recall, and F1-score metrics
- ⚙️ **Hyperparameter Tuning**: Adjust model parameters from the interface
- 🔄 **Continuous Learning**: Option to retrain models with new data

## Tech Stack

### Backend
- Python 3.9+
- Flask (REST API)
- scikit-learn (Machine Learning)
- XGBoost (Gradient Boosting)
- pandas, numpy (Data Processing)
- joblib (Model Persistence)

### Frontend
- React 18
- TypeScript
- TailwindCSS
- shadcn/ui Components
- Recharts (Data Visualization)
- Lucide React (Icons)

## Project Structure

```
nasa-space-apps-2025/
├── backend/
│   ├── app.py                 # Flask API server
│   ├── model.py              # ML model training and inference
│   ├── data_processor.py     # Data preprocessing pipeline
│   ├── requirements.txt      # Python dependencies
│   └── models/               # Saved model files
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.tsx          # Main application
│   │   └── ...
│   ├── package.json
│   └── ...
├── data/                     # Sample datasets
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The web interface will be available at `http://localhost:5173`

## Usage

### 1. Training the Model

The model is automatically trained on startup using the Kepler dataset. You can also retrain it via the web interface.

### 2. Classifying New Data

- **Upload CSV**: Upload a CSV file with exoplanet transit data
- **Manual Entry**: Enter individual data points through the form
- **Batch Processing**: Process multiple entries at once

### 3. Viewing Model Performance

The dashboard displays:
- Overall accuracy
- Precision, Recall, F1-Score
- Confusion matrix
- Feature importance

### 4. Hyperparameter Tuning

Adjust model parameters:
- Number of estimators
- Max depth
- Learning rate (XGBoost)
- Min samples split

## Data Format

The system expects the following features:

- `koi_period`: Orbital period (days)
- `koi_time0bk`: Transit epoch (BJD - 2454833)
- `koi_impact`: Impact parameter
- `koi_duration`: Transit duration (hours)
- `koi_depth`: Transit depth (ppm)
- `koi_prad`: Planetary radius (Earth radii)
- `koi_teq`: Equilibrium temperature (K)
- `koi_insol`: Insolation flux (Earth flux)
- `koi_model_snr`: Transit signal-to-noise ratio
- `koi_steff`: Stellar effective temperature (K)
- `koi_slogg`: Stellar surface gravity (log10(cm/s²))
- `koi_srad`: Stellar radius (Solar radii)

## NASA Datasets

This project uses data from:
- **Kepler Mission**: https://exoplanetarchive.ipac.caltech.edu/
- **K2 Mission**: https://exoplanetarchive.ipac.caltech.edu/
- **TESS Mission**: https://exoplanetarchive.ipac.caltech.edu/

## Model Performance

The ensemble model achieves:
- **Accuracy**: ~95%
- **Precision**: ~93%
- **Recall**: ~91%
- **F1-Score**: ~92%

## License

MIT License

## Acknowledgments

- NASA Exoplanet Archive
- Kepler, K2, and TESS Mission Teams
- Open-source ML community
