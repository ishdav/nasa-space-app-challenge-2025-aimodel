import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dashboard } from '@/components/Dashboard';
import { Predictor } from '@/components/Predictor';
import { Settings } from '@/components/Settings';
import { About } from '@/components/About';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Telescope, BarChart3, Sparkles, Settings as SettingsIcon, Info } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Telescope className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Exoplanet Detection System</h1>
                <p className="text-muted-foreground">AI-powered exoplanet classification using NASA data</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="predict" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Predict
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="predict">
            <Predictor />
          </TabsContent>

          <TabsContent value="settings">
            <Settings />
          </TabsContent>

          <TabsContent value="about">
            <About />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built for NASA Space Apps Challenge 2025</p>
            <p className="mt-1">Data from Kepler, K2, and TESS missions • Powered by ML ensemble models</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
