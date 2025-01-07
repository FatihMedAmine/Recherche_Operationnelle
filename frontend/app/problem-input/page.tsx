'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, AlertCircle, X } from 'lucide-react'
import Link from 'next/link'
import Header from '../components/Header'
import ProblemForm from '../components/ProblemForm'
import { solveProblem } from '../lib/api'
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert'

const ErrorAlert = ({ error, onDismiss }: { error: string, onDismiss: () => void }) => (
  <Alert variant="destructive" className="mb-6 relative">
    <AlertCircle className="h-4 w-4 absolute top-4 left-4" />
    <button 
      onClick={onDismiss}
      className="absolute top-4 right-4 text-red-800 hover:text-red-900"
    >
      <X className="h-4 w-4" />
    </button>
    <div className="ml-6">
      <AlertTitle className="text-lg font-semibold mb-2">
        Erreur lors de la résolution
      </AlertTitle>
      <AlertDescription className="space-y-3 text-sm">
        <p>{error}</p>
        <p className="font-medium">Suggestions :</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Vérifiez que toutes les contraintes sont bien définies</li>
          <li>Assurez-vous que la fonction objectif est correctement formulée</li>
          <li>Contrôlez que les coefficients sont des nombres valides</li>
          <li>Vérifiez que le système n'est pas surdéterminé</li>
        </ul>
        <p className="text-sm italic mt-2">
          Si le problème persiste, essayez de reformuler votre problème ou contactez le support.
        </p>
      </AlertDescription>
    </div>
  </Alert>
);

export default function ProblemInput() {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (problemData: any) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = await solveProblem(problemData)
      console.log(result)
      router.push(`/results?data=${encodeURIComponent(JSON.stringify(result))}`)
    } catch (err) {
      setError('Le solveur a rencontré une difficulté avec les données fournies. Veuillez vérifier vos entrées et réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Retour à l'accueil
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Nouveau Problème d'Optimisation
            </h1>
            <p className="text-gray-600 mb-8">
              Entrez les détails de votre problème d'optimisation linéaire ci-dessous.
              Notre solveur utilisera les méthodes Simplexe et Big M pour trouver la solution optimale.
            </p>

            {error && (
              <ErrorAlert 
                error={error} 
                onDismiss={() => setError(null)}
              />
            )}

            <div className="space-y-6">
              <ProblemForm 
                onSubmit={handleSubmit} 
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same */}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} OptimLinéaire. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}