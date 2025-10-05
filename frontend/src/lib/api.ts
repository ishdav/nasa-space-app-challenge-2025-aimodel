import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface PredictionResult {
  prediction: string;
  confidence: number;
  probability_confirmed: number;
  probability_not_confirmed: number;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: number[][];
  cv_mean: number;
  cv_std: number;
}

export interface FeatureInfo {
  name: string;
  description: string;
}

export const api = {
  async predict(data: any): Promise<PredictionResult[]> {
    const response = await axios.post(`${API_BASE_URL}/predict`, data);
    return response.data.predictions;
  },

  async predictFile(file: File): Promise<PredictionResult[]> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/predict`, formData);
    return response.data.predictions;
  },

  async getMetrics(): Promise<{
    metrics: ModelMetrics;
    feature_importance: Record<string, number>;
    hyperparameters: Record<string, number>;
  }> {
    const response = await axios.get(`${API_BASE_URL}/metrics`);
    return response.data;
  },

  async getFeatures(): Promise<FeatureInfo[]> {
    const response = await axios.get(`${API_BASE_URL}/features`);
    return response.data.features;
  },

  async updateHyperparameters(params: Record<string, number>): Promise<void> {
    await axios.post(`${API_BASE_URL}/hyperparameters`, params);
  },

  async retrain(file?: File): Promise<ModelMetrics> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    const response = await axios.post(`${API_BASE_URL}/retrain`, formData);
    return response.data.metrics;
  },

  async getSampleData(): Promise<any[]> {
    const response = await axios.get(`${API_BASE_URL}/sample-data`);
    return response.data.sample_data;
  },

  async batchPredict(data: any[]): Promise<PredictionResult[]> {
    const response = await axios.post(`${API_BASE_URL}/batch-predict`, data);
    return response.data.predictions;
  },
};
