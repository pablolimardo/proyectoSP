'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const HORARIOS = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'];

const MAPA_TURNOS: Record<string, string[]> = {
  '00:00 a 06:00': ['00', '02', '04'],
  '06:00 a 12:00': ['06', '08', '10'],
  '12:00 a 18:00': ['12', '14', '16'],
  '18:00 a 00:00': ['18', '20', '22'],
};

const FILTROS_KEYS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6'];
const PURGAS_KEYS = ['S1', 'S2', 'S3', 'S4'];

const PAC10_PV = 1.26;
const SODA_PV = 0.05;

const parseNumber = (val: string | number | undefined): number => {
  if (val === undefined || val === null || val === '') return 0;
  const str = val.toString().trim().replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

interface RegistroHistorial {
  id: string;
  fecha: string;
  turno: string;
  operador: string;
  observaciones: string;
  descargado?: boolean;
  parametros?: Record<string, Record<string, string>>;
  filtrosEstado?: Record<string, Record<string, string>>;
  purgasEstado?: Record<string, Record<string, string>>;
  bombasEstado?: Record<string, Record<string, string>>;
}

export default function PlanillaUnificada24H() {
  const [isMounted, setIsMounted] = useState(false);
  const [fecha, setFecha] = useState('');
  const [horaActualSistema, setHoraActualSistema] = useState('');

  // ESTADO DE TURNO Y OPERADOR
  const [turnoActivo, setTurnoActivo] = useState('06:00 a 12:00');
  const [operadoresTurnos, setOperadoresTurnos] = useState<Record<string, string>>({
    '06:00 a 12:00': 'BENICIO FILOSA',
  });
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false);
  const [turnoSeleccionadoTemp, setTurnoSeleccionadoTemp] = useState('');
  const [nombreOperadorInput, setNombreOperadorInput] = useState('');

  // Estados de la planilla
  const [parametros, setParametros] = useState<Record<string, Record<string, string>>>({});
  const [filtrosEstado, setFiltrosEstado] = useState<Record<string, Record<string, string>>>({});
  const [purgasEstado, setPurgasEstado] = useState<Record<string, Record<string, string>>>({});
  const [bombasEstado, setBombasEstado] = useState<Record<string, Record<string, string>>>({});
  const [observacionesGenerales, setObservacionesGenerales] = useState('');

  // Historial
  const [filtroFechaHistorial, setFiltroFechaHistorial] = useState('');
  const [historial, setHistorial] = useState<RegistroHistorial[]>([]);

  // CARGA INICIAL DE LOCALSTORAGE AL MONTAR
  useEffect(() => {
    setIsMounted(true);

    const borradorTurno = localStorage.getItem('borrador_turno_activo');
    if (borradorTurno) setTurnoActivo(borradorTurno);

    const borradorOperadores = localStorage.getItem('borrador_operadores');
    if (borradorOperadores) {
      try {
        setOperadoresTurnos(JSON.parse(borradorOperadores));
      } catch (e) {
        console.error("Error al parsear operadores borrador", e);
      }
    }

    const borradorParametros = localStorage.getItem('borrador_parametros');
    if (borradorParametros) setParametros(JSON.parse(borradorParametros));

    const borradorFiltros = localStorage.getItem('borrador_filtros');
    if (borradorFiltros) setFiltrosEstado(JSON.parse(borradorFiltros));

    const borradorPurgas = localStorage.getItem('borrador_purgas');
    if (borradorPurgas) setPurgasEstado(JSON.parse(borradorPurgas));

    const borradorBombas = localStorage.getItem('borrador_bombas');
    if (borradorBombas) setBombasEstado(JSON.parse(borradorBombas));

    const borradorObs = localStorage.getItem('borrador_observaciones');
    if (borradorObs) setObservacionesGenerales(borradorObs);

    const datosGuardados = localStorage.getItem('historial_planillas');
    if (datosGuardados) {
      try {
        setHistorial(JSON.parse(datosGuardados));
      } catch (e) {
        console.error("Error al parsear el historial de localStorage", e);
      }
    }
  }, []);

  // Guardado automático del borrador en tiempo real
  useEffect(() => {
    if (isMounted) localStorage.setItem('borrador_turno_activo', turnoActivo);
  }, [turnoActivo, isMounted]);

  useEffect(() => {
    if (isMounted) localStorage.setItem('borrador_operadores', JSON.stringify(operadoresTurnos));
  }, [operadoresTurnos, isMounted]);

  useEffect(() => {
    if (isMounted) localStorage.setItem('borrador_parametros', JSON.stringify(parametros));
  }, [parametros, isMounted]);

  useEffect(() => {
    if (isMounted) localStorage.setItem('borrador_filtros', JSON.stringify(filtrosEstado));
  }, [filtrosEstado, isMounted]);

  useEffect(() => {
    if (isMounted) localStorage.setItem('borrador_purgas', JSON.stringify(purgasEstado));
  }, [purgasEstado, isMounted]);

  useEffect(() => {
    if (isMounted) localStorage.setItem('borrador_bombas', JSON.stringify(bombasEstado));
  }, [bombasEstado, isMounted]);

  useEffect(() => {
    if (isMounted) localStorage.setItem('borrador_observaciones', observacionesGenerales);
  }, [observacionesGenerales, isMounted]);

  // Reloj
  useEffect(() => {
    const actualizarReloj = () => {
      const ahora = new Date();
      const hs = String(ahora.getHours()).padStart(2, '0');
      const mins = String(ahora.getMinutes()).padStart(2, '0');
      const segs = String(ahora.getSeconds()).padStart(2, '0');
      setHoraActualSistema(`${hs}:${mins}:${segs}`);

      if (!fecha) {
        const año = ahora.getFullYear();
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const dia = String(ahora.getDate()).padStart(2, '0');
        setFecha(`${año}-${mes}-${dia}`);
      }
    };

    actualizarReloj();
    const interval = setInterval(actualizarReloj, 1000);
    return () => clearInterval(interval);
  }, [fecha]);

  const abrirModalOperador = (turno: string) => {
    setTurnoSeleccionadoTemp(turno);
    setNombreOperadorInput(operadoresTurnos[turno] || '');
    setModalAbierto(true);
  };

  const guardarOperador = () => {
    if (!nombreOperadorInput.trim()) return;
    
    setOperadoresTurnos((prev) => ({
      ...prev,
      [turnoSeleccionadoTemp]: nombreOperadorInput.trim().toUpperCase(),
    }));
    setTurnoActivo(turnoSeleccionadoTemp);
    setModalAbierto(false);
  };

  // GUARDAR PLANILLA Y REGISTRAR EN HISTORIAL
  const guardarPlanillaYRegistrar = () => {
    const nuevoRegistro: RegistroHistorial = {
      id: Date.now().toString(),
      fecha: fecha || new Date().toISOString().split('T')[0],
      turno: turnoActivo,
      operador: operadoresTurnos[turnoActivo] || 'SIN REGISTRAR',
      observaciones: observacionesGenerales || 'Sin observaciones registradas.',
      descargado: false,
      parametros: JSON.parse(JSON.stringify(parametros)),
      filtrosEstado: JSON.parse(JSON.stringify(filtrosEstado)),
      purgasEstado: JSON.parse(JSON.stringify(purgasEstado)),
      bombasEstado: JSON.parse(JSON.stringify(bombasEstado)),
    };

    const nuevoHistorial = [nuevoRegistro, ...historial];
    setHistorial(nuevoHistorial);
    localStorage.setItem('historial_planillas', JSON.stringify(nuevoHistorial));

    // Limpiar borrador local
    setParametros({});
    setFiltrosEstado({});
    setPurgasEstado({});
    setBombasEstado({});
    setObservacionesGenerales('');

    localStorage.removeItem('borrador_parametros');
    localStorage.removeItem('borrador_filtros');
    localStorage.removeItem('borrador_purgas');
    localStorage.removeItem('borrador_bombas');
    localStorage.removeItem('borrador_observaciones');

    alert('¡Planilla guardada exitosamente en el historial!');
  };

  // ELIMINAR REGISTRO INDIVIDUAL CON ADVERTENCIA DE DESCARGA
  const eliminarRegistroHistorial = (id: string) => {
    const registro = historial.find((r) => r.id === id);
    if (!registro) return;

    if (!registro.descargado) {
      const confirmarSinDescargar = window.confirm(
        `⚠️ ¡ATENCIÓN!\n\nEste registro (${registro.fecha} - ${registro.turno}) TODAVÍA NO HA SIDO DESCARGADO/GUARDADO externamente.\n\n¿Estás seguro/a de que deseas borrarlo definitivamente?`
      );
      if (!confirmarSinDescargar) return;
    } else {
      const confirmarBorrado = window.confirm(
        `¿Confirmas borrar el registro del ${registro.fecha} - ${registro.turno}?`
      );
      if (!confirmarBorrado) return;
    }

    const nuevoHistorial = historial.filter((r) => r.id !== id);
    setHistorial(nuevoHistorial);
    localStorage.setItem('historial_planillas', JSON.stringify(nuevoHistorial));
  };

  // SIMULAR/REALIZAR DESCARGA DE REGISTRO
  const descargarRegistro = (reg: RegistroHistorial) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reg, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `planilla_${reg.fecha}_${reg.turno.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    // Marcar como descargado
    const nuevoHistorial = historial.map((r) => {
      if (r.id === reg.id) return { ...r, descargado: true };
      return r;
    });
    setHistorial(nuevoHistorial);
    localStorage.setItem('historial_planillas', JSON.stringify(nuevoHistorial));
  };

  const handleInputChange = (hs: string, campo: string, valor: string) => {
    setParametros((prev) => {
      const horaActual = { ...(prev[hs] || {}) };
      horaActual[campo] = valor;

      const Qp = parseNumber(horaActual.caudal);

      if (campo === 'pacPpm') {
        const ppm = parseNumber(valor);
        if (ppm > 0 && Qp > 0) {
          horaActual.pacMlMin = Math.round((ppm * Qp) / (60 * PAC10_PV)).toString();
        }
      } else if (campo === 'pacMlMin') {
        const ml = parseNumber(valor);
        if (ml > 0 && Qp > 0) {
          horaActual.pacPpm = ((ml * PAC10_PV * 60) / Qp).toFixed(1);
        }
      }

      if (campo === 'sodaPpm') {
        const ppm = parseNumber(valor);
        if (ppm > 0 && Qp > 0) {
          horaActual.sodaMlMin = Math.round((ppm * Qp) / (60 * SODA_PV)).toString();
        }
      } else if (campo === 'sodaMlMin') {
        const ml = parseNumber(valor);
        if (ml > 0 && Qp > 0) {
          horaActual.sodaPpm = ((ml * SODA_PV * 60) / Qp).toFixed(1);
        }
      }

      return {
        ...prev,
        [hs]: horaActual,
      };
    });
  };

  const setEstadoFiltro = (hs: string, filtroKey: string, valor: string) => {
    setFiltrosEstado((prev) => ({
      ...prev,
      [hs]: {
        ...(prev[hs] || {}),
        [filtroKey]: valor,
      },
    }));
  };

  const setEstadoPurga = (hs: string, sedKey: string, valor: string) => {
    setPurgasEstado((prev) => ({
      ...prev,
      [hs]: {
        ...(prev[hs] || {}),
        [sedKey]: valor,
      },
    }));
  };

  const setEstadoBomba = (hs: string, bombaKey: string, valor: string) => {
    setBombasEstado((prev) => ({
      ...prev,
      [hs]: {
        ...(prev[hs] || {}),
        [bombaKey]: valor,
      },
    }));
  };

  if (!isMounted) return null;

  const horasTurnoActual = MAPA_TURNOS[turnoActivo] || [];
  const operadorActual = operadoresTurnos[turnoActivo] || 'SIN REGISTRAR';

  const historialFiltrado = filtroFechaHistorial 
    ? historial.filter(h => h.fecha === filtroFechaHistorial)
    : historial;

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col text-xs overflow-y-auto">
      
      {/* HEADER */}
      <header className="w-full bg-white border-b px-4 py-2 flex justify-between items-center shadow-sm">
        <Button 
          onClick={() => setModalHistorialAbierto(true)}
          className="bg-slate-800 hover:bg-slate-900 text-white font-bold flex items-center gap-2 text-xs h-9 px-4 rounded-lg shadow-sm"
        >
          Ver Historial
        </Button>

        <div 
          onClick={() => abrirModalOperador(turnoActivo)}
          className="flex items-center gap-4 border-2 border-sky-300 bg-sky-50/80 hover:bg-sky-100 p-2.5 px-4 rounded-xl cursor-pointer transition-all shadow-md group"
        >
          <div className="w-11 h-11 rounded-full border-2 border-sky-400 bg-white flex items-center justify-center text-sky-600 group-hover:scale-105 transition-transform shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-base leading-tight uppercase tracking-wide">
                {operadorActual}
              </span>
              <span className="text-xs text-sky-600 font-semibold underline opacity-70 group-hover:opacity-100 transition-opacity">
                (Editar)
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium mt-0.5">
              <span>Turno: <strong className="text-slate-800">{turnoActivo}</strong></span>
              <span>•</span>
              <span className="font-mono text-emerald-600 font-extrabold text-sm">{horaActualSistema || '00:00:00'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* MODAL OPERADOR */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-slate-800">
              Registro de Operador
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <p className="text-xs text-slate-600">
              Ingrese el nombre del operador para el turno <span className="font-bold text-blue-900">{turnoSeleccionadoTemp}</span>:
            </p>
            <input
              type="text"
              placeholder="Nombre y Apellido del Operador"
              value={nombreOperadorInput}
              onChange={(e) => setNombreOperadorInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && guardarOperador()}
              className="text-xs border p-2 rounded outline-none w-full"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={guardarOperador} 
              disabled={!nombreOperadorInput.trim()}
              className="bg-blue-700 hover:bg-blue-800 text-xs text-white"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL HISTORIAL DE REGISTROS */}
      <Dialog open={modalHistorialAbierto} onOpenChange={setModalHistorialAbierto}>
        <DialogContent className="max-w-6xl max-h-[85vh] flex flex-col w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-800">
              Historial de Planillas Registradas
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-between items-center bg-slate-50 p-2 rounded border gap-2 my-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Filtrar por fecha:</span>
              <input
                type="date"
                value={filtroFechaHistorial}
                onChange={(e) => setFiltroFechaHistorial(e.target.value)}
                className="h-7 w-36 text-xs bg-white border rounded px-1"
              />
              {filtroFechaHistorial && (
                <Button 
                  variant="ghost" 
                  onClick={() => setFiltroFechaHistorial('')}
                  className="h-7 text-xs text-slate-500 hover:text-slate-800"
                >
                  Limpiar
                </Button>
              )}
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Mostrando {historialFiltrado.length} registros
            </span>
          </div>

          <div className="overflow-x-auto overflow-y-auto flex-1 border rounded my-2">
            <table className="w-full min-w-[750px] text-left text-xs border-collapse">
              <thead className="bg-slate-100 sticky top-0 border-b font-bold text-slate-700 z-10">
                <tr>
                  <th className="p-2 border-r">Fecha</th>
                  <th className="p-2 border-r">Turno</th>
                  <th className="p-2 border-r">Operador</th>
                  <th className="p-2 border-r text-center">Lavados</th>
                  <th className="p-2 border-r text-center">Purgas</th>
                  <th className="p-2 border-r text-center">Estado Guardado</th>
                  <th className="p-2 border-r">Observaciones</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {historialFiltrado.length > 0 ? (
                  historialFiltrado.map((reg) => {
                    const cantLavados = reg.filtrosEstado 
                      ? Object.values(reg.filtrosEstado).reduce((acc, hs) => acc + Object.values(hs).filter(v => v === 'L' || v === '1').length, 0)
                      : 0;
                    const cantPurgas = reg.purgasEstado 
                      ? Object.values(reg.purgasEstado).reduce((acc, hs) => acc + Object.values(hs).filter(v => v === 'P' || v === '1').length, 0)
                      : 0;

                    return (
                      <tr key={reg.id} className="border-b hover:bg-slate-50 transition-colors">
                        <td className="p-2 font-mono font-semibold text-slate-800 border-r">{reg.fecha}</td>
                        <td className="p-2 border-r font-medium text-slate-700">{reg.turno}</td>
                        <td className="p-2 border-r font-bold text-slate-900">{reg.operador}</td>
                        <td className="p-2 border-r text-center font-bold text-cyan-700">{cantLavados}</td>
                        <td className="p-2 border-r text-center font-bold text-amber-800">{cantPurgas}</td>
                        <td className="p-2 border-r text-center font-bold">
                          {reg.descargado ? (
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              ✓ Descargado
                            </span>
                          ) : (
                            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              ⚠️ Pendiente
                            </span>
                          )}
                        </td>
                        <td className="p-2 border-r text-slate-600 truncate max-w-[150px]">{reg.observaciones}</td>
                        <td className="p-2 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => descargarRegistro(reg)}
                              className="h-7 px-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-none"
                            >
                              Descargar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => eliminarRegistroHistorial(reg.id)}
                              className="h-7 px-2.5 font-bold text-xs shadow-none"
                            >
                              🗑️ Borrar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-slate-400 italic">
                      No hay registros guardados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalHistorialAbierto(false)} className="text-xs">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONTENIDO PRINCIPAL */}
      <div className="p-2 flex flex-col gap-2">
        <div className="flex flex-wrap justify-between items-center bg-white p-2 rounded shadow-sm border gap-2">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-sm text-slate-800">
              Planilla Control Planta Potabilizadora SPSE
            </h1>
            
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border">
              <span className="text-xs font-semibold text-slate-500 px-1">Turno:</span>
              {Object.keys(MAPA_TURNOS).map((t) => (
                <button
                  key={t}
                  onClick={() => abrirModalOperador(t)}
                  className={`px-2 py-0.5 text-xs font-bold rounded transition-all ${
                    turnoActivo === t ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="font-semibold text-slate-600 text-xs">Fecha:</label>
            <input 
              type="date" 
              value={fecha} 
              onChange={(e) => setFecha(e.target.value)} 
              className="h-7 w-36 text-xs bg-white border rounded px-2" 
            />
          </div>
        </div>

        {/* TABLA DE PARÁMETROS COMPLETA */}
        <div className="bg-white border rounded shadow-sm p-2 flex flex-col gap-3">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-slate-600 text-center text-xs">
              <thead>
                <tr className="bg-slate-300 font-bold border-b-2 border-slate-600">
                  <th className="border border-slate-400 border-r-2 border-r-slate-700 p-1 w-8" rowSpan={2}>HS</th>
                  <th className="border border-slate-400 p-1" colSpan={4}>EBAC</th>
                  <th className="border border-slate-400 border-r-2 border-r-slate-700 p-1 w-16" rowSpan={2}>NIVEL POZO<br/><span className="text-[9px] font-normal">(m)</span></th>
                  <th className="border border-slate-400 border-r-2 border-r-slate-700 p-1" colSpan={3}>AGUA CRUDA</th>
                  <th className="border border-slate-400 border-r-2 border-r-slate-700 p-1" colSpan={2}>DOSIFICACIÓN PAC 10</th>
                  <th className="border border-slate-400 border-r-2 border-r-slate-700 p-1" colSpan={2}>DOSIFICACIÓN SODA</th>
                  <th className="border border-slate-400 border-r-2 border-r-slate-700 p-1" colSpan={2}>AGUA CAF</th>
                  <th className="border border-slate-400 border-r-2 border-r-slate-700 p-1" rowSpan={2}>CLORO<br/><span className="text-[10px] font-normal">(p.p.m.)</span></th>
                  <th className="border border-slate-400 p-1" colSpan={4}>EBAP</th>
                </tr>

                <tr className="bg-slate-100 font-bold border-b-2 border-slate-600 text-[11px]">
                  <th className="border border-slate-400 p-1 w-7">B1</th>
                  <th className="border border-slate-400 p-1 w-7">B2</th>
                  <th className="border border-slate-400 p-1 w-7">B3</th>
                  <th className="border border-slate-400 p-1 w-7">B4</th>

                  <th className="border border-slate-400 p-1">CAUDAL<br/><span className="text-[9px] font-normal">(m³/h)</span></th>
                  <th className="border border-slate-400 p-1">TURB.<br/><span className="text-[9px] font-normal">(NTU)</span></th>
                  <th className="border border-slate-400 border-r-2 border-r-slate-700 p-1">pH</th>

                  <th className="border border-slate-400 p-1">DOSIF.<br/><span className="text-[9px] font-normal">(ml/min)</span></th>
                  <th className="border border-slate-400 border-r-2 border-r-slate-700 p-1 bg-blue-50">DETERM.<br/><span className="text-[9px] font-bold text-blue-800">(p.p.m.)</span></th>

                  <th className="border border-slate-400 p-1">DOSIF.<br/><span className="text-[9px] font-normal">(ml/min)</span></th>
                  <th className="border border-slate-400 border-r-2 border-r-slate-700 p-1 bg-emerald-50">DETERM.<br/><span className="text-[9px] font-bold text-emerald-800">(p.p.m.)</span></th>

                  <th className="border border-slate-400 p-1">TURB.<br/><span className="text-[9px] font-normal">(NTU)</span></th>
                  <th className="border border-slate-400 border-r-2 border-r-slate-700 p-1">pH</th>

                  <th className="border border-slate-400 p-1 w-7">B1</th>
                  <th className="border border-slate-400 p-1 w-7">B2</th>
                  <th className="border border-slate-400 p-1 w-7">B3</th>
                  <th className="border border-slate-400 p-1 w-7">B4</th>
                </tr>
              </thead>
              <tbody>
                {HORARIOS.map((hs) => {
                  const esDelTurnoActual = horasTurnoActual.includes(hs);
                  const datosHs = parametros[hs] || {};
                  const bombasHs = bombasEstado[hs] || {};

                  return (
                    <tr 
                      key={hs} 
                      className={`transition-colors ${
                        esDelTurnoActual ? 'bg-amber-50/90 font-semibold' : 'bg-slate-50/50 opacity-60'
                      }`}
                    >
                      <td className={`border border-slate-400 border-r-2 border-r-slate-700 p-0 font-bold ${
                        esDelTurnoActual ? 'bg-amber-200 text-blue-950' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {hs}
                      </td>

                      {['ebac_b1', 'ebac_b2', 'ebac_b3', 'ebac_b4'].map((bKey) => {
                        const val = bombasHs[bKey] || '';
                        return (
                          <td 
                            key={bKey} 
                            className={`border border-slate-400 p-0 transition-colors ${
                              val === 'M' ? 'bg-emerald-200 font-bold text-emerald-950' : val === 'P' ? 'bg-rose-200 font-bold text-rose-950' : ''
                            }`}
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild disabled={!esDelTurnoActual}>
                                <button className="w-full h-7 text-center font-bold outline-none flex items-center justify-center disabled:cursor-not-allowed">
                                  {val || '-'}
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="center" className="min-w-[6rem] p-1">
                                <DropdownMenuItem onClick={() => setEstadoBomba(hs, bKey, 'M')} className="text-xs font-bold bg-emerald-100 py-1.5 cursor-pointer">
                                  M (Marcha)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEstadoBomba(hs, bKey, 'P')} className="text-xs font-bold bg-rose-100 py-1.5 cursor-pointer">
                                  P (Parada)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEstadoBomba(hs, bKey, '')} className="text-xs text-slate-400 py-1 cursor-pointer">
                                  Limpiar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        );
                      })}

                      <td className="border border-slate-400 border-r-2 border-r-slate-700 p-0">
                        <input 
                          disabled={!esDelTurnoActual}
                          type="text"
                          autoComplete="off"
                          value={datosHs.nivelPozo ?? ''} 
                          onChange={(e) => handleInputChange(hs, 'nivelPozo', e.target.value)} 
                          className="h-7 w-full text-center text-xs p-0 border-none outline-none bg-transparent disabled:bg-slate-100/50" 
                          placeholder="3.5" 
                        />
                      </td>
                      
                      <td className="border border-slate-400 p-0">
                        <input 
                          disabled={!esDelTurnoActual}
                          type="text"
                          autoComplete="off"
                          value={datosHs.caudal ?? ''} 
                          onChange={(e) => handleInputChange(hs, 'caudal', e.target.value)} 
                          className="h-7 w-full text-center text-xs p-0 border-none outline-none bg-transparent font-bold disabled:bg-slate-100/50" 
                          placeholder="1500" 
                        />
                      </td>
                      <td className="border border-slate-400 p-0">
                        <input 
                          disabled={!esDelTurnoActual}
                          type="text"
                          autoComplete="off"
                          value={datosHs.turbCruda ?? ''} 
                          onChange={(e) => handleInputChange(hs, 'turbCruda', e.target.value)} 
                          className="h-7 w-full text-center text-xs p-0 border-none outline-none bg-transparent disabled:bg-slate-100/50" 
                          placeholder="10.5" 
                        />
                      </td>
                      <td className="border border-slate-400 border-r-2 border-r-slate-700 p-0">
                        <input 
                          disabled={!esDelTurnoActual}
                          type="text"
                          autoComplete="off"
                          value={datosHs.phCruda ?? ''} 
                          onChange={(e) => handleInputChange(hs, 'phCruda', e.target.value)} 
                          className="h-7 w-full text-center text-xs p-0 border-none outline-none bg-transparent disabled:bg-slate-100/50" 
                          placeholder="7.1" 
                        />
                      </td>
                      
                      <td className="border border-slate-400 p-0">
                        <input 
                          disabled={!esDelTurnoActual}
                          type="text"
                          autoComplete="off"
                          value={datosHs.pacMlMin ?? ''} 
                          onChange={(e) => handleInputChange(hs, 'pacMlMin', e.target.value)} 
                          className="h-7 w-full text-center text-xs p-0 border-none outline-none bg-transparent disabled:bg-slate-100/50" 
                          placeholder="595" 
                        />
                      </td>
                      <td className="border border-slate-400 border-r-2 border-r-slate-700 p-0 bg-blue-50/50">
                        <input 
                          disabled={!esDelTurnoActual}
                          type="text"
                          autoComplete="off"
                          value={datosHs.pacPpm ?? ''} 
                          onChange={(e) => handleInputChange(hs, 'pacPpm', e.target.value)} 
                          className="h-7 w-full text-center text-xs font-bold text-blue-900 p-0 border-none outline-none bg-transparent disabled:bg-slate-100/50" 
                          placeholder="30" 
                        />
                      </td>

                      <td className="border border-slate-400 p-0">
                        <input 
                          disabled={!esDelTurnoActual}
                          type="text"
                          autoComplete="off"
                          value={datosHs.sodaMlMin ?? ''} 
                          onChange={(e) => handleInputChange(hs, 'sodaMlMin', e.target.value)} 
                          className="h-7 w-full text-center text-xs p-0 border-none outline-none bg-transparent disabled:bg-slate-100/50" 
                          placeholder="200" 
                        />
                      </td>
                      <td className="border border-slate-400 border-r-2 border-r-slate-700 p-0 bg-emerald-50/50">
                        <input 
                          disabled={!esDelTurnoActual}
                          type="text"
                          autoComplete="off"
                          value={datosHs.sodaPpm ?? ''} 
                          onChange={(e) => handleInputChange(hs, 'sodaPpm', e.target.value)} 
                          className="h-7 w-full text-center text-xs font-bold text-emerald-900 p-0 border-none outline-none bg-transparent disabled:bg-slate-100/50" 
                          placeholder="10" 
                        />
                      </td>
                      
                      <td className="border border-slate-400 p-0">
                        <input 
                          disabled={!esDelTurnoActual}
                          type="text"
                          autoComplete="off"
                          value={datosHs.turbCaf ?? ''} 
                          onChange={(e) => handleInputChange(hs, 'turbCaf', e.target.value)} 
                          className="h-7 w-full text-center text-xs p-0 border-none outline-none bg-transparent disabled:bg-slate-100/50" 
                          placeholder="2.1" 
                        />
                      </td>
                      <td className="border border-slate-400 border-r-2 border-r-slate-700 p-0">
                        <input 
                          disabled={!esDelTurnoActual}
                          type="text"
                          autoComplete="off"
                          value={datosHs.phCaf ?? ''} 
                          onChange={(e) => handleInputChange(hs, 'phCaf', e.target.value)} 
                          className="h-7 w-full text-center text-xs p-0 border-none outline-none bg-transparent disabled:bg-slate-100/50" 
                          placeholder="7.0" 
                        />
                      </td>
                      
                      <td className="border border-slate-400 border-r-2 border-r-slate-700 p-0">
                        <input 
                          disabled={!esDelTurnoActual}
                          type="text"
                          autoComplete="off"
                          value={datosHs.cloro ?? ''} 
                          onChange={(e) => handleInputChange(hs, 'cloro', e.target.value)} 
                          className="h-7 w-full text-center text-xs p-0 border-none outline-none bg-transparent disabled:bg-slate-100/50" 
                          placeholder="0.7" 
                        />
                      </td>

                      {['ebap_b1', 'ebap_b2', 'ebap_b3', 'ebap_b4'].map((bKey) => {
                        const val = bombasHs[bKey] || '';
                        return (
                          <td 
                            key={bKey} 
                            className={`border border-slate-400 p-0 transition-colors ${
                              val === 'M' ? 'bg-emerald-200 font-bold text-emerald-950' : val === 'P' ? 'bg-rose-200 font-bold text-rose-950' : ''
                            }`}
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild disabled={!esDelTurnoActual}>
                                <button className="w-full h-7 text-center font-bold outline-none flex items-center justify-center disabled:cursor-not-allowed">
                                  {val || '-'}
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="center" className="min-w-[6rem] p-1">
                                <DropdownMenuItem onClick={() => setEstadoBomba(hs, bKey, 'M')} className="text-xs font-bold bg-emerald-100 py-1.5 cursor-pointer">
                                  M (Marcha)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEstadoBomba(hs, bKey, 'P')} className="text-xs font-bold bg-rose-100 py-1.5 cursor-pointer">
                                  P (Parada)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEstadoBomba(hs, bKey, '')} className="text-xs text-slate-400 py-1 cursor-pointer">
                                  Limpiar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* LAVADO DE FILTROS (F1-F6), PURGAS (S1-S4) Y OBSERVACIONES */}
          <div className="flex flex-col lg:flex-row gap-3 border-t border-slate-300 pt-2 items-stretch">
            
            {/* TABLA LAVADO DE FILTROS (F1 - F6) */}
            <div className="overflow-x-auto shrink-0">
              <table className="border-collapse border border-slate-400 text-center text-xs w-full">
                <thead>
                  <tr className="bg-cyan-950 text-white font-black tracking-wider border-b border-slate-400">
                    <th className="border border-slate-400 p-1 uppercase" colSpan={7}>ESTADO / LAVADO DE FILTROS (F1 - F6)</th>
                  </tr>
                  <tr className="bg-cyan-900 text-white font-bold border-b border-slate-400 text-[11px]">
                    <th className="border border-slate-400 p-0.5 w-8">HS</th>
                    {FILTROS_KEYS.map((fKey) => (
                      <th key={fKey} className="border border-slate-400 p-0.5 w-10">{fKey}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HORARIOS.map((hs) => {
                    const esDelTurnoActual = horasTurnoActual.includes(hs);
                    const hsFiltros = filtrosEstado[hs] || {};

                    return (
                      <tr key={`lavado-${hs}`} className={esDelTurnoActual ? 'bg-amber-50/90 font-semibold' : 'bg-slate-50/50 opacity-60'}>
                        <td className={`border border-slate-400 p-0 font-bold ${esDelTurnoActual ? 'bg-amber-200 text-blue-950' : 'bg-slate-200 text-slate-500'}`}>
                          {hs}
                        </td>
                        {FILTROS_KEYS.map((fKey) => {
                          const val = hsFiltros[fKey] || '';
                          return (
                            <td key={fKey} className={`border border-slate-400 p-0 h-6 ${val === 'L' ? 'bg-cyan-300 font-extrabold text-cyan-950' : val === 'M' ? 'bg-emerald-100 font-bold text-emerald-950' : ''}`}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild disabled={!esDelTurnoActual}>
                                  <button className="w-full h-full text-center font-bold outline-none flex items-center justify-center disabled:cursor-not-allowed">
                                    {val || '-'}
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center" className="min-w-[5rem] p-1">
                                  <DropdownMenuItem onClick={() => setEstadoFiltro(hs, fKey, 'L')} className="text-xs font-black bg-cyan-100 py-1.5 cursor-pointer">
                                    L (Lavado)
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setEstadoFiltro(hs, fKey, 'M')} className="text-xs font-bold py-1.5 cursor-pointer">
                                    M (Marcha)
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setEstadoFiltro(hs, fKey, '')} className="text-xs text-slate-400 py-1 cursor-pointer">
                                    Limpiar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* TABLA PURGAS DE SEDIMENTADORES (S1 - S4) */}
            <div className="overflow-x-auto shrink-0">
              <table className="border-collapse border border-slate-400 text-center text-xs w-full">
                <thead>
                  <tr className="bg-amber-950 text-white font-black tracking-wider border-b border-slate-400">
                    <th className="border border-slate-400 p-1 uppercase" colSpan={5}>PURGAS DE SEDIMENTADORES (S1 - S4)</th>
                  </tr>
                  <tr className="bg-amber-900 text-white font-bold border-b border-slate-400 text-[11px]">
                    <th className="border border-slate-400 p-0.5 w-8">HS</th>
                    {PURGAS_KEYS.map((sKey) => (
                      <th key={sKey} className="border border-slate-400 p-0.5 w-11">{sKey}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HORARIOS.map((hs) => {
                    const esDelTurnoActual = horasTurnoActual.includes(hs);
                    const hsPurgas = purgasEstado[hs] || {};

                    return (
                      <tr key={`purga-${hs}`} className={esDelTurnoActual ? 'bg-amber-50/90 font-semibold' : 'bg-slate-50/50 opacity-60'}>
                        <td className={`border border-slate-400 p-0 font-bold ${esDelTurnoActual ? 'bg-amber-200 text-blue-950' : 'bg-slate-200 text-slate-500'}`}>
                          {hs}
                        </td>
                        {PURGAS_KEYS.map((sKey) => {
                          const val = hsPurgas[sKey] || '';
                          return (
                            <td key={sKey} className={`border border-slate-400 p-0 h-6 ${val === 'P' ? 'bg-amber-300 font-extrabold text-amber-950' : ''}`}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild disabled={!esDelTurnoActual}>
                                  <button className="w-full h-full text-center font-bold outline-none flex items-center justify-center disabled:cursor-not-allowed">
                                    {val || '-'}
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center" className="min-w-[5rem] p-1">
                                  <DropdownMenuItem onClick={() => setEstadoPurga(hs, sKey, 'P')} className="text-xs font-black bg-amber-100 py-1.5 cursor-pointer">
                                    P (Purga)
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setEstadoPurga(hs, sKey, '')} className="text-xs text-slate-400 py-1 cursor-pointer">
                                    Limpiar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* OBSERVACIONES GENERALES */}
            <div className="flex-1 flex flex-col border border-slate-400 rounded overflow-hidden min-w-[280px]">
              <div className="bg-slate-800 text-white font-bold p-1.5 text-xs text-center border-b border-slate-400 uppercase tracking-wide">
                OBSERVACIONES GENERALES
              </div>
              <textarea
                value={observacionesGenerales}
                onChange={(e) => setObservacionesGenerales(e.target.value)}
                placeholder="Escriba novedades del día, trabajos realizados, observaciones del turno..."
                className="w-full flex-1 p-2.5 text-xs resize-none border-none outline-none focus:ring-0 text-slate-800 bg-slate-50/50 leading-relaxed min-h-[180px]"
              />
            </div>

          </div>
        </div>

        {/* BOTÓN GUARDAR */}
        <div className="flex justify-end my-1">
          <Button 
            onClick={guardarPlanillaYRegistrar}
            className="h-8 text-xs bg-blue-700 hover:bg-blue-800 text-white px-5 shadow-sm"
          >
            Guardar Planilla Completa
          </Button>
        </div>
      </div>

    </div>
  );
}