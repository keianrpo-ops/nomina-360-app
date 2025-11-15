
import React from 'react';
import ReactDOM from 'react-dom/client';
import { PayrollCalculationResult, SettlementCalculationResult } from '../types';
import PayrollReceipt from '../components/pdf/PayrollReceipt';
import SettlementReceipt from '../components/pdf/SettlementReceipt';

declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}

const generatePdf = async (element: React.ReactElement, fileName: string) => {
    const { jsPDF } = window.jspdf;
    const container = document.getElementById('pdf-container');
    if (!container) return;

    // Temporarily render the component to capture it
    const root = ReactDOM.createRoot(container);
    root.render(element);
    
    // Allow component to render
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await window.html2canvas(container.children[0] as HTMLElement, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);

    // Cleanup
    root.unmount();
};

export const generatePayrollPdf = async (
    payrollData: PayrollCalculationResult,
    period: { from: string, to: string }
) => {
    const fileName = `Recibo_Nomina_${payrollData.employee.Nombres}_${payrollData.employee.Apellidos}_${period.from}.pdf`;
    // FIX: Replaced JSX with React.createElement because this is a .ts file, not a .tsx file.
    await generatePdf(React.createElement(PayrollReceipt, { data: payrollData, period }), fileName);
};

export const generateSettlementPdf = async (
    settlementData: SettlementCalculationResult
) => {
    const fileName = `Recibo_Liquidacion_${settlementData.employee.Nombres}_${settlementData.employee.Apellidos}_${settlementData.employee.Fecha_Retiro}.pdf`;
    // FIX: Replaced JSX with React.createElement because this is a .ts file, not a .tsx file.
    await generatePdf(React.createElement(SettlementReceipt, { data: settlementData }), fileName);
};