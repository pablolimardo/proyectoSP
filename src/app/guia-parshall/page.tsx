import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';

export default function GuiaParshallPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Guía de Uso del Medidor Parshall</CardTitle>
          <CardDescription>
            Referencia específica sobre el medidor Parshall.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h2 className="text-2xl font-semibold font-headline mb-2">Uso del Medidor Parshall</h2>
            <p className="text-muted-foreground">
              El medidor Parshall es un dispositivo de aforo de caudal de gran precisión para canales abiertos. Su diseño único permite mediciones fiables incluso con pequeñas variaciones en el nivel del agua.
            </p>
          </section>
          
          <section className="flex justify-center">
             <div className="w-full max-w-2xl rounded-lg overflow-hidden border shadow-md">
                <Image
                    src="https://placehold.co/800x400.png"
                    alt="Medidor Parshall"
                    width={800}
                    height={400}
                    className="object-cover w-full h-auto"
                    data-ai-hint="parshall flume"
                />
            </div>
          </section>
          
          <section>
             <h3 className="text-xl font-semibold font-headline mb-2">Tabla de Conversión (W=1 ft)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Altura (Ha) en ft</TableHead>
                  <TableHead>Caudal (Q) en ft³/s</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>0.2</TableCell>
                  <TableCell>0.20</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>0.3</TableCell>
                  <TableCell>0.35</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>0.4</TableCell>
                  <TableCell>0.53</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>0.5</TableCell>
                  <TableCell>0.73</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
