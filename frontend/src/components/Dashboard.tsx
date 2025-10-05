import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Target, TrendingUp, Zap } from 'lucide-react';
import { api, ModelMetrics } from '@/lib/api';

export function Dashboard() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [featureImportance, setFeatureImportance] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await api.getMetrics();
      setMetrics(data.metrics);
      setFeatureImportance(data.feature_importance);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading metrics...</div>;
  }

  if (!metrics) {
    return <div className="flex items-center justify-center h-64">Failed to load metrics</div>;
  }

  const featureData = Object.entries(featureImportance).map(([name, value]) => ({
    name: name.replace('koi_', ''),
    importance: (value * 100).toFixed(2),
  }));

  const confusionData = metrics.confusion_matrix ? [
    { name: 'True Negative', value: metrics.confusion_matrix[0][0], color: '#10b981' },
    { name: 'False Positive', value: metrics.confusion_matrix[0][1], color: '#f59e0b' },
    { name: 'False Negative', value: metrics.confusion_matrix[1][0], color: '#ef4444' },
    { name: 'True Positive', value: metrics.confusion_matrix[1][1], color: '#3b82f6' },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.accuracy * 100).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Overall model accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precision</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.precision * 100).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Positive predictive value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recall</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.recall * 100).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">True positive rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">F1-Score</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.f1_score * 100).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Harmonic mean of precision & recall</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Feature Importance</CardTitle>
            <CardDescription>Top features contributing to predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureData.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="importance" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Confusion Matrix</CardTitle>
            <CardDescription>Model prediction distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={confusionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {confusionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cross-Validation Score</CardTitle>
          <CardDescription>5-fold cross-validation results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {(metrics.cv_mean * 100).toFixed(2)}% <span className="text-lg text-muted-foreground">± {(metrics.cv_std * 100).toFixed(2)}%</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            The model shows consistent performance across different data splits
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
