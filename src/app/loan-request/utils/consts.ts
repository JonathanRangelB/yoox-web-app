import { Plazo } from '../types/loan-request.interface';

export const tiposCalle = [
  { name: 'CARRETERA', value: 'CARRETERA' },
  { name: 'PRIVADA', value: 'PRIVADA' },
  { name: 'CALLE', value: 'CALLE' },
  { name: 'BOULEVARD', value: 'BOULEVARD' },
  { name: 'PROLONGACION', value: 'PROLONGACION' },
  { name: 'AVENIDA', value: 'AVENIDA' },
];

export const estadosDeLaRepublica = [
  { name: 'Jalisco', value: 'JALISCO' },
  { name: 'Aguascalientes', value: 'AGUASCALIENTES' },
  { name: 'Baja California', value: 'BAJA CALIFORNIA' },
  { name: 'Baja California Sur', value: 'BAJA CALIFORNIA SUR' },
  { name: 'Campeche', value: 'CAMPECHE' },
  { name: 'Coahuila', value: 'COAHUILA' },
  { name: 'Colima', value: 'COLIMA' },
  { name: 'Chiapas', value: 'CHIAPAS' },
  { name: 'Chihuahua', value: 'CHIHUAHUA' },
  { name: 'Durango', value: 'DURANGO' },
  { name: 'CDMX', value: 'CDMX' },
  { name: 'Guanajuato', value: 'GUANAJUATO' },
  { name: 'Guerrero', value: 'GUERRERO' },
  { name: 'Hidalgo', value: 'HIDALGO' },
  { name: 'Estado de México', value: 'ESTADO DE MEXICO' },
  { name: 'Michoacán', value: 'MICHOACAN' },
  { name: 'Morelos', value: 'MORELOS' },
  { name: 'Nayarit', value: 'NAYARIT' },
  { name: 'Nuevo León', value: 'NUEVO LEON' },
  { name: 'Oaxaca', value: 'OAXACA' },
  { name: 'Puebla', value: 'PUEBLA' },
  { name: 'Querétaro', value: 'QUERETARO' },
  { name: 'Quintana Roo', value: 'QUINTANA ROO' },
  { name: 'San Luis Potosí', value: 'SAN LUIS POTOSI' },
  { name: 'Sinaloa', value: 'SINALOA' },
  { name: 'Sonora', value: 'SONORA' },
  { name: 'Tabasco', value: 'TABASCO' },
  { name: 'Tamaulipas', value: 'TAMAULIPAS' },
  { name: 'Tlaxcala', value: 'TLAXCALA' },
  { name: 'Veracruz', value: 'VERACRUZ' },
  { name: 'Yucatán', value: 'YUCATAN' },
  { name: 'Zacatecas', value: 'ZACATECAS' },
];

export const plazos: Plazo[] = [
  { semanas_plazo: '14', tasa_de_interes: 40, id: 1, semanas_refinancia: '10' },
  { semanas_plazo: '28', tasa_de_interes: 82, id: 2, semanas_refinancia: '24' },
  { semanas_plazo: '12', tasa_de_interes: 20, id: 3, semanas_refinancia: '10' },
  { semanas_plazo: '13', tasa_de_interes: 30, id: 4, semanas_refinancia: '10' },
  { semanas_plazo: '11', tasa_de_interes: 10, id: 5, semanas_refinancia: '10' },
  {
    semanas_plazo: '35',
    tasa_de_interes: 110,
    id: 6,
    semanas_refinancia: '32',
  },
  { semanas_plazo: '26', tasa_de_interes: 80, id: 7, semanas_refinancia: '24' },
  { semanas_plazo: '24', tasa_de_interes: 56, id: 8, semanas_refinancia: '20' },
];

export const days = [
  'DOMINGO',
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
];
