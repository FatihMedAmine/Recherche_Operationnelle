from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS
import numpy as np # type: ignore
from BigM import simplex_big_m
from simplex import simplex_method  # Import the simplex method

app = Flask(__name__)
CORS(app)


@app.route('/solve', methods=['POST'])
def solve_problem():
    try:
        data = request.json

        # retrieve the data from the request
        method = data.get('method')
        num_variables = data.get('numVariables')
        num_constraints = data.get('numConstraints')
        objective = list(map(float, data.get('objective', [])))
        objective_type = data.get('objectiveType')
        constraints = data.get('constraints', [])


        # Check if the method is simplex
        if method == 'simplexe':
            solution = simplex_method(num_variables, num_constraints, objective, objective_type, constraints)

            return jsonify({
                'status': 'success',
                'message': 'Solution trouvée',
                **solution
            }), 200
        
        # Dans votre route /solve, modifiez la partie big-m ainsi :
        elif method == 'big-m':
            solution = simplex_big_m(num_variables, num_constraints, objective, objective_type, constraints)
    
            return jsonify({
                'status': 'success',
                'message': 'Solution trouvée',
                **solution
            }), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)