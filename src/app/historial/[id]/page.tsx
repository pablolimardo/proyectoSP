
'use server';
import { getRecordById } from '@/lib/actions';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, WashingMachine, Droplet, Wrench, PowerOff, Radio } from 'lucide-react';

interface DetailPageProps {
  params: { id: string };
}

const statusDisplay: { [key: string]: { icon: React.ReactNode, text: string, short: string, color: string } } = {
  "Marcha": { icon: <CheckCircle className="h-4 w-4 text-green-500" />, text: "Marcha", short: "M", color: "text-green-500 font-semibold" },
  "Detenido": { icon: <XCircle className="h-4 w-4 text-red-500" />, text: "Detenido", short: "D", color: "text-red-500 font-semibold" },
  "Lavado": { icon: <WashingMachine className="h-4 w-4 text-blue-500" />, text: "Lavado", short: "L", color: "text-blue-500 font-semibold" },
  "Purgado": { icon: <Droplet className="h-4 w-4 text-cyan-500" />, text: "Purgado", short: "P", color: "text-cyan-500" },
  "Local": { icon: <Wrench className="h-4 w-4 text-yellow-500" />, text: "Local", short: "Local", color: "text-yellow-500" },
  "Remoto": { icon: <Radio className="h-4 w-4 text-purple-500" />, text: "Remoto", short: "R", color: "text-purple-500" },
  "Fuera de Servicio": { icon: <PowerOff className="h-4 w-4 text-gray-500" />, text: "Fuera de Servicio", short: "FS", color: "text-gray-500" },
}


const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col space-y-1">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <div className="text-lg">{value}</div>
  </div>
);

const StatusItem = ({ label, value }: { label: string; value: string }) => {
    const display = statusDisplay[value] || { icon: null, text: value, short: value, color: '' };
    return (
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={`flex items-center space-x-2 text-lg ${display.color}`}>
          {display.icon}
          <span>{display.text}</span>
        </div>
      </div>
    );
};


export default async function RecordDetailPage({ params }: DetailPageProps) {
  const record = await getRecordById(params.id);

  if (!record) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
       <Link href="/historial">
         <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/> Volver al Historial</Button>
       </Link>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">
            Detalle del Registro - {format(new Date(record.timestamp), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle>Información General</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DetailItem label="Fecha" value={record.fecha} />
            <DetailItem label="Hora" value={record.hora} />
            <DetailItem label="Operador" value={<Badge variant="secondary" className="text-base">{record.nombreOperador}</Badge>} />
            <DetailItem label="Caudal" value={String(record.caudal)} />
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Agua Cruda y Clarificada</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <DetailItem label="Turbidez Agua Cruda" value={String(record.turbidezAguaCruda)} />
                <DetailItem label="pH Agua Cruda" value={String(record.phAguaCruda)} />
                <DetailItem label="Temperatura" value={`${record.temperatura}°C`} />
                <DetailItem label="Turbidez Agua Clarificada" value={String(record.turbidezAguaClarificada)} />
                <DetailItem label="pH Agua Clarificada" value={String(record.phAguaClarificada)} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Químicos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <DetailItem label="Cloro" value={String(record.cloro)} />
                <DetailItem label="PAC (ml/min)" value={String(record.pac.ml_min)} />
                <DetailItem label="PAC (ppm)" value={String(record.pac.ppm)} />
                <DetailItem label="Soda (ml/min)" value={String(record.soda.ml_min)} />
                <DetailItem label="Soda (ppm)" value={String(record.soda.ppm)} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Observaciones</CardTitle></CardHeader>
            <CardContent>
                <p className="text-base text-muted-foreground">{record.observaciones || 'Sin observaciones.'}</p>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader><CardTitle>EBAC</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {Object.entries(record.ebac).map(([key, value]) => <StatusItem key={key} label={key.toUpperCase()} value={value as string} />)}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader><CardTitle>EBAP</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {Object.entries(record.ebap).map(([key, value]) => <StatusItem key={key} label={key.toUpperCase()} value={value as string} />)}
            </CardContent>
        </Card>

        <Card className="lg:col-span-3">
            <CardHeader><CardTitle>Módulo Filtros</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(record.filtros).map(([key, value]) => <StatusItem key={key} label={`Filtro ${key.substring(1)}`} value={value as string} />)}
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
