import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const caudalData = [
  { altura: '3,0', caudal: '18,8' }, { altura: '24,5', caudal: '438,9' },
  { altura: '3,5', caudal: '23,7' }, { altura: '25,0', caudal: '452,4' },
  { altura: '4,0', caudal: '29,0' }, { altura: '25,5', caudal: '466,1' },
  { altura: '4,5', caudal: '34,6' }, { altura: '26,0', caudal: '479,8' },
  { altura: '5,0', caudal: '40,5' }, { altura: '26,5', caudal: '493,8' },
  { altura: '5,5', caudal: '46,7' }, { altura: '27,0', caudal: '507,8' },
  { altura: '6,0', caudal: '53,2' }, { altura: '27,5', caudal: '522,0' },
  { altura: '6,5', caudal: '60,0' }, { altura: '28,0', caudal: '536,3' },
  { altura: '7,0', caudal: '67,0' }, { altura: '28,5', caudal: '550,7' },
  { altura: '7,5', caudal: '74,3' }, { altura: '29,0', caudal: '565,2' },
  { altura: '8,0', caudal: '81,9' }, { altura: '29,5', caudal: '579,9' },
  { altura: '8,5', caudal: '89,7' }, { altura: '30,0', caudal: '594,7' },
  { altura: '9,0', caudal: '97,7' }, { altura: '30,5', caudal: '609,7' },
  { altura: '9,5', caudal: '106,0' }, { altura: '31,0', caudal: '624,7' },
  { altura: '10,0', caudal: '114,5' }, { altura: '31,5', caudal: '639,9' },
  { altura: '10,5', caudal: '123,1' }, { altura: '32,0', caudal: '655,2' },
  { altura: '11,0', caudal: '132,0' }, { altura: '32,5', caudal: '670,6' },
  { altura: '11,5', caudal: '141,2' }, { altura: '33,0', caudal: '686,1' },
  { altura: '12,0', caudal: '150,5' }, { altura: '33,5', caudal: '701,8' },
  { altura: '12,5', caudal: '160,0' }, { altura: '34,0', caudal: '717,6' },
  { altura: '13,0', caudal: '169,7' }, { altura: '34,5', caudal: '733,4' },
  { altura: '13,5', caudal: '179,5' }, { altura: '35,0', caudal: '749,5' },
  { altura: '14,0', caudal: '189,6' }, { altura: '35,5', caudal: '765,6' },
  { altura: '14,5', caudal: '199,8' }, { altura: '36,0', caudal: '781,8' },
  { altura: '15,0', caudal: '210,3' }, { altura: '36,5', caudal: '798,1' },
  { altura: '15,5', caudal: '220,9' }, { altura: '37,0', caudal: '814,6' },
  { altura: '16,0', caudal: '231,6' }, { altura: '37,5', caudal: '831,2' },
  { altura: '16,5', caudal: '242,6' }, { altura: '38,0', caudal: '847,8' },
  { altura: '17,0', caudal: '253,7' }, { altura: '38,5', caudal: '864,6' },
  { altura: '17,5', caudal: '265,0' }, { altura: '39,0', caudal: '881,5' },
  { altura: '18,0', caudal: '276,4' }, { altura: '39,5', caudal: '898,5' },
  { altura: '18,5', caudal: '288,0' }, { altura: '40,0', caudal: '915,7' },
  { altura: '19,0', caudal: '299,8' }, { altura: '40,5', caudal: '932,9' },
  { altura: '19,5', caudal: '311,7' }, { altura: '41,0', caudal: '950,2' },
  { altura: '20,0', caudal: '323,7' }, { altura: '41,5', caudal: '967,6' },
  { altura: '20,5', caudal: '335,9' }, { altura: '42,0', caudal: '985,2' },
  { altura: '21,0', caudal: '348,3' }, { altura: '42,5', caudal: '1.002,8' },
  { altura: '21,5', caudal: '360,8' }, { altura: '43,0', caudal: '1.020,6' },
  { altura: '22,0', caudal: '373,5' }, { altura: '43,5', caudal: '1.038,4' },
  { altura: '22,5', caudal: '386,3' }, { altura: '44,0', caudal: '1.056,4' },
  { altura: '23,0', caudal: '399,2' }, { altura: '44,5', caudal: '1.074,4' },
  { altura: '23,5', caudal: '412,3' }, { altura: '45,0', caudal: '1.092,6' },
  { altura: '24,0', caudal: '425,6' },
].sort((a, b) => parseFloat(a.altura.replace(',', '.')) - parseFloat(b.altura.replace(',', '.')));


export default function GuiaParshallPage() {
  const half = Math.ceil(caudalData.length / 2);
  const firstHalf = caudalData.slice(0, half);
  const secondHalf = caudalData.slice(half);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Tabla de Caudales en Canaleta Parshall</CardTitle>
          <CardDescription>
            Referencia rápida para la conversión de altura (cm) a caudal (m³/h).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Altura (CM)</TableHead>
                    <TableHead className="font-bold">Caudal M3/H</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {firstHalf.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.altura}</TableCell>
                      <TableCell>{row.caudal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Altura (CM)</TableHead>
                    <TableHead className="font-bold">Caudal M3/H</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {secondHalf.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.altura}</TableCell>
                      <TableCell>{row.caudal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
