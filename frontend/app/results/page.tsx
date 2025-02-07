'use client';

import { Suspense } from 'react';
import Header from '../components/Header';
import ResultDisplay from '../components/ResultDisplay';
import ResultsContent from './ResultsContent'; // Nouveau composant

export default function Results() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Résultats de l'Optimisation</h1>
        <Suspense fallback={<p>Chargement des résultats...</p>}>
          <ResultsContent />
        </Suspense>
      </main>

      <footer className="bg-gray-200 py-4">
        <div className="container mx-auto text-center">
          &copy; 2023 OptimLinéaire. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
