const API_BASE_URL = 'http://localhost:5000'  // Remplacez par l'URL de votre API Flask

export async function solveProblem(problemData: any) {
  const response = await fetch(`${API_BASE_URL}/solve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(problemData),
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la résolution du problème')
  }

  return response.json()
}

