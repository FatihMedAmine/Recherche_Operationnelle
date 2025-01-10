from flask import Flask, request, jsonify
from flask_cors import CORS
from simplex import simplex_method
from two_phase import two_phase_simplex  # Import de la méthode à deux phases

app = Flask(__name__)
CORS(app)


@app.route('/solve', methods=['POST'])
def solve_problem():
    try:
        data = request.json

        # Récupération des données de la requête
        method = data.get('method')
        num_variables = data.get('numVariables')
        num_constraints = data.get('numConstraints')
        objective = list(map(float, data.get('objective', [])))
        objective_type = data.get('objectiveType')
        constraints = data.get('constraints', [])

        # Validation des entrées
        if not method or not num_variables or not num_constraints or not objective or not constraints:
            return jsonify({'status': 'error', 'message': 'Données incomplètes ou incorrectes'}), 400

        # Sélection de la méthode de résolution
        try:
            if method == 'simplexe':
                solution = simplex_method(num_variables, num_constraints, objective, objective_type, constraints)
                return jsonify({
                    'status': 'success',
                    'message': 'Solution trouvée',
                    **solution
                }), 200
                
            elif method == 'deux-phases':
                solution = two_phase_simplex(num_variables, num_constraints, objective, objective_type, constraints)
                return jsonify({
                    'status': 'success',
                    'message': 'Solution trouvée avec la méthode à deux phases',
                    **solution
                }), 200
                
            else:
                return jsonify({
                    'status': 'error', 
                    'message': 'Méthode non supportée'
                }), 400

        except ValueError as ve:
            return jsonify({
                'status': 'error',
                'message': str(ve)
            }), 400

        except Exception as e:
            return jsonify({
                'status': 'error',
                'message': f'Erreur lors de la résolution: {str(e)}'
            }), 500

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Erreur du serveur: {str(e)}'
        }), 500


if __name__ == "__main__":
    app.run(debug=True)