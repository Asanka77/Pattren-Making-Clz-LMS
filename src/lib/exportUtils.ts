import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Registration } from '../types';

export function exportRegistrationsToExcel(registrations: Registration[], filenamePrefix = 'CeylonStyleStudio_Registrations') {
  const data = registrations.map((r, index) => ({
    '#': index + 1,
    'Reg Number': r.regNumber,
    'Full Name': r.fullName,
    'WhatsApp Number': r.whatsappNumber,
    'Email': r.email || '',
    'District': r.district,
    'City': r.city || '',
    'Age': r.age || '',
    'Course Type': r.courseType,
    'Location': r.location || (r.courseType === 'ZOOM CLASS' ? 'Online Zoom' : ''),
    'Qualification': r.educationalQualification,
    'Occupation': r.occupation || '',
    'Previous Course': r.previousPatternCourse,
    'Previous Course Details': r.previousCourseDetails || '',
    'Why Join': r.whyJoin || '',
    'Expected Achievements': r.expectedAchievements || '',
    'Preferred Contact Time': r.preferredContactTime || '',
    'Status': r.status,
    'Registration Date': r.createdAt ? new Date(r.createdAt).toLocaleString('en-GB') : '',
    'Admin Notes': r.adminNotes || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set column widths
  const colWidths = [
    { wch: 5 },  // #
    { wch: 16 }, // Reg Number
    { wch: 25 }, // Full Name
    { wch: 18 }, // WhatsApp
    { wch: 24 }, // Email
    { wch: 15 }, // District
    { wch: 15 }, // City
    { wch: 8 },  // Age
    { wch: 18 }, // Course Type
    { wch: 16 }, // Location
    { wch: 20 }, // Qualification
    { wch: 20 }, // Occupation
    { wch: 16 }, // Previous Course
    { wch: 30 }, // Previous Details
    { wch: 30 }, // Why Join
    { wch: 30 }, // Expectations
    { wch: 20 }, // Contact time
    { wch: 14 }, // Status
    { wch: 22 }, // Date
    { wch: 30 }, // Admin Notes
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `${filenamePrefix}_${dateStr}.xlsx`);
}

export function exportRegistrationsToCSV(registrations: Registration[], filenamePrefix = 'CeylonStyleStudio_Registrations') {
  const headers = [
    'Registration Number',
    'Full Name',
    'WhatsApp Number',
    'Email',
    'District',
    'Course Type',
    'Location',
    'Qualification',
    'Previous Course',
    'Status',
    'Registration Date',
    'Admin Notes',
  ];

  const rows = registrations.map((r) => [
    `"${r.regNumber}"`,
    `"${r.fullName.replace(/"/g, '""')}"`,
    `"${r.whatsappNumber}"`,
    `"${(r.email || '').replace(/"/g, '""')}"`,
    `"${r.district}"`,
    `"${r.courseType}"`,
    `"${r.location || ''}"`,
    `"${(r.educationalQualification || '').replace(/"/g, '""')}"`,
    `"${r.previousPatternCourse}"`,
    `"${r.status}"`,
    `"${r.createdAt || ''}"`,
    `"${(r.adminNotes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `${filenamePrefix}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportRegistrationsToPDF(registrations: Registration[], title = 'Student Registrations Report') {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Header background banner
  doc.setFillColor(20, 16, 17); // Dark luxury charcoal
  doc.rect(0, 0, 297, 30, 'F');

  // Gold accent line
  doc.setFillColor(201, 154, 69); // Warm Gold
  doc.rect(0, 30, 297, 1.5, 'F');

  // Title texts
  doc.setTextColor(247, 243, 235);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('CEYLON STYLE STUDIO', 14, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(201, 154, 69);
  doc.text('6-MONTH PROFESSIONAL FASHION & BRANDING PROGRAM', 14, 19);

  doc.setFontSize(8);
  doc.setTextColor(180, 170, 165);
  doc.text(`Generated on: ${new Date().toLocaleString('en-GB')} | Total Records: ${registrations.length}`, 14, 25);

  doc.setFontSize(11);
  doc.setTextColor(240, 230, 220);
  doc.text(title, 200, 18, { align: 'left' });

  // Table rows
  const tableData = registrations.map((r) => [
    r.regNumber,
    r.fullName,
    r.whatsappNumber,
    r.district,
    r.courseType === 'PHYSICAL CLASS' ? `Physical (${r.location || 'N/A'})` : 'Zoom Class',
    r.educationalQualification,
    r.previousPatternCourse,
    r.status,
    r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB') : '-',
  ]);

  autoTable(doc, {
    startY: 36,
    head: [[
      'Reg No',
      'Student Name',
      'WhatsApp',
      'District',
      'Class Mode',
      'Qualification',
      'Prior Exp',
      'Status',
      'Date',
    ]],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [40, 35, 30],
    },
    headStyles: {
      fillColor: [84, 13, 24], // Deep burgundy
      textColor: [247, 243, 235],
      fontStyle: 'bold',
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [250, 248, 245],
    },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: 'bold' },
      1: { cellWidth: 45 },
      2: { cellWidth: 30 },
      3: { cellWidth: 24 },
      4: { cellWidth: 40 },
      5: { cellWidth: 35 },
      6: { cellWidth: 18 },
      7: { cellWidth: 25 },
      8: { cellWidth: 25 },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer page numbers
      const str = `Page ${doc.getNumberOfPages()}`;
      doc.setFontSize(8);
      doc.setTextColor(130, 120, 115);
      doc.text(str, 280, 203, { align: 'right' });
      doc.text('CEYLON STYLE STUDIO - Confidential Academic Registry', 14, 203);
    },
  });

  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`CeylonStyleStudio_Report_${dateStr}.pdf`);
}

export function exportPaymentsToExcel(payments: any[], filenamePrefix = 'CeylonStyleStudio_Payments') {
  const data = payments.map((p, index) => ({
    '#': index + 1,
    'Reg Number': p.regNumber,
    'Student Name': p.studentName,
    'WhatsApp': p.whatsappNumber,
    'Payment Type': p.paymentType,
    'Amount (LKR)': p.amount,
    'Payment Date': p.paymentDate,
    'Bank': p.bankName,
    'Transaction Ref': p.transactionReference,
    'Status': p.status,
    'Admin Notes': p.adminNotes || '',
    'Submitted At': p.createdAt ? new Date(p.createdAt).toLocaleString('en-GB') : '',
    'Verified At': p.verifiedAt ? new Date(p.verifiedAt).toLocaleString('en-GB') : '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `${filenamePrefix}_${dateStr}.xlsx`);
}

export function exportPaymentsToCSV(payments: any[], filenamePrefix = 'CeylonStyleStudio_Payments') {
  const headers = ['Reg Number', 'Student Name', 'WhatsApp', 'Payment Type', 'Amount', 'Date', 'Bank', 'Ref', 'Status'];
  const rows = payments.map((p) => [
    `"${p.regNumber}"`,
    `"${p.studentName.replace(/"/g, '""')}"`,
    `"${p.whatsappNumber}"`,
    `"${p.paymentType}"`,
    p.amount,
    `"${p.paymentDate}"`,
    `"${p.bankName}"`,
    `"${p.transactionReference}"`,
    `"${p.status}"`,
  ]);
  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `${filenamePrefix}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
