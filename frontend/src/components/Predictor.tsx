import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { api, PredictionResult } from '@/lib/api';
import { useDropzone } from 'react-dropzone';

export function Predictor() {
  const [formData, setFormData] = useState<Record<string, string>>({
    koi_period: '',
    koi_time0bk: '',
    koi_impact: '',
    koi_duration: '',
    koi_depth: '',
    koi_prad: '',
    koi_teq: '',
    koi_insol: '',
    koi_model_snr: '',
    koi_steff: '',
    koi_slogg: '',
    koi_srad: '',
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileResults, setFileResults] = useState<PredictionResult[] | null>(null);

  const features = [
    { name: 'koi_period', label: 'Orbital Period', unit: 'days' },
    { name: 'koi_time0bk', label: 'Transit Epoch', unit: 'BJD - 2454833' },
    { name: 'koi_impact', label: 'Impact Parameter', unit: '' },
    { name: 'koi_duration', label: 'Transit Duration', unit: 'hours' },
    { name: 'koi_depth', label: 'Transit Depth', unit: 'ppm' },
    { name: 'koi_prad', label: 'Planetary Radius', unit: 'Earth radii' },
    { name: 'koi_teq', label: 'Equilibrium Temp', unit: 'K' },
    { name: 'koi_insol', label: 'Insolation Flux', unit: 'Earth flux' },
    { name: 'koi_model_snr', label: 'Signal-to-Noise', unit: '' },
    { name: 'koi_steff', label: 'Stellar Temp', unit: 'K' },
    { name: 'koi_slogg', label: 'Stellar Gravity', unit: 'log10(cm/s²)' },
    { name: 'koi_srad', label: 'Stellar Radius', unit: 'Solar radii' },
  ];

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const data = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, parseFloat(value)])
      );
      const results = await api.predict(data);
      setPrediction(results[0]);
      setFileResults(null);
    } catch (error) {
      console.error('Prediction failed:', error);
      alert('Prediction failed. Please check your input values.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = async () => {
    try {
      const samples = await api.getSampleData();
      if (samples.length > 0) {
        const sample = samples[0];
        const newFormData: Record<string, string> = {};
        features.forEach(f => {
          newFormData[f.name] = sample[f.name]?.toString() || '';
        });
        setFormData(newFormData);
      }
    } catch (error) {
      console.error('Failed to load sample data:', error);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setLoading(true);
    try {
      const results = await api.predictFile(acceptedFiles[0]);
      setFileResults(results);
      setPrediction(null);
    } catch (error) {
      console.error('File prediction failed:', error);
      alert('File prediction failed. Please check the file format.');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manual Input</CardTitle>
            <CardDescription>Enter exoplanet transit parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {features.map(feature => (
                <div key={feature.name} className="space-y-2">
                  <label className="text-sm font-medium">
                    {feature.label}
                    {feature.unit && <span className="text-muted-foreground ml-1">({feature.unit})</span>}
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={formData[feature.name]}
                    onChange={(e) => handleInputChange(feature.name, e.target.value)}
                    placeholder="0.0"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handlePredict} disabled={loading} className="flex-1">
                <Sparkles className="mr-2 h-4 w-4" />
                {loading ? 'Predicting...' : 'Predict'}
              </Button>
              <Button onClick={loadSampleData} variant="outline">
                Load Sample
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File Upload</CardTitle>
            <CardDescription>Upload CSV file for batch prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              {isDragActive ? (
                <p>Drop the CSV file here...</p>
              ) : (
                <div>
                  <p className="text-lg font-medium">Drag & drop CSV file</p>
                  <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                </div>
              )}
            </div>

            {fileResults && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Results: {fileResults.length} predictions</p>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {fileResults.slice(0, 10).map((result, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">Row {idx + 1}</span>
                      <span className={`text-sm font-medium ${result.prediction === 'CONFIRMED' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {result.prediction} ({(result.confidence * 100).toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                  {fileResults.length > 10 && (
                    <p className="text-sm text-muted-foreground text-center">
                      ... and {fileResults.length - 10} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {prediction && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {prediction.prediction === 'CONFIRMED' ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-yellow-500" />
              )}
              Prediction Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold">
                  {prediction.prediction}
                </p>
                <p className="text-muted-foreground">
                  Confidence: {(prediction.confidence * 100).toFixed(2)}%
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Confirmed Probability</p>
                  <p className="text-2xl font-bold text-green-500">
                    {(prediction.probability_confirmed * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Not Confirmed Probability</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {(prediction.probability_not_confirmed * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
