import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
import xgboost as xgb
import joblib
import os
from data_processor import ExoplanetDataProcessor

class ExoplanetClassifier:
    """
    Ensemble ML model for exoplanet classification.
    Combines Random Forest and XGBoost for robust predictions.
    """
    
    def __init__(self, model_type='ensemble'):
        self.model_type = model_type
        self.model = None
        self.processor = ExoplanetDataProcessor()
        self.metrics = {}
        self.feature_importance = None
        
        # Default hyperparameters
        self.hyperparameters = {
            'rf_n_estimators': 200,
            'rf_max_depth': 20,
            'rf_min_samples_split': 5,
            'xgb_n_estimators': 200,
            'xgb_max_depth': 10,
            'xgb_learning_rate': 0.1,
        }
    
    def build_model(self, hyperparameters=None):
        """
        Build the ensemble model with specified hyperparameters.
        """
        if hyperparameters:
            self.hyperparameters.update(hyperparameters)
        
        # Random Forest
        rf_model = RandomForestClassifier(
            n_estimators=self.hyperparameters['rf_n_estimators'],
            max_depth=self.hyperparameters['rf_max_depth'],
            min_samples_split=self.hyperparameters['rf_min_samples_split'],
            random_state=42,
            n_jobs=-1
        )
        
        # XGBoost
        xgb_model = xgb.XGBClassifier(
            n_estimators=self.hyperparameters['xgb_n_estimators'],
            max_depth=self.hyperparameters['xgb_max_depth'],
            learning_rate=self.hyperparameters['xgb_learning_rate'],
            random_state=42,
            n_jobs=-1,
            eval_metric='logloss'
        )
        
        if self.model_type == 'ensemble':
            # Voting classifier combining both models
            self.model = VotingClassifier(
                estimators=[('rf', rf_model), ('xgb', xgb_model)],
                voting='soft'
            )
        elif self.model_type == 'random_forest':
            self.model = rf_model
        elif self.model_type == 'xgboost':
            self.model = xgb_model
        else:
            raise ValueError(f"Unknown model type: {self.model_type}")
        
        return self.model
    
    def train(self, data_path=None, test_size=0.2):
        """
        Train the model on exoplanet data.
        
        Args:
            data_path: Path to CSV file with training data
            test_size: Proportion of data to use for testing
        
        Returns:
            Dictionary with training metrics
        """
        print("Loading data...")
        df = self.processor.load_kepler_data(data_path)
        
        print("Preprocessing data...")
        X = self.processor.preprocess(df, fit=True)
        y = self.processor.prepare_labels(df)
        
        print(f"Dataset shape: {X.shape}")
        print(f"Class distribution: {np.bincount(y)}")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=y
        )
        
        print("Building model...")
        self.build_model()
        
        print("Training model...")
        self.model.fit(X_train, y_train)
        
        # Evaluate
        print("Evaluating model...")
        y_pred = self.model.predict(X_test)
        y_pred_proba = self.model.predict_proba(X_test)
        
        # Calculate metrics
        self.metrics = {
            'accuracy': float(accuracy_score(y_test, y_pred)),
            'precision': float(precision_score(y_test, y_pred, average='binary')),
            'recall': float(recall_score(y_test, y_pred, average='binary')),
            'f1_score': float(f1_score(y_test, y_pred, average='binary')),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
            'classification_report': classification_report(y_test, y_pred, output_dict=True)
        }
        
        # Cross-validation score
        cv_scores = cross_val_score(self.model, X_train, y_train, cv=5)
        self.metrics['cv_mean'] = float(cv_scores.mean())
        self.metrics['cv_std'] = float(cv_scores.std())
        
        # Feature importance
        self._calculate_feature_importance()
        
        print(f"\nModel Performance:")
        print(f"Accuracy: {self.metrics['accuracy']:.4f}")
        print(f"Precision: {self.metrics['precision']:.4f}")
        print(f"Recall: {self.metrics['recall']:.4f}")
        print(f"F1-Score: {self.metrics['f1_score']:.4f}")
        print(f"CV Score: {self.metrics['cv_mean']:.4f} (+/- {self.metrics['cv_std']:.4f})")
        
        return self.metrics
    
    def _calculate_feature_importance(self):
        """Calculate and store feature importance."""
        feature_names = self.processor.get_feature_names()
        
        if self.model_type == 'ensemble':
            # Average importance from both models
            rf_importance = self.model.named_estimators_['rf'].feature_importances_
            xgb_importance = self.model.named_estimators_['xgb'].feature_importances_
            importance = (rf_importance + xgb_importance) / 2
        elif hasattr(self.model, 'feature_importances_'):
            importance = self.model.feature_importances_
        else:
            importance = np.zeros(len(feature_names))
        
        self.feature_importance = {
            name: float(imp) for name, imp in zip(feature_names, importance)
        }
        
        # Sort by importance
        self.feature_importance = dict(
            sorted(self.feature_importance.items(), key=lambda x: x[1], reverse=True)
        )
    
    def predict(self, data):
        """
        Predict exoplanet classification for new data.
        
        Args:
            data: DataFrame or dict with feature values
        
        Returns:
            Dictionary with predictions and probabilities
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first or load a trained model.")
        
        # Convert to DataFrame if dict
        if isinstance(data, dict):
            data = pd.DataFrame([data])
        
        # Validate and preprocess
        self.processor.validate_input(data)
        X = self.processor.preprocess(data, fit=False)
        
        # Predict
        predictions = self.model.predict(X)
        probabilities = self.model.predict_proba(X)
        
        results = []
        for i in range(len(predictions)):
            results.append({
                'prediction': 'CONFIRMED' if predictions[i] == 1 else 'NOT CONFIRMED',
                'confidence': float(probabilities[i][predictions[i]]),
                'probability_confirmed': float(probabilities[i][1]),
                'probability_not_confirmed': float(probabilities[i][0])
            })
        
        return results
    
    def update_hyperparameters(self, new_params):
        """
        Update model hyperparameters and rebuild.
        
        Args:
            new_params: Dictionary with new hyperparameter values
        """
        self.hyperparameters.update(new_params)
        self.build_model()
        print(f"Hyperparameters updated: {self.hyperparameters}")
    
    def get_metrics(self):
        """Return current model metrics."""
        return self.metrics
    
    def get_feature_importance(self):
        """Return feature importance dictionary."""
        return self.feature_importance
    
    def save(self, model_path='models/exoplanet_model.pkl', processor_path='models/data_processor.pkl'):
        """Save the trained model and processor."""
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        
        # Save model
        joblib.dump({
            'model': self.model,
            'model_type': self.model_type,
            'hyperparameters': self.hyperparameters,
            'metrics': self.metrics,
            'feature_importance': self.feature_importance
        }, model_path)
        
        # Save processor
        self.processor.save(processor_path)
        
        print(f"Model saved to {model_path}")
        print(f"Processor saved to {processor_path}")
    
    def load(self, model_path='models/exoplanet_model.pkl', processor_path='models/data_processor.pkl'):
        """Load a trained model and processor."""
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        # Load model
        data = joblib.load(model_path)
        self.model = data['model']
        self.model_type = data['model_type']
        self.hyperparameters = data['hyperparameters']
        self.metrics = data['metrics']
        self.feature_importance = data['feature_importance']
        
        # Load processor
        self.processor.load(processor_path)
        
        print(f"Model loaded from {model_path}")
        print(f"Model accuracy: {self.metrics.get('accuracy', 'N/A')}")

if __name__ == "__main__":
    # Train and save model
    print("Training Exoplanet Classifier...")
    classifier = ExoplanetClassifier(model_type='ensemble')
    metrics = classifier.train()
    classifier.save()
    
    print("\nFeature Importance:")
    for feature, importance in classifier.get_feature_importance().items():
        print(f"{feature}: {importance:.4f}")
