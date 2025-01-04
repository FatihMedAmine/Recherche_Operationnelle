interface ResultDisplayProps {
  result: {
    optimal_solution: number[];
    optimal_value: number;
    iterations: any[];
  }
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Solution optimale</h2>
        <p>
          {result.optimal_solution.map((value, index) => (
            <span key={index}>
              x{index + 1} = {value.toFixed(4)}
              {index < result.optimal_solution.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Valeur optimale</h2>
        <p>{result.optimal_value.toFixed(4)}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Itérations</h2>
        {result.iterations.map((iteration, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2">Itération {index + 1}</h3>
            <pre className="whitespace-pre-wrap">{JSON.stringify(iteration, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultDisplay

