import numpy as np
from typing import List, Dict, Tuple, Union

def create_tableau(num_variables: int, num_constraints: int, objective: List[float], 
                  constraints: List[Dict], M: float = 1000.0) -> Tuple[np.ndarray, int, int]:
    """
    Create the initial tableau for Big-M method
    """
    # Count artificial and slack variables needed
    num_artificial = sum(1 for c in constraints if c['type'] in ['>=', '='])
    num_slack = sum(1 for c in constraints if c['type'] in ['<=', '>='])
    
    # Initialize tableau
    num_cols = num_variables + num_slack + num_artificial + 1
    num_rows = num_constraints + 1
    tableau = np.zeros((num_rows, num_cols))
    
    # Set up objective row (negative of coefficients for maximization)
    for i in range(num_variables):
        tableau[0, i] = -float(objective[i])
    
    # Set up constraints
    slack_idx = num_variables
    artificial_idx = num_variables + num_slack
    
    for i, constraint in enumerate(constraints, 1):
        # Original variables coefficients
        for j in range(num_variables):
            tableau[i, j] = float(constraint['coefficients'][j])
            
        # RHS
        tableau[i, -1] = float(constraint['rhs'])
        
        # Handle different types of constraints
        if constraint['type'] == '<=':
            tableau[i, slack_idx] = 1.0
            slack_idx += 1
            
        elif constraint['type'] == '>=':
            tableau[i, slack_idx] = -1.0
            tableau[i, artificial_idx] = 1.0
            tableau[0, artificial_idx] = M
            tableau[0] -= M * tableau[i]
            slack_idx += 1
            artificial_idx += 1
            
        elif constraint['type'] == '=':
            tableau[i, artificial_idx] = 1.0
            tableau[0, artificial_idx] = M
            tableau[0] -= M * tableau[i]
            artificial_idx += 1
    
    return tableau, num_slack, num_artificial

def find_basis_variable(col):
    """Helper function to find the basic variable in a column"""
    nonzero_indices = np.nonzero(col)[0]
    if len(nonzero_indices) == 1:
        idx = nonzero_indices[0]
        if abs(col[idx] - 1.0) < 1e-10:
            return idx
    return None

def simplex_big_m(num_variables: int, num_constraints: int, objective: List[float], 
                  objective_type: str, constraints: List[Dict]) -> Dict:
    """
    Solve linear programming problem using Big-M method
    """
    # Convert minimization to maximization
    if objective_type == 'min':
        objective = [-float(x) for x in objective]
    
    # Create initial tableau
    tableau, num_slack, num_artificial = create_tableau(num_variables, num_constraints, 
                                                      objective, constraints)
    
    iterations = []
    
    while True:
        # Store current iteration
        iterations.append({
            'tableau': tableau.tolist()
        })
        
        # Find pivot column (most negative in objective row)
        pivot_col = np.argmin(tableau[0, :-1])
        if tableau[0, pivot_col] >= -1e-10:  # Numerical tolerance
            break
        
        # Find pivot row using minimum ratio test
        ratios = []
        for i in range(1, tableau.shape[0]):
            if tableau[i, pivot_col] > 1e-10:  # Positive entries only
                ratio = tableau[i, -1] / tableau[i, pivot_col]
                ratios.append((ratio, i))
        
        if not ratios:  # Unbounded problem
            return {
                'optimal_solution': {},
                'optimal_value': None,
                'iterations': iterations,
                'status': 'unbounded'
            }
        
        # Select pivot row with minimum ratio
        pivot_row = min(ratios)[1]
        
        # Perform pivot operation
        pivot_value = tableau[pivot_row, pivot_col]
        tableau[pivot_row] /= pivot_value
        
        for i in range(tableau.shape[0]):
            if i != pivot_row:
                factor = tableau[i, pivot_col]
                tableau[i] -= factor * tableau[pivot_row]
    
    # Extract solution using basis variables
    solution = {}
    for j in range(num_variables):
        basis_row = find_basis_variable(tableau[:, j])
        if basis_row is not None:
            solution[f'x{j+1}'] = tableau[basis_row, -1]
        else:
            solution[f'x{j+1}'] = 0.0
    
    optimal_value = tableau[0, -1] if objective_type == 'min' else -tableau[0, -1]
    
    # Check for artificial variables in basis
    artificial_start = num_variables + num_slack
    for j in range(artificial_start, tableau.shape[1]-1):
        basis_row = find_basis_variable(tableau[:, j])
        if basis_row is not None and abs(tableau[basis_row, -1]) > 1e-10:
            return {
                'optimal_solution': {},
                'optimal_value': None,
                'iterations': iterations,
                'status': 'infeasible'
            }
    
    return {
        'optimal_solution': solution,
        'optimal_value': optimal_value,
        'iterations': iterations,
        'status': 'optimal'
    }