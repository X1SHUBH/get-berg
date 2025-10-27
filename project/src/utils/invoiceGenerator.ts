import jsPDF from 'jspdf';
import type { Order, OrderItem } from '../lib/database.types';

export const generateEnhancedInvoice = (order: Order) => {
  const doc = new jsPDF();
  const items = order.items as OrderItem[];
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(205, 139, 101);
  doc.rect(0, 0, pageWidth, 50, 'F');

  doc.setTextColor(10, 10, 10);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('GET BERG', pageWidth / 2, 25, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.text('Good Food Good Mood', pageWidth / 2, 35, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Near Satashi School, Rudrapur U.P.', pageWidth / 2, 43, { align: 'center' });

  doc.setTextColor(245, 240, 232);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth / 2, 68, { align: 'center' });

  doc.setDrawColor(205, 139, 101);
  doc.setLineWidth(0.5);
  doc.line(20, 75, pageWidth - 20, 75);

  doc.setTextColor(51, 51, 51);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const invoiceInfoY = 90;
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Details:', 20, invoiceInfoY);
  doc.setFont('helvetica', 'normal');

  const detailsStartY = invoiceInfoY + 8;
  doc.text(`Order Number:`, 20, detailsStartY);
  doc.setFont('helvetica', 'bold');
  doc.text(order.order_number, 70, detailsStartY);

  doc.setFont('helvetica', 'normal');
  doc.text(`Date:`, 20, detailsStartY + 7);
  doc.text(
    new Date(order.created_at).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    70,
    detailsStartY + 7
  );

  doc.text(`Time:`, 20, detailsStartY + 14);
  doc.text(
    new Date(order.created_at).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    70,
    detailsStartY + 14
  );

  doc.setFont('helvetica', 'bold');
  doc.text('Customer Details:', 120, invoiceInfoY);
  doc.setFont('helvetica', 'normal');

  doc.text(`Name:`, 120, detailsStartY);
  doc.text(order.customer_name, 155, detailsStartY);

  doc.text(`Phone:`, 120, detailsStartY + 7);
  doc.text(order.customer_phone, 155, detailsStartY + 7);

  doc.text(`Status:`, 120, detailsStartY + 14);
  doc.setTextColor(34, 197, 94);
  doc.setFont('helvetica', 'bold');
  doc.text(order.payment_status.toUpperCase(), 155, detailsStartY + 14);

  doc.setTextColor(51, 51, 51);
  doc.setDrawColor(205, 139, 101);
  doc.line(20, detailsStartY + 22, pageWidth - 20, detailsStartY + 22);

  const tableStartY = detailsStartY + 32;
  doc.setFillColor(205, 139, 101);
  doc.rect(20, tableStartY, pageWidth - 40, 10, 'F');

  doc.setTextColor(10, 10, 10);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 25, tableStartY + 7);
  doc.text('Qty', 110, tableStartY + 7);
  doc.text('Price', 140, tableStartY + 7);
  doc.text('Total', 175, tableStartY + 7, { align: 'right' });

  doc.setTextColor(51, 51, 51);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  let currentY = tableStartY + 17;
  items.forEach((item, index) => {
    if (currentY > 250) {
      doc.addPage();
      currentY = 30;
    }

    if (index % 2 === 0) {
      doc.setFillColor(245, 240, 232);
      doc.rect(20, currentY - 5, pageWidth - 40, 8, 'F');
    }

    doc.text(item.name, 25, currentY);
    doc.text(item.quantity.toString(), 110, currentY);
    doc.text(`₹${item.price.toFixed(2)}`, 140, currentY);
    doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 190, currentY, { align: 'right' });

    currentY += 10;
  });

  doc.setDrawColor(205, 139, 101);
  doc.setLineWidth(0.5);
  doc.line(20, currentY, pageWidth - 20, currentY);

  currentY += 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TOTAL:', 130, currentY);
  doc.setTextColor(205, 139, 101);
  doc.setFontSize(16);
  doc.text(`₹${order.total_amount.toFixed(2)}`, 190, currentY, { align: 'right' });

  doc.setTextColor(51, 51, 51);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');

  const footerY = doc.internal.pageSize.getHeight() - 30;
  doc.setDrawColor(205, 139, 101);
  doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);

  doc.text('Thank you for ordering from Get Berg!', pageWidth / 2, footerY, {
    align: 'center',
  });
  doc.text('We hope to serve you again soon.', pageWidth / 2, footerY + 6, {
    align: 'center',
  });

  doc.setFontSize(8);
  doc.text('For any queries, please contact us at Get Berg, Rudrapur', pageWidth / 2, footerY + 14, {
    align: 'center',
  });

  doc.save(`GetBerg-Invoice-${order.order_number}.pdf`);
};
