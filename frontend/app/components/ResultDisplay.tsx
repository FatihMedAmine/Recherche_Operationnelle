interface ResultDisplayProps {
  result: {
    optimal_solution: { [key: string]: number };
    optimal_value: number;
    iterations: { tableau: number[][] }[];
  };
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Solution optimale</h2>
        <p>
          {Object.keys(result.optimal_solution).length === 0 ? (
            'Aucune solution trouvée'
          ) : (
            Object.entries(result.optimal_solution).map(([variable, value], index) => (
              <span key={index}>
                {variable} = {value.toFixed(4)}
                {index < Object.keys(result.optimal_solution).length - 1 ? ', ' : ''}
              </span>
            ))
          )}
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Valeur optimale</h2>
        <p className="text-red-500 font-bold">{(-1 * result.optimal_value).toFixed(4)}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Itérations</h2>
        {result.iterations.map((iteration, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2">Itération {index + 1}</h3>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Base</th>
                  {Array.from({ length: iteration.tableau[0].length - 1 }, (_, i) => (
                    <th key={i} className="border px-2 py-1">{`x${i + 1}`}</th>
                  ))}
                  <th className="border px-2 py-1">RHS</th>
                </tr>
              </thead>
              <tbody>
                {iteration.tableau.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border px-2 py-1">{rowIndex === 0 ? 'Z' : `s${rowIndex}`}</td>
                    {row.map((value, colIndex) => (
                      <td key={colIndex} className="border px-2 py-1">
                        {value.toFixed(4)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultDisplay;