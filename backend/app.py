import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Hello, Flask!"

@app.route("/test/<name>")
def test(name):
    return f"Bonjour, {name}!"

def simplex_method(num_variables, num_constraints, objective, objective_type, constraints):
    # Convert the objective function for maximization
    if objective_type == 'max':
        objective = [-coef for coef in objective]

    # Initialize the tableau
    tableau = np.zeros((num_constraints + 1, num_variables + num_constraints + 1))
    
    # Set the objective function in the tableau
    tableau[0, :num_variables] = objective
    
    # Set the constraints in the tableau
    for i in range(num_constraints):
        tableau[i + 1, :num_variables] = constraints[i]['coefficients']
        tableau[i + 1, -1] = constraints[i]['rhs']
        if constraints[i]['type'] == '<=':
            tableau[i + 1, num_variables + i] = 1
        elif constraints[i]['type'] == '>=':
            tableau[i + 1, num_variables + i] = -1

    # Simplex algorithm
    def pivot(tableau):
        # Find the pivot column (most negative value in the objective row)
        pivot_col = np.argmin(tableau[0, :-1])
        if tableau[0, pivot_col] >= 0:
            return False  # Optimal solution found

        # Find the pivot row (minimum positive ratio of RHS to pivot column)
        ratios = tableau[1:, -1] / tableau[1:, pivot_col]
        pivot_row = np.where(ratios > 0, ratios, np.inf).argmin() + 1

        # Perform the pivot operation
        tableau[pivot_row] /= tableau[pivot_row, pivot_col]
        for i in range(len(tableau)):
            if i != pivot_row:
                tableau[i] -= tableau[i, pivot_col] * tableau[pivot_row]

        return True

    iteration_details = []
    while pivot(tableau):
        iteration_details.append({
            'tableau': tableau.copy().tolist()
        })

    # Extract the solution
    solution = np.zeros(num_variables)
    for i in range(num_variables):
        col = tableau[1:, i]
        if np.count_nonzero(col) == 1 and np.sum(col) == 1:
            solution[i] = tableau[np.where(col == 1)[0][0] + 1, -1]

    optimal_value = -tableau[0, -1] if objective_type == 'max' else tableau[0, -1]

    return {
        'optimal_value': optimal_value,
        'optimal_solution': {f"x{i+1}": solution[i] for i in range(num_variables)},
        'iterations': iteration_details
    }

@app.route('/solve', methods=['POST'])
def solve_problem():
    try:
        data = request.json

        num_variables = data.get('numVariables')
        num_constraints = data.get('numConstraints')
        objective = list(map(float, data.get('objective', [])))
        objective_type = data.get('objectiveType', 'max')
        constraints = data.get('constraints', [])

        solution = simplex_method(num_variables, num_constraints, objective, objective_type, constraints)

        return jsonify({
            'status': 'success',
            'message': 'Solution trouvée',
            **solution
        }), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)