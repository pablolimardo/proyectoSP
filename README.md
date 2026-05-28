# WaterPlant Pro — Planilla Digital de Control de Planta Potabilizadora

Sistema web para digitalizar y gestionar las planillas diarias de control operativo de una planta potabilizadora. Desarrollado por alumnos de 6.º año del año anterior como proyecto integrador.

---

## Descripcion del proyecto

WaterPlant Pro reemplaza la planilla en papel que usan los operadores de planta para registrar los parametros de calidad del agua, caudales y dosificacion de productos quimicos (PAC y SODA). La aplicacion permite:

- **Cargar datos** del turno: fecha, hora, operador, caudal, turbidez, pH, temperatura, cloro, dosificacion de PAC y SODA con calculo automatico de PPM, estado de balsas EBAP/EBAC y estado de filtros.
- **Consultar el historial** de registros con filtro por fecha.
- **Consultar guias de referencia**: tabla de dosificacion y conversion Parshall.

---

## Stack tecnologico

| Capa | Tecnologia |
|---|---|
| Framework frontend/backend | Next.js 15 (App Router + React Server Components) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 3 + shadcn/ui |
| Base de datos (desarrollo) | SQLite via better-sqlite3 |
| ORM | Drizzle ORM |
| Validacion de esquemas | Zod |
| Formularios | React Hook Form |
| IA (configurado, no activo en UI) | Google Genkit + Gemini 2.0 Flash |
| Despliegue (produccion) | Firebase App Hosting + Firestore |

---

## Requisitos previos

- **Node.js 18 o superior** — [https://nodejs.org](https://nodejs.org)
- **npm 9 o superior** (viene con Node.js)
- **Git** — [https://git-scm.com](https://git-scm.com)

Para verificar que tenes todo instalado, abri una terminal y ejecuta:

```bash
node -v
npm -v
git --version
```

---

## Pasos para levantar el proyecto en modo desarrollo

### 1. Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd proyectoSP
```

### 2. Instalar dependencias

```bash
npm install
```

Este comando lee el archivo `package.json` y descarga todos los paquetes necesarios en la carpeta `node_modules`. Puede tardar algunos minutos la primera vez.

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raiz del proyecto. Para desarrollo local con SQLite **no necesitas credenciales de Firebase**, alcanza con crear el archivo vacio o con contenido minimo:

```bash
# .env
# Para desarrollo local no se requieren variables adicionales.
# SQLite se crea automaticamente en sqlite.db al iniciar.
```

> **Nota:** El archivo `.env` esta en el `.gitignore` por seguridad. Nunca subas credenciales al repositorio.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El servidor arranca en [http://localhost:9002](http://localhost:9002). Abri esa URL en el navegador.

Deberias ver la pantalla principal con el formulario de carga de datos.

> **Nota:** La primera vez que se guarda un registro, Drizzle crea automaticamente el archivo `sqlite.db` con la tabla `records`.

### 5. Comandos utiles durante el desarrollo

```bash
npm run dev          # Servidor de desarrollo con hot-reload (Turbopack)
npm run build        # Compilar para produccion
npm run start        # Iniciar servidor de produccion (requiere build previo)
npm run typecheck    # Verificar tipos TypeScript sin compilar
npm run lint         # Verificar reglas de ESLint
```

---

## Estructura del proyecto

```
proyectoSP/
├── src/
│   ├── app/                        # Rutas y paginas (Next.js App Router)
│   │   ├── page.tsx                # Pagina principal: formulario de carga
│   │   ├── layout.tsx              # Layout raiz con navegacion
│   │   ├── api/records/route.ts    # API REST: GET y POST de registros
│   │   ├── historial/page.tsx      # Pagina de historial
│   │   ├── guia-dosificacion/      # Guia estatica de dosificacion
│   │   └── guia-parshall/          # Guia estatica Parshall
│   ├── components/
│   │   ├── data-upload-form.tsx    # Formulario principal de carga
│   │   ├── history-client-page.tsx # Vista de historial con filtros
│   │   ├── header.tsx              # Cabecera y navegacion
│   │   └── ui/                     # Componentes shadcn/ui (45+ archivos)
│   ├── context/
│   │   └── form-context.tsx        # Context API para estado del formulario
│   ├── hooks/
│   │   └── use-toast.ts            # Hook para notificaciones toast
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts            # Conexion SQLite + Drizzle
│   │   │   └── schema.ts           # Esquema de la tabla records
│   │   ├── types.ts                # Esquemas Zod e interfaces TypeScript
│   │   ├── actions.ts              # Server Actions de Next.js
│   │   └── utils.ts                # Utilidades generales
│   └── ai/
│       └── genkit.ts               # Configuracion de Genkit/Gemini
├── docs/
│   └── blueprint.md                # Especificacion original del proyecto
├── drizzle/                        # Migraciones de base de datos
├── public/                         # Archivos estaticos (logo, imagenes)
├── sqlite.db                       # Base de datos local (se crea al correr)
├── package.json
├── next.config.ts
├── drizzle.config.ts
└── tailwind.config.ts
```

---

## Como funciona la aplicacion (flujo de datos)

```
Operador completa el formulario
        |
        v
React Hook Form valida con Zod (client-side)
        |
        v
POST /api/records  (Next.js API Route)
        |
        v
Zod valida en servidor (server-side)
        |
        v
Drizzle ORM inserta en SQLite (local) o Firestore (produccion)
        |
        v
GET /api/records?date=YYYY-MM-DD  (historial con filtro)
```

---

## Calculo automatico de PPM

El formulario calcula automaticamente los PPM de PAC y SODA usando:

```
PAC PPM  = (ml/min × 1.26 × 60) / caudal
SODA PPM = (ml/min × 0.05 × 60) / caudal
```

Este calculo ocurre en el cliente cada vez que cambia el caudal o los ml/min, implementado en `src/components/data-upload-form.tsx` con `useEffect` y `watch` de React Hook Form.

---

## Base de datos

El esquema de la tabla `records` esta definido en `src/lib/db/schema.ts` con Drizzle ORM:

| Campo | Tipo | Descripcion |
|---|---|---|
| id | INTEGER PK | Identificador autoincremental |
| fecha | TEXT | Fecha del registro |
| hora | TEXT | Hora del registro |
| nombreOperador | TEXT | Nombre del operador |
| caudal | REAL | Caudal en m³/h |
| turbidezAguaCruda | REAL | Turbidez agua cruda (NTU) |
| phAguaCruda | REAL | pH agua cruda |
| temperatura | REAL | Temperatura |
| turbidezAguaClarificada | REAL | Turbidez agua clarificada (NTU) |
| phAguaClarificada | REAL | pH agua clarificada |
| cloro | REAL | Cloro residual |
| pac_ml_min | REAL | Caudal PAC en ml/min |
| pac_ppm | REAL | Concentracion PAC en PPM (calculado) |
| soda_ml_min | REAL | Caudal SODA en ml/min |
| soda_ppm | REAL | Concentracion SODA en PPM (calculado) |
| ebap_b1..b4 | TEXT | Estado de cada balsa EBAP |
| ebac_b1..b4 | TEXT | Estado de cada balsa EBAC |
| filtros_f1..f8 | TEXT | Estado de cada filtro |
| observaciones | TEXT | Notas opcionales |
| timestamp | INTEGER | Marca de tiempo (Unix) |

Los estados posibles para balsas y filtros son: `Marcha`, `Detenido`, `Lavado`, `Purgado`, `Local`, `Remoto`, `Fuera de Servicio`.

---

## Trabajo practico individual

### Consigna

Tu tarea es **implementar una nueva funcionalidad** sobre este proyecto existente, o **mejorarlo de forma significativa** en alguno de los aspectos detallados a continuacion. El trabajo es **individual** y sera evaluado con defensa oral.

Elegi **una** de las siguientes opciones de implementacion:

#### Opcion A — Graficos de evolucion de parametros
Implementar en la seccion de historial graficos de linea que muestren la evolucion temporal de al menos dos parametros de calidad del agua (por ejemplo turbidez y pH). Usar la libreria `recharts` que ya esta instalada.

#### Opcion B — Exportacion a CSV/PDF
Agregar un boton en la vista de historial que permita exportar los registros filtrados a un archivo CSV descargable. Como bonus, explorar la generacion de PDF con los datos de un registro individual.

#### Opcion C — Autenticacion de operadores
Implementar un sistema de login simple (puede ser solo frontend con usuarios hardcodeados o usando Firebase Authentication) para que solo operadores autorizados puedan cargar datos.

#### Opcion D — API REST documentada
Documentar y extender la API existente: agregar un endpoint `GET /api/records/:id` para obtener un registro individual, un endpoint `DELETE /api/records/:id`, y documentar todos los endpoints con comentarios JSDoc o un archivo OpenAPI/Swagger.

#### Opcion E — Mejora de UI/UX
Rediseñar la vista del historial para mostrar las cards de registros con indicadores visuales de alertas (por ejemplo si el pH esta fuera del rango normal 6.5–8.5 que la card se destaque en color). Implementar paginacion si hay mas de 10 registros.

---

### Preguntas de analisis

Responde estas preguntas **por escrito** antes de la defensa. El objetivo es que demuestres que entendiste el proyecto y no solo que lo pudiste correr.

**Arquitectura y tecnologia:**

1. Este proyecto usa el **App Router de Next.js 15**. Explica que diferencia hay entre un Server Component y un Client Component. Da un ejemplo de cada uno en este proyecto y justifica por que cada uno esta implementado de esa forma.

2. El proyecto tiene **dos capas de validacion** del formulario: una en el cliente (React Hook Form + Zod) y otra en el servidor (`/api/records/route.ts`). ¿Por que es necesario validar en ambos lados? ¿Que pasaria si solo se validara en el cliente?

3. Observa el archivo `src/lib/db/index.ts`. La conexion a SQLite se hace con `new Database('sqlite.db')` usando una ruta relativa. ¿Que problema puede surgir con esto al deployar en produccion? ¿Como lo resolverias?

**Base de datos y ORM:**

4. El proyecto usa **Drizzle ORM** para interactuar con SQLite. ¿Que ventaja tiene usar un ORM sobre escribir SQL directamente en JavaScript? ¿Y que desventaja?

5. El esquema tiene los estados de balsas y filtros como campos de texto separados (`ebap_b1`, `ebap_b2`, etc.). Desde el punto de vista del diseño de base de datos, ¿es esta la mejor opcion? ¿Como lo modelarias vos? Justifica.

**Seguridad:**

6. El endpoint `POST /api/records` no tiene ningun tipo de autenticacion. Cualquiera que conozca la URL puede cargar datos. ¿Como implementarias una proteccion basica? Nombra al menos dos mecanismos distintos y explica las diferencias.

7. El archivo `.env` esta en el `.gitignore`. ¿Por que es critico nunca subir ese archivo al repositorio? Da un ejemplo concreto de que podria pasar si alguien subiera credenciales de Firebase a un repositorio publico.

**Logica de negocio:**

8. Analiza la formula de calculo de PPM: `(ml_min × 1.26 × 60) / caudal`. ¿De donde vienen los valores 1.26 y 0.05? ¿Que representa cada variable? Si el caudal es 0, ¿que pasa en el codigo y como se deberia manejar ese caso borde?

9. Revisa el endpoint `GET /api/records` con filtro por fecha en `src/app/api/records/route.ts`. ¿El filtro funciona correctamente si el usuario del frontend esta en una zona horaria diferente al servidor? Explica el problema y propone una solucion.

**Extensibilidad:**

10. Actualmente el proyecto tiene configurado **Genkit con Gemini 2.0 Flash** (`src/ai/genkit.ts`) pero no esta siendo usado en la interfaz. Propone **una funcionalidad concreta** que podria implementarse con IA en este contexto (operacion de planta potabilizadora). Describe el prompt que usarias y como integrarias la respuesta en la UI.

---

### Criterios de evaluacion

| Criterio | Peso |
|---|---|
| Implementacion funcionando (opcion elegida) | 40% |
| Calidad del codigo (legibilidad, estructura, tipos TypeScript) | 20% |
| Respuestas de analisis escritas | 25% |
| Defensa oral: profundidad tecnica al responder preguntas | 15% |

---

## Notas para el docente

Este proyecto fue desarrollado en 2025 por alumnos de 6.º año como proyecto integrador con SPSE Laboratorio. No pudo ser implementado en produccion por limitaciones de hardware. El desafio para la camada 2026 es entender el codigo existente, correrlo localmente y extenderlo con criterio tecnico.

La evaluacion apunta a medir si el alumno puede **leer y comprender codigo que no escribio**, **tomar decisiones tecnicas justificadas** y **comunicar esas decisiones con vocabulario apropiado**.
