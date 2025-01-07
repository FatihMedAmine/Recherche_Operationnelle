'use client'

import { useSearchParams } from 'next/navigation'
import Header from '../components/Header'
import ResultDisplay from '../components/ResultDisplay'

export default function Results() {
  const searchParams = useSearchParams()
  const resultData = searchParams.get('data')

  let parsedResult
  try {
    console.log('Result data:', resultData)
    parsedResult = resultData ? JSON.parse(decodeURIComponent(resultData)) : null
  } catch (error) {
    console.error('Error parsing result:', error)
    parsedResult = null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Résultats de l'Optimisation</h1>
        {parsedResult ? (
          <ResultDisplay result={parsedResult} />
        ) : (
          <p>Aucun résultat à afficher. Veuillez résoudre un problème d'abord.</p>
        )}
      </main>

      <footer className="bg-gray-200 py-4">
        <div className="container mx-auto text-center">
          &copy; 2023 OptimLinéaire. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}

