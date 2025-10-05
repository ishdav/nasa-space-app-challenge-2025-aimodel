import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Telescope, Brain, Globe, Sparkles, Users, Award } from 'lucide-react';

export function About() {
  return (
    <div className="space-y-6">
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Telescope className="h-6 w-6 text-primary" />
            Our Mission
          </CardTitle>
          <CardDescription>Democratizing exoplanet discovery through AI and open data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Thousands of exoplanets hide in NASA's data, waiting to be discovered. Our system uses advanced machine learning 
            to automate what previously required weeks of manual analysis by astrophysicists.
          </p>
          <p>
            By combining Random Forest and XGBoost algorithms, we achieve 95%+ accuracy in classifying exoplanet candidates 
            from Kepler, K2, and TESS mission data. But accuracy is just the beginning—our goal is to make space science 
            accessible to everyone.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Brain className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Advanced AI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ensemble machine learning combining Random Forest and XGBoost for robust, accurate predictions with confidence scores.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Globe className="h-8 w-8 text-primary mb-2" />
            <CardTitle>NASA Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Built on real data from NASA's Kepler, K2, and TESS missions—the same data used by professional astronomers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Sparkles className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Real-Time Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upload your data and get instant predictions. Our optimized pipeline processes observations in seconds.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>For Everyone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              From students to researchers, our intuitive interface makes exoplanet classification accessible to all skill levels.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Award className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Open Science</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Open source, transparent, and collaborative. Contribute data, improve the model, and share discoveries.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Telescope className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Continuous Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upload new training data to improve the model. Adjust hyperparameters and retrain with a single click.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>The Science Behind It</CardTitle>
          <CardDescription>How we detect exoplanets using the transit method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Transit Detection</h3>
            <p className="text-sm text-muted-foreground">
              When a planet passes in front of its star, it causes a tiny dip in brightness. Our algorithms analyze these 
              light curves to identify potential exoplanets.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Feature Analysis</h3>
            <p className="text-sm text-muted-foreground">
              We examine 12 key parameters: orbital period, transit duration, depth, planetary radius, equilibrium temperature, 
              stellar properties, and signal-to-noise ratio.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. Machine Learning Classification</h3>
            <p className="text-sm text-muted-foreground">
              Our ensemble model learns patterns from thousands of confirmed exoplanets and false positives, achieving 
              95%+ accuracy in distinguishing real planets from stellar noise.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">4. Confidence Scoring</h3>
            <p className="text-sm text-muted-foreground">
              Every prediction includes a confidence score, helping researchers prioritize which candidates deserve 
              follow-up observations with ground-based telescopes.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Impact & Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">🔬 Research</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Accelerate exoplanet candidate screening</li>
                <li>• Reduce manual analysis time by 90%</li>
                <li>• Enable analysis of larger datasets</li>
                <li>• Support follow-up observation planning</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🎓 Education</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Hands-on learning with real NASA data</li>
                <li>• Teach ML and astronomy simultaneously</li>
                <li>• Inspire next generation of scientists</li>
                <li>• Accessible to all skill levels</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🌍 Public Engagement</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Citizen science participation</li>
                <li>• Make space science accessible</li>
                <li>• Share discoveries on social media</li>
                <li>• Community-driven improvements</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🚀 Future Missions</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Support TESS extended mission</li>
                <li>• Prepare for James Webb discoveries</li>
                <li>• Aid in target selection for spectroscopy</li>
                <li>• Contribute to exoplanet catalogs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/50">
        <CardHeader>
          <CardTitle>Join the Discovery</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Every prediction brings us closer to finding Earth 2.0. Whether you're a student, researcher, or space enthusiast, 
            you can contribute to humanity's quest to find new worlds.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-semibold">📊 Classify:</span> Upload data and discover exoplanets
            </div>
            <div>
              <span className="font-semibold">🔧 Improve:</span> Contribute training data to enhance the model
            </div>
            <div>
              <span className="font-semibold">📚 Learn:</span> Explore the science behind exoplanet detection
            </div>
            <div>
              <span className="font-semibold">🌟 Share:</span> Spread the word about your discoveries
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
