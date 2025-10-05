import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon, RefreshCw, Upload } from 'lucide-react';
import { api } from '@/lib/api';
import { useDropzone } from 'react-dropzone';

export function Settings() {
  const [hyperparameters, setHyperparameters] = useState({
    rf_n_estimators: 200,
    rf_max_depth: 20,
    rf_min_samples_split: 5,
    xgb_n_estimators: 200,
    xgb_max_depth: 10,
    xgb_learning_rate: 0.1,
  });

  const [loading, setLoading] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadHyperparameters();
  }, []);

  const loadHyperparameters = async () => {
    try {
      const data = await api.getMetrics();
      if (data.hyperparameters) {
        setHyperparameters(data.hyperparameters);
      }
    } catch (error) {
      console.error('Failed to load hyperparameters:', error);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage('');
    try {
      await api.updateHyperparameters(hyperparameters);
      setMessage('Hyperparameters updated successfully! Retrain the model to apply changes.');
    } catch (error) {
      console.error('Failed to update hyperparameters:', error);
      setMessage('Failed to update hyperparameters.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async (file?: File) => {
    setRetraining(true);
    setMessage('');
    try {
      const metrics = await api.retrain(file);
      setMessage(`Model retrained successfully! New accuracy: ${(metrics.accuracy * 100).toFixed(2)}%`);
    } catch (error) {
      console.error('Failed to retrain model:', error);
      setMessage('Failed to retrain model.');
    } finally {
      setRetraining(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      await handleRetrain(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Model Hyperparameters
          </CardTitle>
          <CardDescription>Adjust model parameters to optimize performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Random Forest</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Estimators</label>
                <Input
                  type="number"
                  value={hyperparameters.rf_n_estimators}
                  onChange={(e) => setHyperparameters(prev => ({ ...prev, rf_n_estimators: parseInt(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground">Number of trees in the forest</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Depth</label>
                <Input
                  type="number"
                  value={hyperparameters.rf_max_depth}
                  onChange={(e) => setHyperparameters(prev => ({ ...prev, rf_max_depth: parseInt(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground">Maximum depth of trees</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Samples Split</label>
                <Input
                  type="number"
                  value={hyperparameters.rf_min_samples_split}
                  onChange={(e) => setHyperparameters(prev => ({ ...prev, rf_min_samples_split: parseInt(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground">Minimum samples to split node</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">XGBoost</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Estimators</label>
                <Input
                  type="number"
                  value={hyperparameters.xgb_n_estimators}
                  onChange={(e) => setHyperparameters(prev => ({ ...prev, xgb_n_estimators: parseInt(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground">Number of boosting rounds</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Depth</label>
                <Input
                  type="number"
                  value={hyperparameters.xgb_max_depth}
                  onChange={(e) => setHyperparameters(prev => ({ ...prev, xgb_max_depth: parseInt(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground">Maximum tree depth</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Learning Rate</label>
                <Input
                  type="number"
                  step="0.01"
                  value={hyperparameters.xgb_learning_rate}
                  onChange={(e) => setHyperparameters(prev => ({ ...prev, xgb_learning_rate: parseFloat(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground">Step size shrinkage</p>
              </div>
            </div>
          </div>

          <Button onClick={handleUpdate} disabled={loading} className="w-full">
            {loading ? 'Updating...' : 'Update Hyperparameters'}
          </Button>

          {message && (
            <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {message}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Retrain Model
          </CardTitle>
          <CardDescription>Retrain the model with current hyperparameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Button 
              onClick={() => handleRetrain()} 
              disabled={retraining}
              className="w-full"
              variant="outline"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${retraining ? 'animate-spin' : ''}`} />
              {retraining ? 'Retraining...' : 'Retrain with Existing Data'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              {isDragActive ? (
                <p>Drop the training CSV file here...</p>
              ) : (
                <div>
                  <p className="font-medium">Upload New Training Data</p>
                  <p className="text-sm text-muted-foreground mt-1">CSV file with labeled exoplanet data</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
