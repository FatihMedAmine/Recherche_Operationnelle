import numpy as np


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
            tableau[i + 1, num_variables + i] = 1  # Slack variable
        elif constraints[i]['type'] == '>=':
            tableau[i + 1, num_variables + i] = -1  # Surplus variable
            # Handle artificial variable requirement
            tableau = np.hstack((tableau, np.zeros((tableau.shape[0], 1))))
            tableau[i + 1, -2] = 1

    # Check feasibility for >= constraints
    for i in range(1, num_constraints + 1):
        if tableau[i, -1] < 0:
            raise ValueError("Solution initiale non faisable. Utilisez Big M ou la méthode à deux phases.")

    # Simplex algorithm
    def pivot(tableau):
        # Find the pivot column (most negative value in the objective row)
        pivot_col = np.argmin(tableau[0, :-1])
        if tableau[0, pivot_col] >= 0:
            return False  # Optimal solution found

        # Check for unboundedness
        if all(tableau[1:, pivot_col] <= 0):
            raise ValueError("Problème non borné")

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
