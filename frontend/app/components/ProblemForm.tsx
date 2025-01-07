import { useState } from 'react';
import { PlusCircle, MinusCircle, HelpCircle } from 'lucide-react';

interface ProblemFormProps {
  onSubmit: (problemData: any) => void;
  isSubmitting?: boolean;
}

const ProblemForm: React.FC<ProblemFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [numVariables, setNumVariables] = useState(2);
  const [numConstraints, setNumConstraints] = useState(2);
  const [objective, setObjective] = useState(['1', '1']);
  const [objectiveType, setObjectiveType] = useState<'max' | 'min'>('max');
  const [constraints, setConstraints] = useState([
    { coefficients: ['1', '1'], type: '<=', rhs: '10' },
    { coefficients: ['1', '1'], type: '<=', rhs: '10' },
  ]);
  const [method, setMethod] = useState('simplexe');
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      numVariables,
      numConstraints,
      objective,
      objectiveType,
      constraints,
      method,
    });
  };

  const updateObjective = (index: number, value: string) => {
    const newObjective = [...objective];
    newObjective[index] = value;
    setObjective(newObjective);
  };

  const updateConstraint = (
    constraintIndex: number,
    coeffIndex: number,
    value: string
  ) => {
    const newConstraints = [...constraints];
    newConstraints[constraintIndex].coefficients[coeffIndex] = value;
    setConstraints(newConstraints);
  };

  const handleVariableChange = (newNum: number) => {
    if (newNum >= 1 && newNum <= 10) {
      setNumVariables(newNum);
      setObjective(Array(newNum).fill('1'));
      
      // Mettre à jour les coefficients des contraintes
      setConstraints((prevConstraints) =>
        prevConstraints.map((constraint) => {
          const updatedCoefficients = constraint.coefficients.slice(0, newNum);
          return {
            ...constraint,
            coefficients: [...updatedCoefficients, ...Array(newNum - updatedCoefficients.length).fill('1')]
          };
        })
      );
    }
  };
  

  const handleConstraintChange = (newNum: number) => {
    if (newNum >= 1 && newNum <= 10) {
      setNumConstraints(newNum);
      
      setConstraints((prevConstraints) => {
        if (newNum > prevConstraints.length) {
          // Ajouter des contraintes si le nombre a augmenté
          const newConstraints = [...prevConstraints];
          for (let i = prevConstraints.length; i < newNum; i++) {
            newConstraints.push({
              coefficients: Array(numVariables).fill('1'),
              type: '<=',
              rhs: '10',
            });
          }
          return newConstraints;
        } else if (newNum < prevConstraints.length) {
          // Supprimer les contraintes excédentaires
          return prevConstraints.slice(0, newNum);
        }
        return prevConstraints;
      });
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Configuration initiale */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              Nombre de variables (max. 10)
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleVariableChange(numVariables - 1)}
                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                disabled={numVariables <= 1}
              >
                <MinusCircle className="w-5 h-5" />
              </button>
              <input
                type="number"
                value={numVariables}
                onChange={(e) => handleVariableChange(parseInt(e.target.value))}
                min="1"
                max="10"
                className="w-16 p-2 border rounded-lg text-center text-gray-900"
              />
              <button
                type="button"
                onClick={() => handleVariableChange(numVariables + 1)}
                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                disabled={numVariables >= 10}
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              Nombre de contraintes (max. 10)
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleConstraintChange(numConstraints - 1)}
                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                disabled={numConstraints <= 1}
              >
                <MinusCircle className="w-5 h-5" />
              </button>
              <input
                type="number"
                value={numConstraints}
                onChange={(e) => handleConstraintChange(parseInt(e.target.value))}
                min="1"
                max="10"
                className="w-16 p-2 border rounded-lg text-center text-gray-900"
              />
              <button
                type="button"
                onClick={() => handleConstraintChange(numConstraints + 1)}
                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                disabled={numConstraints >= 10}
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Méthode de résolution
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white text-gray-900"
          >
            <option value="simplexe">Simplexe</option>
            <option value="deux-phases">Simplexe à deux phases</option>
            <option value="big-m">Big M</option>
          </select>
        </div>
      </div>

      {/* Fonction objectif */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Fonction objectif à
            </label>
            <select
              value={objectiveType}
              onChange={(e) => setObjectiveType(e.target.value as 'max' | 'min')}
              className="p-2 border rounded-lg bg-white text-gray-900"
            >
              <option value="max">maximiser</option>
              <option value="min">minimiser</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="text-gray-500 hover:text-gray-700"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-lg">
          {objective.map((coeff, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                value={coeff}
                onChange={(e) => updateObjective(index, e.target.value)}
                className="w-16 p-2 border rounded-lg text-center text-gray-900"
                placeholder="0"
              />
              <span className="ml-1 text-gray-600">x{index + 1}</span>
              {index < objective.length - 1 && (
                <span className="mx-2 text-gray-400">+</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contraintes */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Contraintes
        </label>
        <div className="space-y-3">
          {constraints.map((constraint, constraintIndex) => (
            <div
              key={constraintIndex}
              className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-lg"
            >
              {constraint.coefficients.map((coeff, coeffIndex) => (
                <div key={coeffIndex} className="flex items-center">
                  <input
                    type="text"
                    value={coeff}
                    onChange={(e) =>
                      updateConstraint(constraintIndex, coeffIndex, e.target.value)
                    }
                    className="w-16 p-2 border rounded-lg text-center text-gray-900"
                    placeholder="0"
                  />
                  <span className="ml-1 text-gray-600">x{coeffIndex + 1}</span>
                  {coeffIndex < constraint.coefficients.length - 1 && (
                    <span className="mx-2 text-gray-400">+</span>
                  )}
                </div>
              ))}
              <select
                value={constraint.type}
                onChange={(e) =>
                  setConstraints(
                    constraints.map((c, idx) =>
                      idx === constraintIndex
                        ? { ...c, type: e.target.value }
                        : c
                    )
                  )
                }
                className="p-2 border rounded-lg bg-white text-gray-900"
              >
                <option value="<=">≤</option>
                <option value=">=">≥</option>
                <option value="=">=</option>
              </select>
              <input
                type="text"
                value={constraint.rhs}
                onChange={(e) =>
                  setConstraints(
                    constraints.map((c, idx) =>
                      idx === constraintIndex
                        ? { ...c, rhs: e.target.value }
                        : c
                    )
                  )
                }
                className="w-16 p-2 border rounded-lg text-center text-gray-900"
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Résolution...' : 'Résoudre'}
        </button>
      </div>
    </form>
  );
};

export default ProblemForm;