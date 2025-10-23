import React, { useState } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';

export default function CuadradoMagico() {
  const [size, setSize] = useState(3);
  const [grid, setGrid] = useState(Array(3).fill().map(() => Array(3).fill('')));
  const [result, setResult] = useState(null);

  const handleSizeChange = (newSize) => {
    setSize(newSize);
    setGrid(Array(newSize).fill().map(() => Array(newSize).fill('')));
    setResult(null);
  };

  const handleCellChange = (row, col, value) => {
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value;
    setGrid(newGrid);
    setResult(null);
  };

  const resetGrid = () => {
    setGrid(Array(size).fill().map(() => Array(size).fill('')));
    setResult(null);
  };

  const verificarCuadradoMagico = () => {
    // Convertir valores a números
    const numGrid = grid.map(row => 
      row.map(cell => cell === '' ? null : parseInt(cell))
    );

    // Verificar que todas las celdas estén llenas
    const todasLlenas = numGrid.every(row => row.every(cell => cell !== null && !isNaN(cell)));
    
    if (!todasLlenas) {
      setResult({
        esValido: false,
        mensaje: 'Por favor, completa todas las celdas con números válidos',
        detalles: []
      });
      return;
    }

    // Calcular suma mágica esperada (usando la fórmula para 1 a n²)
    const sumaMagicaEsperada = (size * (size * size + 1)) / 2;

    let detalles = [];
    let esValido = true;

    // Verificar filas
    numGrid.forEach((row, i) => {
      const suma = row.reduce((a, b) => a + b, 0);
      detalles.push({
        tipo: `Fila ${i + 1}`,
        valores: row.join(' + '),
        suma: suma,
        correcto: suma === sumaMagicaEsperada
      });
      if (suma !== sumaMagicaEsperada) esValido = false;
    });

    // Verificar columnas
    for (let col = 0; col < size; col++) {
      const columna = numGrid.map(row => row[col]);
      const suma = columna.reduce((a, b) => a + b, 0);
      detalles.push({
        tipo: `Columna ${col + 1}`,
        valores: columna.join(' + '),
        suma: suma,
        correcto: suma === sumaMagicaEsperada
      });
      if (suma !== sumaMagicaEsperada) esValido = false;
    }

    // Verificar diagonal principal
    const diagPrincipal = numGrid.map((row, i) => row[i]);
    const sumaDiagPrincipal = diagPrincipal.reduce((a, b) => a + b, 0);
    detalles.push({
      tipo: 'Diagonal principal',
      valores: diagPrincipal.join(' + '),
      suma: sumaDiagPrincipal,
      correcto: sumaDiagPrincipal === sumaMagicaEsperada
    });
    if (sumaDiagPrincipal !== sumaMagicaEsperada) esValido = false;

    // Verificar diagonal secundaria
    const diagSecundaria = numGrid.map((row, i) => row[size - 1 - i]);
    const sumaDiagSecundaria = diagSecundaria.reduce((a, b) => a + b, 0);
    detalles.push({
      tipo: 'Diagonal secundaria',
      valores: diagSecundaria.join(' + '),
      suma: sumaDiagSecundaria,
      correcto: sumaDiagSecundaria === sumaMagicaEsperada
    });
    if (sumaDiagSecundaria !== sumaMagicaEsperada) esValido = false;

    setResult({
      esValido,
      mensaje: esValido 
        ? `¡Es un cuadrado mágico válido! Suma mágica: ${sumaMagicaEsperada}`
        : `No es un cuadrado mágico. Suma mágica esperada: ${sumaMagicaEsperada}`,
      detalles
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-center text-purple-900 mb-2">
            Cuadrado Mágico
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Ingresa números para formar un cuadrado mágico donde todas las filas, columnas y diagonales sumen lo mismo
          </p>

          {/* Cuadrícula con resultados alrededor */}
          <div className="flex justify-center mb-32">
            <div className="relative inline-block">
              {/* Sumas de filas (derecha) */}
              {result && (
                <div className="absolute left-full ml-4 top-0 flex flex-col justify-around h-full">
                  {result.detalles.filter(d => d.tipo.includes('Fila')).map((detalle, idx) => (
                    <div 
                      key={idx}
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        detalle.correcto ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {detalle.suma}
                    </div>
                  ))}
                </div>
              )}

              {/* Sumas de columnas (abajo) */}
              {result && (
                <div className="absolute top-full mt-4 left-0 flex justify-around w-full">
                  {result.detalles.filter(d => d.tipo.includes('Columna')).map((detalle, idx) => (
                    <div 
                      key={idx}
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        detalle.correcto ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {detalle.suma}
                    </div>
                  ))}
                </div>
              )}

              {/* Diagonal principal (esquina superior izquierda) */}
              {result && result.detalles.find(d => d.tipo.includes('principal')) && (
                <div 
                  className={`absolute right-full mr-4 top-0 px-3 py-1 rounded text-sm font-semibold ${
                    result.detalles.find(d => d.tipo.includes('principal')).correcto 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  ↘ {result.detalles.find(d => d.tipo.includes('principal')).suma}
                </div>
              )}

              {/* Diagonal secundaria (esquina superior derecha) */}
              {result && result.detalles.find(d => d.tipo.includes('secundaria')) && (
                <div 
                  className={`absolute right-full mr-4 bottom-0 px-3 py-1 rounded text-sm font-semibold ${
                    result.detalles.find(d => d.tipo.includes('secundaria')).correcto 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  ↗ {result.detalles.find(d => d.tipo.includes('secundaria')).suma}
                </div>
              )}

              {/* Grid del cuadrado */}
              <div 
                className="inline-grid gap-2"
                style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
              >
                {grid.map((row, i) => (
                  row.map((cell, j) => (
                    <input
                      key={`${i}-${j}`}
                      type="number"
                      value={cell}
                      onChange={(e) => handleCellChange(i, j, e.target.value)}
                      className="w-16 h-16 text-center text-xl font-bold border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="?"
                    />
                  ))
                ))}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={verificarCuadradoMagico}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-lg"
            >
              <Check size={20} />
              Verificar
            </button>
            <button
              onClick={resetGrid}
              className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors shadow-lg"
            >
              <RotateCcw size={20} />
              Limpiar
            </button>
          </div>

          {/* Mensaje de resultado */}
          {result && (
            <div className={`rounded-xl p-4 text-center ${
              result.esValido 
                ? 'bg-green-50 border-2 border-green-300' 
                : 'bg-red-50 border-2 border-red-300'
            }`}>
              <div className="flex items-center justify-center gap-3">
                {result.esValido ? (
                  <Check className="text-green-600" size={28} />
                ) : (
                  <X className="text-red-600" size={28} />
                )}
                <h3 className={`text-xl font-bold ${
                  result.esValido ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.mensaje}
                </h3>
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 ¿Qué es un cuadrado mágico?</h4>
            <p className="text-blue-800 text-sm">
              En un cuadrado mágico, todas las filas, columnas y diagonales deben sumar el mismo número (la suma mágica).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}