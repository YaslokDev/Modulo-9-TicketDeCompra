type TipoIva = "general" | "reducido" | "superreducidoA" | "superreducidoB" | "superreducidoC" | "sinIva";

interface Producto {
  nombre: string;
  precio: number;
  tipoIva: TipoIva;
}

interface LineaTicket {
  producto: Producto;
  cantidad: number;
}

interface ResultadoLineaTicket {
  precioUnitario: number;
  nombre: string;
  cantidad: number;
  precioSinIva: number;
  tipoIva: TipoIva;
  precioConIva: number;
}

interface ResultadoTotalTicket {
  totalSinIva: number;
  totalConIva: number;
  totalIva: number;
}

interface TotalPorTipoIva {
  tipoIva: TipoIva;
  cuantia: number;
}

interface TicketFinal {
  lineas: ResultadoLineaTicket[];
  total: ResultadoTotalTicket;
  desgloseIva: TotalPorTipoIva[];
}

const productos: LineaTicket[] = [
  {
    producto: {
      nombre: "Legumbres",
      precio: 2,
      tipoIva: "general",
    },
    cantidad: 2,
  },
  {
    producto: {
      nombre: "Perfume",
      precio: 20,
      tipoIva: "general",
    },
    cantidad: 3,
  },
  {
    producto: {
      nombre: "Leche",
      precio: 1,
      tipoIva: "superreducidoC",
    },
    cantidad: 6,
  },
  {
    producto: {
      nombre: "Lasaña",
      precio: 5,
      tipoIva: "superreducidoA",
    },
    cantidad: 1,
  },
];

// Obtener el porcentaje de IVA según el tipo
const obtenerPorcentajeIva = (tipoIva: TipoIva): number => {
  switch (tipoIva) {
    case "general":
      return 21;
    case "reducido":
      return 10;
    case "superreducidoA":
      return 5;
    case "superreducidoB":
      return 4;
    case "superreducidoC":
      return 0;
    case "sinIva":
      return 0;
    default:
      return 0;
  }
};

// Calcular el precio con IVA de una línea de ticket
const calcularPrecioConIva = (linea: LineaTicket): number => {
  const porcentajeIva = obtenerPorcentajeIva(linea.producto.tipoIva);
  const precioSinIva = linea.producto.precio * linea.cantidad;
  const iva = (precioSinIva * porcentajeIva) / 100;
  return parseFloat((precioSinIva + iva).toFixed(2));
};

// Calcular los detalles de una línea de ticket
const calcularLineaTicket = (linea: LineaTicket): ResultadoLineaTicket => ({
  nombre: linea.producto.nombre,
  cantidad: linea.cantidad,
  precioUnitario: linea.producto.precio,
  precioSinIva: linea.producto.precio * linea.cantidad,
  tipoIva: linea.producto.tipoIva,
  precioConIva: calcularPrecioConIva(linea),
});

// Calcular el total sin IVA
const calcularTotalSinIva = (lineas: ResultadoLineaTicket[]): number =>
  parseFloat(lineas.reduce((acc, linea) => acc + linea.precioSinIva, 0).toFixed(2));

// Calcular el desglose de IVA
const calcularDesgloseIva = (lineas: ResultadoLineaTicket[]): TotalPorTipoIva[] =>
  lineas.reduce((acc: TotalPorTipoIva[], linea) => {
    const existingTipoIva = acc.find((item) => item.tipoIva === linea.tipoIva);
    if (existingTipoIva) {
      existingTipoIva.cuantia += (linea.precioSinIva * obtenerPorcentajeIva(linea.tipoIva)) / 100;
    } else {
      acc.push({
        tipoIva: linea.tipoIva,
        cuantia: (linea.precioSinIva * obtenerPorcentajeIva(linea.tipoIva)) / 100,
      });
    }
    return acc;
  }, []);

// Calcular el total de IVA
const calcularTotalIva = (desgloseIva: TotalPorTipoIva[]): number =>
  parseFloat(desgloseIva.reduce((acc, item) => acc + item.cuantia, 0).toFixed(2));

// Calcular el ticket completo
const calculaTicket = (lineasTicket: LineaTicket[]): TicketFinal => {
  const lineas = lineasTicket.map(calcularLineaTicket);
  const totalSinIva = calcularTotalSinIva(lineas);
  const desgloseIva = calcularDesgloseIva(lineas);
  const totalIva = calcularTotalIva(desgloseIva);
  const totalConIva = parseFloat((totalSinIva + totalIva).toFixed(2));

  return { lineas, total: { totalSinIva, totalConIva, totalIva }, desgloseIva };
};

// Imprimir el ticket
const imprimirTicket = (ticket: TicketFinal): void => {
  console.log("-------------------------------------");
  console.log("           TICKET DE COMPRA          ");
  console.log("-------------------------------------");
  ticket.lineas.forEach((linea) => {
    console.log(
      `${linea.nombre.padEnd(15)} ${linea.cantidad.toString().padStart(3)} x ${linea.precioUnitario.toFixed(
        2
      )}€ = ${linea.precioSinIva.toFixed(2).padStart(5)}€`
    );
  });
  console.log("-------------------------------------");
  console.log(`Subtotal:        ${ticket.total.totalSinIva.toFixed(2)}€`);
  ticket.desgloseIva.forEach((iva) => {
    console.log(`IVA (${iva.tipoIva}):      ${iva.cuantia.toFixed(2)}€`);
  });
  console.log("-------------------------------------");
  console.log(`TOTAL:           ${ticket.total.totalConIva.toFixed(2)}€`);
  console.log("-------------------------------------");
};

const ticket = calculaTicket(productos);
imprimirTicket(ticket);
