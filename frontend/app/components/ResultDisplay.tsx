"use client";

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { ScrollArea } from "@/app/components/ui/scroll-area"

interface ResultDisplayProps {
  result: {
    optimal_solution: { [key: string]: number };
    optimal_value: number;
    iterations: { tableau: number[][] }[];
  };
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Solution optimale</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(result.optimal_solution).length === 0 ? (
            <p className="text-gray-600">Aucune solution trouvée</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {Object.entries(result.optimal_solution).map(([variable, value], index) => (
                <span key={index} className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-semibold">
                  {variable} = {value.toFixed(4)}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Valeur optimale</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {(-1 * result.optimal_value).toFixed(4)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Itérations</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {result.iterations.map((iteration, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Itération {index + 1}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Base</TableHead>
                      {Array.from({ length: iteration.tableau[0].length - 1 }, (_, i) => (
                        <TableHead key={i} className="font-bold">{`x${i + 1}`}</TableHead>
                      ))}
                      <TableHead className="font-bold">RHS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {iteration.tableau.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell className="font-medium">{rowIndex === 0 ? 'Z' : `s${rowIndex}`}</TableCell>
                        {row.map((value, colIndex) => (
                          <TableCell key={colIndex}>{value.toFixed(4)}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultDisplay;

