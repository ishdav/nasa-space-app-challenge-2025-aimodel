import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
import joblib
import os

class ExoplanetDataProcessor:
    """
    Data preprocessing pipeline for exoplanet detection.
    Handles missing values, feature engineering, and normalization.
    """
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.imputer = SimpleImputer(strategy='median')
        self.feature_columns = [
            'koi_period', 'koi_time0bk', 'koi_impact', 'koi_duration',
            'koi_depth', 'koi_prad', 'koi_teq', 'koi_insol',
            'koi_model_snr', 'koi_steff', 'koi_slogg', 'koi_srad'
        ]
        self.is_fitted = False
    
    def load_kepler_data(self, filepath=None):
        """
        Load Kepler exoplanet data from CSV or download from NASA archive.
        """
        if filepath and os.path.exists(filepath):
            df = pd.read_csv(filepath)
        else:
            # Sample data structure for demonstration
            # In production, this would download from NASA Exoplanet Archive
            print("Loading sample Kepler data...")
            df = self._create_sample_data()
        
        return df
    
    def _create_sample_data(self):
        """
        Create sample exoplanet data for demonstration.
        In production, replace with actual NASA data download.
        """
        np.random.seed(42)
        n_samples = 1000
        
        # Generate synthetic data with realistic distributions
        data = {
            'koi_period': np.random.lognormal(2, 1.5, n_samples),
            'koi_time0bk': np.random.uniform(130, 1600, n_samples),
            'koi_impact': np.random.uniform(0, 1, n_samples),
            'koi_duration': np.random.lognormal(1, 0.8, n_samples),
            'koi_depth': np.random.lognormal(3, 1.2, n_samples),
            'koi_prad': np.random.lognormal(0.5, 0.8, n_samples),
            'koi_teq': np.random.normal(800, 400, n_samples),
            'koi_insol': np.random.lognormal(1, 2, n_samples),
            'koi_model_snr': np.random.lognormal(2, 1, n_samples),
            'koi_steff': np.random.normal(5500, 800, n_samples),
            'koi_slogg': np.random.normal(4.4, 0.3, n_samples),
            'koi_srad': np.random.lognormal(0, 0.3, n_samples),
        }
        
        df = pd.DataFrame(data)
        
        # Create labels: CONFIRMED, CANDIDATE, FALSE POSITIVE
        # Based on realistic criteria
        conditions = [
            (df['koi_model_snr'] > 15) & (df['koi_depth'] > 50) & (df['koi_prad'] < 20),
            (df['koi_model_snr'] > 8) & (df['koi_depth'] > 20),
        ]
        choices = ['CONFIRMED', 'CANDIDATE']
        df['koi_disposition'] = np.select(conditions, choices, default='FALSE POSITIVE')
        
        # Add some missing values to simulate real data
        for col in self.feature_columns:
            mask = np.random.random(n_samples) < 0.05
            df.loc[mask, col] = np.nan
        
        return df
    
    def preprocess(self, df, fit=False):
        """
        Preprocess the data: handle missing values, scale features.
        
        Args:
            df: Input dataframe
            fit: Whether to fit the scaler and imputer (True for training data)
        
        Returns:
            Preprocessed feature array
        """
        # Select feature columns
        X = df[self.feature_columns].copy()
        
        # Handle missing values
        if fit:
            X_imputed = self.imputer.fit_transform(X)
            self.is_fitted = True
        else:
            if not self.is_fitted:
                raise ValueError("Processor must be fitted before transforming data")
            X_imputed = self.imputer.transform(X)
        
        # Scale features
        if fit:
            X_scaled = self.scaler.fit_transform(X_imputed)
        else:
            X_scaled = self.scaler.transform(X_imputed)
        
        return X_scaled
    
    def prepare_labels(self, df):
        """
        Convert disposition labels to binary classification.
        CONFIRMED = 1, CANDIDATE/FALSE POSITIVE = 0
        """
        if 'koi_disposition' not in df.columns:
            raise ValueError("DataFrame must contain 'koi_disposition' column")
        
        # Binary classification: CONFIRMED vs others
        y = (df['koi_disposition'] == 'CONFIRMED').astype(int)
        return y.values
    
    def prepare_multiclass_labels(self, df):
        """
        Convert disposition labels to multiclass (0: FALSE POSITIVE, 1: CANDIDATE, 2: CONFIRMED)
        """
        if 'koi_disposition' not in df.columns:
            raise ValueError("DataFrame must contain 'koi_disposition' column")
        
        label_map = {
            'FALSE POSITIVE': 0,
            'CANDIDATE': 1,
            'CONFIRMED': 2
        }
        y = df['koi_disposition'].map(label_map)
        return y.values
    
    def save(self, filepath='models/data_processor.pkl'):
        """Save the fitted processor."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump({
            'scaler': self.scaler,
            'imputer': self.imputer,
            'feature_columns': self.feature_columns,
            'is_fitted': self.is_fitted
        }, filepath)
        print(f"Data processor saved to {filepath}")
    
    def load(self, filepath='models/data_processor.pkl'):
        """Load a fitted processor."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Processor file not found: {filepath}")
        
        data = joblib.load(filepath)
        self.scaler = data['scaler']
        self.imputer = data['imputer']
        self.feature_columns = data['feature_columns']
        self.is_fitted = data['is_fitted']
        print(f"Data processor loaded from {filepath}")
    
    def validate_input(self, df):
        """
        Validate that input data has required columns.
        """
        missing_cols = set(self.feature_columns) - set(df.columns)
        if missing_cols:
            raise ValueError(f"Missing required columns: {missing_cols}")
        return True
    
    def get_feature_names(self):
        """Return list of feature column names."""
        return self.feature_columns.copy()
