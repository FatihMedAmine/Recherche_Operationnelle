import numpy as np
from typing import List, Dict, Tuple

def two_phase_simplex(num_variables: int, num_constraints: int, 
                     objective: List[float], objective_type: str, 
                     constraints: List[Dict]) -> Dict:
    """
    Implémente la méthode du simplexe à deux phases pour résoudre un problème de programmation linéaire
    """
    # Conversion des contraintes en format matriciel
    A, b, constraint_types = prepare_constraints(num_variables, constraints)
    c = np.array(objective)
    
    # Ajustement si l'objectif est une minimisation
    if objective_type == 'min':
        c = -c
    
    # Phase 1: Trouver une solution de base admissible
    basic_feasible_solution, is_feasible = phase_one(A, b, constraint_types)
    
    if not is_feasible:
        raise ValueError("Le problème n'a pas de solution réalisable")
    
    # Phase 2: Optimiser la fonction objectif
    result = phase_two(A, b, c, basic_feasible_solution)
    
    # Préparer le résultat
    return format_result(result, num_variables, objective_type)

def prepare_constraints(num_variables: int, 
                       constraints: List[Dict]) -> Tuple[np.ndarray, np.ndarray, List[str]]:
    """
    Convertit les contraintes en format matriciel
    """
    A = []
    b = []
    constraint_types = []
    
    for constraint in constraints:
        coefficients = np.array([float(x) for x in constraint['coefficients']])
        rhs = float(constraint['rhs'])
        
        if constraint['type'] == '>=':
            A.append(-coefficients)
            b.append(-rhs)
            constraint_types.append('>=')
        else:
            A.append(coefficients)
            b.append(rhs)
            constraint_types.append(constraint['type'])
    
    return np.array(A), np.array(b), constraint_types

def phase_one(A: np.ndarray, b: np.ndarray, 
              constraint_types: List[str]) -> Tuple[np.ndarray, bool]:
    """
    Phase 1 du simplexe à deux phases: trouver une solution de base admissible
    """
    m, n = A.shape
    
    # Construire le tableau de la phase 1
    artificial_vars = np.eye(m)
    tableau = np.zeros((m + 1, n + m + 1))
    tableau[1:, :n] = A
    tableau[1:, n:n+m] = artificial_vars
    tableau[1:, -1] = b
    
    # Fonction objectif artificielle
    tableau[0, n:n+m] = 1
    tableau[0, :n] = 0
    tableau[0, -1] = 0
    
    # Appliquer la méthode du simplexe sur le problème artificiel
    basic_vars = list(range(n, n + m))
    iterations = []
    
    while True:
        iterations.append(tableau.copy())
        
        # Trouver la variable entrante
        entering_col = np.argmin(tableau[0, :-1])
        if tableau[0, entering_col] >= -1e-10:
            break
            
        # Trouver la variable sortante (ratio test)
        ratios = []
        for i in range(1, m + 1):
            if tableau[i, entering_col] <= 0:
                ratios.append(float('inf'))
            else:
                ratios.append(tableau[i, -1] / tableau[i, entering_col])
        
        leaving_row = np.argmin(ratios[1:]) + 1
        if ratios[leaving_row] == float('inf'):
            raise ValueError("Le problème est non borné")
            
        # Pivot
        pivot = tableau[leaving_row, entering_col]
        tableau[leaving_row] = tableau[leaving_row] / pivot
        
        for i in range(m + 1):
            if i != leaving_row:
                tableau[i] = tableau[i] - tableau[i, entering_col] * tableau[leaving_row]
                
        basic_vars[leaving_row - 1] = entering_col
    
    # Vérifier si une solution réalisable existe
    is_feasible = abs(tableau[0, -1]) < 1e-10
    
    return basic_vars, is_feasible

def phase_two(A: np.ndarray, b: np.ndarray, c: np.ndarray, 
             basic_vars: np.ndarray) -> Dict:
    """
    Phase 2 du simplexe à deux phases: optimiser la fonction objectif
    """
    m, n = A.shape
    
    # Construire le tableau initial de la phase 2
    tableau = np.zeros((m + 1, n + 1))
    tableau[1:, :n] = A
    tableau[1:, -1] = b
    tableau[0, :n] = -c
    
    iterations = []
    optimal_solution = np.zeros(n)
    
    while True:
        iterations.append(tableau.copy())
        
        # Trouver la variable entrante
        entering_col = np.argmin(tableau[0, :-1])
        if tableau[0, entering_col] >= -1e-10:
            # Solution optimale trouvée
            for i, var in enumerate(basic_vars):
                if var < n:
                    optimal_solution[var] = tableau[i+1, -1]
            break
            
        # Trouver la variable sortante
        ratios = []
        for i in range(1, m + 1):
            if tableau[i, entering_col] <= 0:
                ratios.append(float('inf'))
            else:
                ratios.append(tableau[i, -1] / tableau[i, entering_col])
        
        leaving_row = np.argmin(ratios) + 1
        if ratios[leaving_row-1] == float('inf'):
            raise ValueError("Le problème est non borné")
        
        # Pivot
        pivot = tableau[leaving_row, entering_col]
        tableau[leaving_row] = tableau[leaving_row] / pivot
        
        for i in range(m + 1):
            if i != leaving_row:
                tableau[i] = tableau[i] - tableau[i, entering_col] * tableau[leaving_row]
        
        basic_vars[leaving_row - 1] = entering_col
    
    return {
        'optimal_solution': optimal_solution,
        'optimal_value': tableau[0, -1],
        'iterations': iterations
    }

def format_result(result: Dict, num_variables: int, objective_type: str) -> Dict:
    """
    Formate le résultat pour l'interface utilisateur
    """
    optimal_solution = {f'x{i+1}': value 
                       for i, value in enumerate(result['optimal_solution'][:num_variables])}
    
    optimal_value = result['optimal_value']
    if objective_type == 'min':
        optimal_value = -optimal_value
    
    return {
        'optimal_solution': optimal_solution,
        'optimal_value': optimal_value,
        'iterations': [{'tableau': iter.tolist()} for iter in result['iterations']]
    }