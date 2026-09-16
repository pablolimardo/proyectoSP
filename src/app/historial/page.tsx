'use client';

import React, { useEffect, useState } from 'react';
import HistorialPlanillas, { RegistroHistorial } from '@/components/historial';

export default function HistorialPage() {
  const [historial, setHistorial] = useState<RegistroHistorial[]>([]);

  useEffect(() => {
    // Leemos el historial guardado en el navegador
    const datosGuardados = localStorage.getItem('historial_planillas');
    if (datosGuardados) {
      try {
        setHistorial(JSON.parse(datosGuardados));
      } catch (error) {
        console.error("Error al cargar el historial:", error);
      }
    }
  }, []);

  return (
    <div className="container mx-auto">
      <HistorialPlanillas historial={historial} />
    </div>
  );
}