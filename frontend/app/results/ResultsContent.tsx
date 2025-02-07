'use client';

import { useSearchParams } from 'next/navigation';
import ResultDisplay from '../components/ResultDisplay';

export default function ResultsContent() {
  const searchParams = useSearchParams();
  const resultData = searchParams.get('data');

  let parsedResult;
  try {
    console.log('Result data:', resultData);
    parsedResult = resultData ? JSON.parse(decodeURIComponent(resultData)) : null;
  } catch (error) {
    console.error('Error parsing result:', error);
    parsedResult = null;
  }

  return (
    <>
      {parsedResult ? (
        <ResultDisplay result={parsedResult} />
      ) : (
        <p>Aucun résultat à afficher. Veuillez résoudre un problème d'abord.</p>
      )}
    </>
  );
}
