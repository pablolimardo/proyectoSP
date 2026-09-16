'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';

export interface RegistroHistorial {
  id: string;
  fecha: string;
  turno: string;
  operador: string;
  observaciones: string;
  parametros?: Record<string, Record<string, string>>;
  filtrosEstado?: Record<string, Record<string, string>>;
  purgasEstado?: Record<string, Record<string, string>>;
  bombasEstado?: Record<string, Record<string, string>>;
}

const HORARIOS = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'];
const FILTROS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6'];
const PURGAS = ['S1', 'S2', 'S3', 'S4'];

interface Props {
  historial?: RegistroHistorial[];
}

export default function HistorialPlanillas({ historial = [] }: Props) {
  const [filtroFecha, setFiltroFecha] = useState('');
  const [registroSeleccionado, setRegistroSeleccionado] = useState<RegistroHistorial | null>(null);

  const historialFiltrado = filtroFecha
    ? historial.filter((h) => h.fecha === filtroFecha)
    : historial;

  // FUNCIÓN EXPORTAR A EXCEL PROTEGIDA
  const exportarPlanillaAExcel = (registro: RegistroHistorial) => {
    const datosFilas = HORARIOS.map((hs) => {
      const p = registro.parametros?.[hs] || {};
      const f = registro.filtrosEstado?.[hs] || {};
      const purg = registro.purgasEstado?.[hs] || {};

      return {
        Hora: `${hs}:00`,
        'Caudal (m³/h)': p.caudal || '-',
        'Turb. Cruda': p.turbCruda || '-',
        'pH Cruda': p.phCruda || '-',
        'PAC (ml/min)': p.pacMlMin || '-',
        'PAC (ppm)': p.pacPpm || '-',
        'Soda (ml/min)': p.sodaMlMin || '-',
        'Soda (ppm)': p.sodaPpm || '-',
        'Turb. CAF': p.turbCaf || '-',
        'pH CAF': p.phCaf || '-',
        'Cloro (ppm)': p.cloro || '-',
        // Filtros (Lavados)
        'F1 (Filtro)': f.F1 || '-',
        'F2 (Filtro)': f.F2 || '-',
        'F3 (Filtro)': f.F3 || '-',
        'F4 (Filtro)': f.F4 || '-',
        'F5 (Filtro)': f.F5 || '-',
        'F6 (Filtro)': f.F6 || '-',
        // Purgas (Sedimentadores)
        'S1 (Purga)': purg.S1 || '-',
        'S2 (Purga)': purg.S2 || '-',
        'S3 (Purga)': purg.S3 || '-',
        'S4 (Purga)': purg.S4 || '-',
      };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(datosFilas, { origin: "A5" });

    XLSX.utils.sheet_add_aoa(worksheet, [
      ["PLANILLA DE CONTROL DE PLANTA POTABILIZADORA - HISTORIAL"],
      [`Fecha: ${registro.fecha}`, `Turno: ${registro.turno}`, `Operador: ${registro.operador}`],
      [`Observaciones: ${registro.observaciones}`],
      []
    ], { origin: "A1" });

    XLSX.utils.book_append_sheet(workbook, worksheet, "Planilla Control");
    XLSX.writeFile(workbook, `Planilla_${registro.fecha}_Turno_${registro.turno.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4 bg-slate-100 min-h-screen text-xs">
      <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Historial de Planillas Registradas
          </h2>
          <p className="text-slate-500 text-xs">
            Consulte mediciones, estados de lavado de filtros, purgas y exporte a Excel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-semibold text-slate-600">Filtrar Fecha:</label>
          <Input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="h-8 w-40 text-xs bg-white"
          />
          {filtroFecha && (
            <Button
              variant="outline"
              onClick={() => setFiltroFecha('')}
              className="h-8 text-xs text-slate-600"
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {!registroSeleccionado ? (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-200 text-slate-800 font-bold border-b">
              <tr>
                <th className="p-3 border-r">Fecha</th>
                <th className="p-3 border-r">Turno</th>
                <th className="p-3 border-r">Operador</th>
                <th className="p-3 border-r">Observaciones</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historialFiltrado.length > 0 ? (
                historialFiltrado.map((reg) => (
                  <tr key={reg.id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-800 border-r">{reg.fecha}</td>
                    <td className="p-3 border-r font-medium text-slate-700">{reg.turno}</td>
                    <td className="p-3 border-r font-bold text-slate-900">{reg.operador}</td>
                    <td className="p-3 border-r text-slate-600 truncate max-w-xs">{reg.observaciones}</td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      <Button
                        onClick={() => setRegistroSeleccionado(reg)}
                        className="h-7 text-xs bg-blue-700 hover:bg-blue-800 text-white"
                      >
                        Ver Detalle
                      </Button>
                      <Button
                        onClick={() => exportarPlanillaAExcel(reg)}
                        variant="outline"
                        className="h-7 text-xs border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold"
                      >
                        Excel
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400 italic">
                    No hay planillas cargadas en el historial aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* VISTA DETALLADA COMPLETA */
        <div className="bg-white border rounded-xl shadow-sm p-4 flex flex-col gap-5">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Planilla de Control</span>
              <h3 className="text-lg font-extrabold text-slate-900">
                {registroSeleccionado.fecha} — Turno: {registroSeleccionado.turno}
              </h3>
              <p className="text-xs text-slate-600">
                Operador: <strong className="text-slate-800">{registroSeleccionado.operador}</strong>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => exportarPlanillaAExcel(registroSeleccionado)}
                className="h-8 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                Descargar Excel (.xlsx)
              </Button>
              <Button
                onClick={() => setRegistroSeleccionado(null)}
                variant="outline"
                className="h-8 text-xs font-semibold"
              >
                ← Volver
              </Button>
            </div>
          </div>

          {/* TABLA PRINCIPAL PARÁMETROS */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">1. Mediciones Físico-Químicas</h4>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-center text-xs border-collapse">
                <thead className="bg-slate-800 text-white font-bold">
                  <tr>
                    <th className="p-2 border">HS</th>
                    <th className="p-2 border">Caudal (m³/h)</th>
                    <th className="p-2 border">Turb. Cruda</th>
                    <th className="p-2 border">pH Cruda</th>
                    <th className="p-2 border">PAC (ml/min)</th>
                    <th className="p-2 border">PAC (ppm)</th>
                    <th className="p-2 border">Soda (ml/min)</th>
                    <th className="p-2 border">Soda (ppm)</th>
                    <th className="p-2 border">Turb. CAF</th>
                    <th className="p-2 border">pH CAF</th>
                    <th className="p-2 border">Cloro</th>
                  </tr>
                </thead>
                <tbody>
                  {HORARIOS.map((hs) => {
                    const p = registroSeleccionado.parametros?.[hs] || {};
                    const registrado = Object.keys(p).length > 0;
                    return (
                      <tr key={hs} className={registrado ? 'bg-amber-50/60 font-semibold' : 'bg-slate-50 opacity-40'}>
                        <td className="p-1.5 border font-bold bg-slate-100">{hs}</td>
                        <td className="p-1.5 border">{p.caudal || '-'}</td>
                        <td className="p-1.5 border">{p.turbCruda || '-'}</td>
                        <td className="p-1.5 border">{p.phCruda || '-'}</td>
                        <td className="p-1.5 border">{p.pacMlMin || '-'}</td>
                        <td className="p-1.5 border text-blue-900 font-bold">{p.pacPpm || '-'}</td>
                        <td className="p-1.5 border">{p.sodaMlMin || '-'}</td>
                        <td className="p-1.5 border text-emerald-900 font-bold">{p.sodaPpm || '-'}</td>
                        <td className="p-1.5 border">{p.turbCaf || '-'}</td>
                        <td className="p-1.5 border">{p.phCaf || '-'}</td>
                        <td className="p-1.5 border text-amber-900 font-bold">{p.cloro || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* BLOQUE SECUNDARIO: LAVADO DE FILTROS Y PURGAS */}
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* SECCIÓN FILTROS (LAVADO) */}
            <div className="border rounded-lg p-3 bg-slate-50 flex flex-col gap-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                Estado / Lavado de Filtros (F1 - F6)
              </h4>
              <div className="overflow-x-auto border bg-white rounded-md">
                <table className="w-full text-center text-xs border-collapse">
                  <thead className="bg-slate-200 text-slate-800 font-bold">
                    <tr>
                      <th className="p-1.5 border">HS</th>
                      {FILTROS.map((f) => (
                        <th key={f} className="p-1.5 border">{f}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HORARIOS.map((hs) => {
                      const f = registroSeleccionado.filtrosEstado?.[hs] || {};
                      return (
                        <tr key={hs} className="border-b">
                          <td className="p-1 border font-mono font-bold bg-slate-50">{hs}</td>
                          {FILTROS.map((filtroKey) => {
                            const val = f[filtroKey] || '-';
                            const esLavado = val === 'L' || val === 'Lavado';
                            return (
                              <td
                                key={filtroKey}
                                className={`p-1 border font-bold ${
                                  esLavado ? 'bg-sky-200 text-sky-900 font-extrabold' : 'text-slate-600'
                                }`}
                              >
                                {val}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECCIÓN PURGAS (SEDIMENTADORES) */}
            <div className="border rounded-lg p-3 bg-slate-50 flex flex-col gap-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                Purgas de Sedimentadores (S1 - S4)
              </h4>
              <div className="overflow-x-auto border bg-white rounded-md">
                <table className="w-full text-center text-xs border-collapse">
                  <thead className="bg-slate-200 text-slate-800 font-bold">
                    <tr>
                      <th className="p-1.5 border">HS</th>
                      {PURGAS.map((s) => (
                        <th key={s} className="p-1.5 border">{s}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HORARIOS.map((hs) => {
                      const purg = registroSeleccionado.purgasEstado?.[hs] || {};
                      return (
                        <tr key={hs} className="border-b">
                          <td className="p-1 border font-mono font-bold bg-slate-50">{hs}</td>
                          {PURGAS.map((purgaKey) => {
                            const val = purg[purgaKey] || '-';
                            const esPurga = val === 'P' || val === 'Purga';
                            return (
                              <td
                                key={purgaKey}
                                className={`p-1 border font-bold ${
                                  esPurga ? 'bg-amber-200 text-amber-900 font-extrabold' : 'text-slate-600'
                                }`}
                              >
                                {val}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* OBSERVACIONES DEL TURNO */}
          <div className="bg-slate-50 p-3 border rounded-lg">
            <h4 className="font-bold text-slate-700 text-xs mb-1">Observaciones del Turno:</h4>
            <p className="text-slate-800 text-xs leading-relaxed">{registroSeleccionado.observaciones}</p>
          </div>
        </div>
      )}
    </div>
  );
}