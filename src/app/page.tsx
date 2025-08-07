import { DataUploadForm } from '@/components/data-upload-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Cargar Datos de Planilla</CardTitle>
          <CardDescription>
            Complete los campos para digitalizar la planilla de control diaria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataUploadForm />
        </CardContent>
      </Card>
    </div>
  );
}
