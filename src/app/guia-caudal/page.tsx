import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';

export default function GuiaCaudalPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Guía de Caudal del Agua</CardTitle>
          <CardDescription>
            Una guía de referencia rápida para los operadores.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h2 className="text-2xl font-semibold font-headline mb-2">Medición en Canal Abierto</h2>
            <p className="text-muted-foreground">
              Para medir el caudal, siga estos pasos:
            </p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Identifique el punto de medición.</li>
              <li>Use la regla de medición para determinar la altura (H).</li>
              <li>Consulte la siguiente tabla para encontrar el caudal (Q) en m³/s:</li>
            </ol>
          </section>

          <section>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Altura (H) en cm</TableHead>
                  <TableHead>Caudal (Q) en m³/s</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>10</TableCell>
                  <TableCell>0.5</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>20</TableCell>
                  <TableCell>1.2</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>30</TableCell>
                  <TableCell>2.1</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>40</TableCell>
                  <TableCell>3.3</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>

          <section className="flex justify-center">
            <div className="w-full max-w-2xl rounded-lg overflow-hidden border shadow-md">
                <Image
                    src="https://placehold.co/800x400.png"
                    alt="Canal de medición de agua"
                    width={800}
                    height={400}
                    className="object-cover w-full h-auto"
                    data-ai-hint="water measurement channel"
                />
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
