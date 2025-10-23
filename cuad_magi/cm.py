from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/verificar', methods=['POST'])
def verificar():
    data = request.get_json()
    grid = data['grid']
    
    # Verificar que todas las celdas estén llenas
    completo = all(all(cell is not None for cell in row) for row in grid)
    
    if not completo:
        return jsonify({
            'completo': False,
            'mensaje': 'Por favor, completá todas las celdas.',
            'es_valido': False,
            'detalles': []
        })
    
    # Calcular suma esperada
    size = len(grid)
    suma_magica_esperada = (size * (size * size + 1)) // 2
    
    detalles = []
    es_valido = True
    
    # Verificar filas
    for i, row in enumerate(grid):
        suma = sum(row)
        detalles.append({
            'tipo': f'Fila {i + 1}',
            'suma': suma,
            'correcto': suma == suma_magica_esperada
        })
        if suma != suma_magica_esperada:
            es_valido = False
    
    # Verificar columnas
    for col in range(size):
        columna = [grid[row][col] for row in range(size)]
        suma = sum(columna)
        detalles.append({
            'tipo': f'Columna {col + 1}',
            'suma': suma,
            'correcto': suma == suma_magica_esperada
        })
        if suma != suma_magica_esperada:
            es_valido = False
    
    # Verificar diagonal principal
    diag_principal = [grid[i][i] for i in range(size)]
    suma_diag_principal = sum(diag_principal)
    detalles.append({
        'tipo': 'Diagonal principal',
        'suma': suma_diag_principal,
        'correcto': suma_diag_principal == suma_magica_esperada
    })
    if suma_diag_principal != suma_magica_esperada:
        es_valido = False
    
    # Verificar diagonal secundaria
    diag_secundaria = [grid[i][size - 1 - i] for i in range(size)]
    suma_diag_secundaria = sum(diag_secundaria)
    detalles.append({
        'tipo': 'Diagonal secundaria',
        'suma': suma_diag_secundaria,
        'correcto': suma_diag_secundaria == suma_magica_esperada
    })
    if suma_diag_secundaria != suma_magica_esperada:
        es_valido = False
    
    mensaje = f'¡Es un cuadrado mágico correcto! Suma: {suma_magica_esperada}' if es_valido else f'No es un cuadrado mágico. Suma esperada: {suma_magica_esperada}'
    
    return jsonify({
        'completo': True,
        'es_valido': es_valido,
        'mensaje': mensaje,
        'detalles': detalles
    })

if __name__ == '__main__':
    app.run(debug=True)