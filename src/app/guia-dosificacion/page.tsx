import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const pacData = [
    { caudal: 500, '20': 132, '22,5': 149, '25': 165, '27,5': 182, '30': 198, '32,5': 215, '35': 231, '37,5': 248, '40': 265 },
    { caudal: 550, '20': 146, '22,5': 164, '25': 182, '27,5': 200, '30': 218, '32,5': 236, '35': 255, '37,5': 273, '40': 291 },
    { caudal: 600, '20': 159, '22,5': 179, '25': 198, '27,5': 218, '30': 238, '32,5': 258, '35': 278, '37,5': 298, '40': 317 },
    { caudal: 650, '20': 172, '22,5': 193, '25': 215, '27,5': 236, '30': 258, '32,5': 279, '35': 301, '37,5': 322, '40': 344 },
    { caudal: 700, '20': 185, '22,5': 208, '25': 231, '27,5': 255, '30': 278, '32,5': 301, '35': 324, '37,5': 347, '40': 370 },
    { caudal: 750, '20': 198, '22,5': 223, '25': 248, '27,5': 273, '30': 298, '32,5': 322, '35': 347, '37,5': 372, '40': 397 },
    { caudal: 800, '20': 212, '22,5': 238, '25': 265, '27,5': 291, '30': 317, '32,5': 344, '35': 370, '37,5': 397, '40': 423 },
    { caudal: 850, '20': 225, '22,5': 253, '25': 281, '27,5': 309, '30': 337, '32,5': 365, '35': 394, '37,5': 422, '40': 450 },
    { caudal: 900, '20': 238, '22,5': 268, '25': 298, '27,5': 327, '30': 357, '32,5': 387, '35': 417, '37,5': 446, '40': 476 },
    { caudal: 950, '20': 251, '22,5': 283, '25': 314, '27,5': 346, '30': 377, '32,5': 408, '35': 440, '37,5': 471, '40': 503 },
    { caudal: 1000, '20': 265, '22,5': 298, '25': 331, '27,5': 364, '30': 397, '32,5': 430, '35': 463, '37,5': 496, '40': 529 },
    { caudal: 1050, '20': 278, '22,5': 313, '25': 347, '27,5': 382, '30': 417, '32,5': 451, '35': 486, '37,5': 521, '40': 556 },
    { caudal: 1100, '20': 291, '22,5': 327, '25': 364, '27,5': 400, '30': 437, '32,5': 473, '35': 509, '37,5': 546, '40': 582 },
    { caudal: 1150, '20': 304, '22,5': 342, '25': 380, '27,5': 418, '30': 456, '32,5': 494, '35': 532, '37,5': 570, '40': 608 },
    { caudal: 1200, '20': 317, '22,5': 357, '25': 397, '27,5': 437, '30': 476, '32,5': 516, '35': 556, '37,5': 595, '40': 635 },
    { caudal: 1250, '20': 331, '22,5': 372, '25': 413, '27,5': 455, '30': 496, '32,5': 537, '35': 579, '37,5': 620, '40': 661 },
    { caudal: 1300, '20': 344, '22,5': 387, '25': 430, '27,5': 473, '30': 516, '32,5': 559, '35': 602, '37,5': 645, '40': 688 },
    { caudal: 1350, '20': 357, '22,5': 402, '25': 446, '27,5': 491, '30': 536, '32,5': 580, '35': 625, '37,5': 670, '40': 714 },
    { caudal: 1400, '20': 370, '22,5': 417, '25': 463, '27,5': 509, '30': 556, '32,5': 602, '35': 648, '37,5': 694, '40': 741 },
    { caudal: 1450, '20': 384, '22,5': 432, '25': 479, '27,5': 527, '30': 575, '32,5': 623, '35': 671, '37,5': 719, '40': 767 },
    { caudal: 1500, '20': 397, '22,5': 446, '25': 496, '27,5': 546, '30': 595, '32,5': 645, '35': 694, '37,5': 744, '40': 794 },
    { caudal: 1550, '20': 410, '22,5': 461, '25': 513, '27,5': 564, '30': 615, '32,5': 666, '35': 718, '37,5': 769, '40': 820 },
    { caudal: 1600, '20': 423, '22,5': 476, '25': 529, '27,5': 582, '30': 635, '32,5': 688, '35': 741, '37,5': 794, '40': 847 },
];
const pacHeaders = ['20', '22,5', '25', '27,5', '30', '32,5', '35', '37,5', '40'];

const sodaData = [
    { caudal: 500, '2': 333, '3': 500, '4': 667, '5': 833, '6': 1000, '7': 1167, '8': 1333 },
    { caudal: 550, '2': 367, '3': 550, '4': 733, '5': 917, '6': 1100, '7': 1283, '8': 1467 },
    { caudal: 600, '2': 400, '3': 600, '4': 800, '5': 1000, '6': 1200, '7': 1400, '8': 1600 },
    { caudal: 650, '2': 433, '3': 650, '4': 867, '5': 1083, '6': 1300, '7': 1517, '8': 1733 },
    { caudal: 700, '2': 467, '3': 700, '4': 933, '5': 1167, '6': 1400, '7': 1633, '8': 1867 },
    { caudal: 750, '2': 500, '3': 750, '4': 1000, '5': 1250, '6': 1500, '7': 1750, '8': 2000 },
    { caudal: 800, '2': 533, '3': 800, '4': 1067, '5': 1333, '6': 1600, '7': 1867, '8': 2133 },
    { caudal: 850, '2': 567, '3': 850, '4': 1133, '5': 1417, '6': 1700, '7': 1983, '8': 2267 },
    { caudal: 900, '2': 600, '3': 900, '4': 1200, '5': 1500, '6': 1800, '7': 2100, '8': 2400 },
    { caudal: 950, '2': 633, '3': 950, '4': 1267, '5': 1583, '6': 1900, '7': 2217, '8': 2533 },
    { caudal: 1000, '2': 667, '3': 1000, '4': 1333, '5': 1667, '6': 2000, '7': 2333, '8': 2667 },
    { caudal: 1050, '2': 700, '3': 1050, '4': 1400, '5': 1750, '6': 2100, '7': 2450, '8': 2800 },
    { caudal: 1100, '2': 733, '3': 1100, '4': 1467, '5': 1833, '6': 2200, '7': 2567, '8': 2933 },
    { caudal: 1150, '2': 767, '3': 1150, '4': 1533, '5': 1917, '6': 2300, '7': 2683, '8': 3067 },
    { caudal: 1200, '2': 800, '3': 1200, '4': 1600, '5': 2000, '6': 2400, '7': 2800, '8': 3200 },
    { caudal: 1250, '2': 833, '3': 1250, '4': 1667, '5': 2083, '6': 2500, '7': 2917, '8': 3333 },
    { caudal: 1300, '2': 867, '3': 1300, '4': 1733, '5': 2167, '6': 2600, '7': 3033, '8': 3467 },
    { caudal: 1350, '2': 900, '3': 1350, '4': 1800, '5': 2250, '6': 2700, '7': 3150, '8': 3600 },
    { caudal: 1400, '2': 933, '3': 1400, '4': 1867, '5': 2333, '6': 2800, '7': 3267, '8': 3733 },
    { caudal: 1450, '2': 967, '3': 1450, '4': 1933, '5': 2417, '6': 2900, '7': 3383, '8': 3867 },
    { caudal: 1500, '2': 1000, '3': 1500, '4': 2000, '5': 2500, '6': 3000, '7': 3500, '8': 4000 },
    { caudal: 1550, '2': 1033, '3': 1550, '4': 2067, '5': 2583, '6': 3100, '7': 3617, '8': 4133 },
    { caudal: 1600, '2': 1067, '3': 1600, '4': 2133, '5': 2667, '6': 3200, '7': 3733, '8': 4267 },
];
const sodaHeaders = ['2', '3', '4', '5', '6', '7', '8'];


export default function GuiaDosificacionPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <Card className="w-full max-w-7xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Guía de Dosificación</CardTitle>
          <CardDescription>
            Una guía de referencia rápida para los operadores.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold font-headline mb-2">Dosis en p.p.m de PAC</h2>
            <p className="text-muted-foreground mb-4">Mililitros de solución de PAC puro cada 60 segundos.</p>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold sticky left-0 bg-card">CAUDAL m3/h</TableHead>
                    {pacHeaders.map(header => <TableHead key={header}>{header}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pacData.map((row) => (
                    <TableRow key={row.caudal}>
                      <TableCell className="font-medium sticky left-0 bg-card">{row.caudal}</TableCell>
                      {pacHeaders.map(header => <TableCell key={header}>{row[header as keyof typeof row]}</TableCell>)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold font-headline mb-2">Dosis de SODA p.p.m</h2>
            <p className="text-muted-foreground mb-4">Mililitros solución de SODA.</p>
            <div className="overflow-x-auto rounded-md border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="font-bold sticky left-0 bg-card">CAUDAL m3/h</TableHead>
                    {sodaHeaders.map(header => <TableHead key={header}>{header}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sodaData.map((row) => (
                    <TableRow key={row.caudal}>
                        <TableCell className="font-medium sticky left-0 bg-card">{row.caudal}</TableCell>
                        {sodaHeaders.map(header => <TableCell key={header}>{row[header as keyof typeof row]}</TableCell>)}
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
