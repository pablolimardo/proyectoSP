# **App Name**: WaterPlant Pro

## Core Features:

- Data Upload Module: Digitalize daily control sheet: including fields for date, time, operator name, caudal, raw water turbidity and ph, temperature, clarified water turbidity and ph, chlorine, PAC, soda, EBAP module measurements(HS, B1, B2, B3, B4), EBAC module measurements(HS, B1, B2, B3, B4), and filter module measurements.
- Data Storage: Store the collected data in Firebase Firestore, under a collection called 'registros_planta'. Each document will store timestamp, date, hour and name operator.
- Data History Visualization: Visualize stored entries in a table/card view with essential columns. Implement filtering by date for efficient data retrieval.
- Water Flow Guide Display: Display static content for the Water Flow Guide, including descriptive texts, a table for open canal measurements, and an image of a water measurement channel.
- Parshall Guide Display: Display static content for the Parshall Guide, with an introductory text about the Parshall meter, an image of a Parshall meter, and a conversion table for W=1 ft.

## Style Guidelines:

- Primary color: Soft blue (#64B5F6) to evoke a sense of cleanliness and reliability.
- Background color: Very light blue (#F0F8FF) to provide a clean and calm backdrop.
- Accent color: Light orange (#FFCC80) for interactive elements to attract user attention.
- Body and headline font: 'PT Sans', a humanist sans-serif providing a modern and warm touch, suitable for both headers and text.
- Use clear and simple icons that represent each module function.
- Maintain consistent, large tap targets optimized for tablets.