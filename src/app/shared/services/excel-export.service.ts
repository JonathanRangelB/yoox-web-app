import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { DatosAgenda } from 'src/app/cobro-agenda/interfaces/cobro-agenda.interface';

@Injectable({ providedIn: 'root' })
export class ExcelExportService {
  async exportAgendaToExcel(
    data: DatosAgenda[],
    fileName: string
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Agenda de Cobro');

    const headers = [
      'ID cliente',
      'Cliente',
      'Folio Préstamo',
      'Día de pago',
      'Plazo',
      'Préstamo',
      'Saldo pendiente',
      'Monto/Cantidad',
      '# Pago',
      '# Pagos Atrasados',
      'Pagos Restantes',
      'Fecha último pago',
      'Vencimiento de crédito',
      'Folio de último préstamo aprobado',
    ];

    worksheet.addRow(headers);

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
      };
    });

    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: headers.length },
    };

    data.forEach((item) => {
      worksheet.addRow([
        item.id_cliente,
        item.nombreCliente,
        item.folioDeCredito,
        item.diaDePago,
        item.totalSemanasPrestamo,
        item.montoPrestamo,
        item.saldoPendiente,
        item.montoPago,
        item.pagoActual,
        item.numeroAtrasos,
        item.pagosRestante,
        this.parseDate(item.fechaUltimoPago),
        this.parseDate(item.fechaVencimiento),
        item.ultimaSolicitudPrestamoAprobada,
      ]);
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = Math.min(Math.max(maxLength + 2, 12), 40);
    });

    const numericColumns = [1, 5, 6, 7, 8, 9, 10, 11];
    const dateColumns = [12, 13, 14];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      numericColumns.forEach((colIndex) => {
        const cell = row.getCell(colIndex);
        if (typeof cell.value === 'number') {
          cell.numFmt = '#,##0.00';
          cell.alignment = { horizontal: 'right' };
        }
      });
      dateColumns.forEach((colIndex) => {
        const cell = row.getCell(colIndex);
        if (cell.value instanceof Date) {
          cell.numFmt = 'dd/mm/yyyy';
          cell.alignment = { horizontal: 'center' };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${fileName}.xlsx`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }

  private parseDate(value: Date | string | null | undefined): Date | null {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
}
