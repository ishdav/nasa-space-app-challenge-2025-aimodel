# 🚀 Quick Start Guide

Get the Exoplanet Detection System running in 5 minutes!

## Step 1: Setup (One-time)

### Automated Setup (Recommended)
Simply double-click `setup.bat` and wait for installation to complete.

### Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python model.py
```

**Frontend:**
```bash
cd frontend
npm install
```

## Step 2: Start the Application

### Option A: Use Launcher Scripts (Easiest)
1. Double-click `start-backend.bat`
2. Double-click `start-frontend.bat`
3. Open http://localhost:5173 in your browser

### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 3: Use the System

### Dashboard Tab
- View model performance metrics
- See feature importance rankings
- Analyze confusion matrix

### Predict Tab

**Method 1: Manual Input**
1. Click "Load Sample" to populate fields
2. Modify values as needed
3. Click "Predict"
4. View results with confidence scores

**Method 2: CSV Upload**
1. Prepare CSV with required columns (see sample_data.csv)
2. Drag and drop the file
3. View batch predictions

### Settings Tab

**Tune Hyperparameters:**
1. Adjust Random Forest settings (n_estimators, max_depth, etc.)
2. Adjust XGBoost settings (learning_rate, etc.)
3. Click "Update Hyperparameters"
4. Click "Retrain with Existing Data"

**Retrain with New Data:**
1. Prepare CSV with features + koi_disposition column
2. Upload in the "Retrain Model" section
3. Wait for training to complete
4. Check updated metrics in Dashboard

## Sample Data Format

### For Prediction (CSV):
```csv
koi_period,koi_time0bk,koi_impact,koi_duration,koi_depth,koi_prad,koi_teq,koi_insol,koi_model_snr,koi_steff,koi_slogg,koi_srad
10.5,134.5,0.5,3.2,150.0,2.5,800,5.0,20.0,5500,4.4,1.0
20.3,245.1,0.3,4.1,200.0,3.2,650,3.5,15.0,5200,4.3,0.9
```

### For Training (CSV):
```csv
koi_period,koi_time0bk,koi_impact,koi_duration,koi_depth,koi_prad,koi_teq,koi_insol,koi_model_snr,koi_steff,koi_slogg,koi_srad,koi_disposition
10.5,134.5,0.5,3.2,150.0,2.5,800,5.0,20.0,5500,4.4,1.0,CONFIRMED
20.3,245.1,0.3,4.1,200.0,3.2,650,3.5,15.0,5200,4.3,0.9,CANDIDATE
5.2,89.3,0.8,2.1,50.0,1.2,1200,15.0,8.0,6000,4.5,1.1,FALSE POSITIVE
```

## Troubleshooting

### Backend won't start
- Ensure Python 3.9+ is installed: `python --version`
- Activate virtual environment: `venv\Scripts\activate`
- Install dependencies: `pip install -r requirements.txt`

### Frontend won't start
- Ensure Node.js 16+ is installed: `node --version`
- Install dependencies: `npm install`
- Clear cache: `npm cache clean --force`

### Port already in use
- Backend (5000): Change port in `app.py`
- Frontend (5173): Change port in `vite.config.ts`

### Model not found
- Run: `python backend/model.py` to train initial model

## API Testing

Test the API directly:

```bash
# Health check
curl http://localhost:5000/api/health

# Get metrics
curl http://localhost:5000/api/metrics

# Predict (example)
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"koi_period":10.5,"koi_time0bk":134.5,"koi_impact":0.5,"koi_duration":3.2,"koi_depth":150.0,"koi_prad":2.5,"koi_teq":800,"koi_insol":5.0,"koi_model_snr":20.0,"koi_steff":5500,"koi_slogg":4.4,"koi_srad":1.0}'
```

## Next Steps

1. **Explore**: Try different input values to see how predictions change
2. **Optimize**: Tune hyperparameters for better accuracy
3. **Learn**: Read DOCUMENTATION.md for technical details
4. **Extend**: Add new features or integrate real NASA data

## Getting Real NASA Data

1. Visit https://exoplanetarchive.ipac.caltech.edu/
2. Select "Kepler Objects of Interest" table
3. Download as CSV
4. Upload via Settings tab for retraining

Or run:
```bash
python backend/download_data.py
```

## Support

- **Setup Issues**: Check README.md
- **Technical Details**: See DOCUMENTATION.md
- **Project Overview**: Read PROJECT_OVERVIEW.md

---

**Happy Exoplanet Hunting! 🌌**
