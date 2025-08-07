import { HistoryClientPage } from '@/components/history-client-page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function HistorialPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Planilla de Historial de Datos</CardTitle>
          <CardDescription>
            Visualice y filtre todos los registros guardados. Haga clic en una fila para ver los detalles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HistoryClientPage />
        </CardContent>
      </Card>
    </div>
  );
}
