import { getRecordById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface DetailPageProps {
  params: { id: string };
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col space-y-1">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-lg">{value}</p>
  </div>
);

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
            <DetailItem label="Caudal" value={record.caudal} />
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Agua Cruda y Clarificada</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <DetailItem label="Turbidez Agua Cruda" value={record.turbidezAguaCruda} />
                <DetailItem label="pH Agua Cruda" value={record.phAguaCruda} />
                <DetailItem label="Temperatura" value={`${record.temperatura}°C`} />
                <DetailItem label="Turbidez Agua Clarificada" value={record.turbidezAguaClarificada} />
                <DetailItem label="pH Agua Clarificada" value={record.phAguaClarificada} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Químicos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <DetailItem label="Cloro" value={record.cloro} />
                <DetailItem label="PAC (ml/min)" value={record.pac.ml_min} />
                <DetailItem label="PAC (ppm)" value={record.pac.ppm} />
                <DetailItem label="Soda (ml/min)" value={record.soda.ml_min} />
                <DetailItem label="Soda (ppm)" value={record.soda.ppm} />
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Observaciones</CardTitle></CardHeader>
            <CardContent>
                <p className="text-base text-muted-foreground">{record.observaciones || 'Sin observaciones.'}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Módulo EBAP</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {Object.entries(record.ebap).map(([key, value]) => <DetailItem key={key} label={key.toUpperCase()} value={value} />)}
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Módulo EBAC</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {Object.entries(record.ebac).map(([key, value]) => <DetailItem key={key} label={key.toUpperCase()} value={value} />)}
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Módulo Filtros</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {Object.entries(record.filtros).map(([key, value]) => <DetailItem key={key} label={`Filtro ${key.substring(1)}`} value={value} />)}
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
