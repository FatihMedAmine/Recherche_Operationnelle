import { ArrowRight, Calculator, Clock, LineChart } from 'lucide-react';
import Header from './components/Header';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Méthode Simplexe à deux phases",
      description: "Résolvez des problèmes complexes d'optimisation linéaire étape par étape"
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Méthode Big M",
      description: "Une approche alternative pour résoudre vos problèmes d'optimisation"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Résolution rapide",
      description: "Obtenez des résultats précis en quelques secondes"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              OptimLinéaire
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Optimisez vos décisions avec notre solution puissante de résolution 
              de problèmes d'optimisation linéaire
            </p>
            <Link
              href="/problem-input"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} OptimLinéaire. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}