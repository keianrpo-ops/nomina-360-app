import React from 'react';
import { PayrollCalculationResult } from '../../types';
import { formatCurrency } from '../../constants';

interface PayrollReceiptProps {
  data: PayrollCalculationResult;
  period: { from: string; to: string };
}

// A simple, professional-looking placeholder SVG logo.
const CompanyLogo = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
        <div style={{ width: '40px', height: '40px', backgroundColor: '#4A5568', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{ width: '20px', height: '20px', backgroundColor: '#E2E8F0'}}></div>
        </div>
        <span style={{ fontWeight: 'bold', color: '#2D3748', fontSize: '16px' }}>EMPRESA</span>
    </div>
);

const PayrollReceipt: React.FC<PayrollReceiptProps> = ({ data, period }) => {
  const { employee } = data;
  const totalDevengado = data.devengadoSalario + data.devengadoAuxilio + data.devengadoOtros;
  const totalDeducido = data.deduccionSalud + data.deduccionPension + data.deduccionFSP + data.deduccionOtros;
  const porcentajeDeducido = totalDevengado > 0 ? ((totalDeducido / totalDevengado) * 100).toFixed(2) + '%' : '0.00%';

  const InfoRow: React.FC<{ label: string; value: string | number; }> = ({ label, value}) => (
    <div>
      <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: '#718096' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '13px', color: '#2D3748', fontWeight: '500' }}>{value}</p>
    </div>
  );
  
  const SummaryBox: React.FC<{ title: string; value: string; color: string; }> = ({ title, value, color }) => (
    <div style={{ flex: 1, border: `1px solid ${color}`, borderRadius: '6px', backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
        <div style={{ padding: '8px', backgroundColor: color, borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#4A5568', textAlign: 'center' }}>{title}</p>
        </div>
        <div style={{ padding: '12px' }}>
            <p style={{ margin: 0, fontSize: '18px', color: '#2D3748', fontWeight: 'bold', textAlign: 'center' }}>{value}</p>
        </div>
    </div>
  );

  const DetailTable: React.FC<{title: string; titleBg: string; titleColor: string; items: {label: string; value: number}[]; totalLabel: string; totalValue: number}> = ({title, titleBg, titleColor, items, totalLabel, totalValue}) => (
      <div style={{flex: 1, borderRadius: '6px', border: `1px solid ${titleBg === '#2C5282' ? titleBg : '#DDDDDD'}`}}>
          <div style={{backgroundColor: titleBg, padding: '10px 12px', borderTopLeftRadius: '5px', borderTopRightRadius: '5px'}}>
              <h3 style={{margin: 0, fontSize: '14px', fontWeight: 'bold', color: titleColor}}>{title}</h3>
          </div>
          <div style={{padding: '8px 12px', backgroundColor: 'white', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px'}}>
              {items.map((item, index) => (
                  <div key={index} style={{display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12px'}}>
                      <span style={{color: '#4A5568'}}>{item.label}</span>
                      <span style={{color: '#2D3748'}}>{formatCurrency(item.value)}</span>
                  </div>
              ))}
              <div style={{borderTop: '1px solid #E2E8F0', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold'}}>
                  <span style={{color: '#2D3748'}}>{totalLabel}</span>
                  <span style={{color: '#2D3748'}}>{formatCurrency(totalValue)}</span>
              </div>
          </div>
      </div>
  );


  return (
    <div style={{
      width: '210mm',
      minHeight: '297mm',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      color: '#111827',
      backgroundColor: '#F7FAFC',
      padding: '25px',
      boxSizing: 'border-box'
    }}>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}}>

        {/* HEADER */}
        <header>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '15px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '28px', color: '#2C5282', fontWeight: 'bold' }}>Recibo de Pago de Nómina</h1>
                <p style={{ margin: '5px 0 0', color: '#718096' }}>Periodo: {period.from} al {period.to}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                  <CompanyLogo />
                  <p style={{ margin: '5px 0 0', fontSize: '10px', color: '#A0AEC0' }}>Empresa S.A.S | NIT: 900.123.456</p>
                  <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#A0AEC0' }}>Calle Falsa 123, Bogotá, Colombia</p>
              </div>
            </div>
            <hr style={{border: 'none', borderTop: '1px solid #E2E8F0'}} />
        </header>

        {/* EMPLOYEE INFO */}
        <section style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '14px', color: '#2C5282', paddingBottom: '8px', marginBottom: '12px', fontWeight: 'bold', textTransform: 'uppercase'}}>
            Información del Empleado
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 24px' }}>
              <InfoRow label="Nombre Completo" value={`${employee.Nombres} ${employee.Apellidos}`} />
              <InfoRow label="Fecha de Ingreso" value={employee.Fecha_Ingreso} />
              <InfoRow label="Cédula de Ciudadanía" value={employee.Cedula} />
              <InfoRow label="Tipo de Contrato" value={employee.Tipo_Contrato} />
              <InfoRow label="Cargo" value={employee.Cargo} />
              <InfoRow label="Salario Base Mensual" value={formatCurrency(employee.Salario_Base)} />
          </div>
        </section>
        
        {/* SUMMARY BOXES */}
        <section style={{ marginTop: '25px', display: 'flex', gap: '20px' }}>
          <SummaryBox title="Días Laborados" value={`${data.diasLaborados} DÍAS`} color="#E6FFFA" />
          <SummaryBox title="Base de Cotización (IBC)" value={formatCurrency(data.baseIBC)} color="#EBF8FF" />
          <SummaryBox title="Porcentaje Deducido" value={porcentajeDeducido} color="#FFF5EB" />
        </section>

        {/* EARNINGS & DEDUCTIONS */}
        <section style={{ marginTop: '25px', display: 'flex', gap: '20px' }}>
            <DetailTable 
                title="Conceptos Devengados"
                titleBg="#C6F6D5"
                titleColor="#22543D"
                items={[
                    { label: `Salario (${data.diasLaborados} días)`, value: data.devengadoSalario },
                    { label: 'Auxilio de Transporte', value: data.devengadoAuxilio },
                    { label: 'Otros Devengados', value: data.devengadoOtros }
                ]}
                totalLabel="Total Devengado"
                totalValue={totalDevengado}
            />
            <DetailTable 
                title="Conceptos Deducidos"
                titleBg="#2C5282"
                titleColor="white"
                items={[
                    { label: 'Aporte a Salud (4%)', value: data.deduccionSalud },
                    { label: 'Aporte a Pensión (4%)', value: data.deduccionPension },
                    { label: 'Fondo Solidaridad Pensional', value: data.deduccionFSP },
                    { label: 'Otras Deducciones', value: data.deduccionOtros }
                ]}
                totalLabel="Total Deducido"
                totalValue={totalDeducido}
            />
        </section>

        {/* NET PAY */}
        <section style={{ marginTop: '30px', backgroundColor: '#2C5282', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Neto a Pagar</p>
          <p style={{ margin: '5px 0 0', fontSize: '32px', fontWeight: 'bold' }}>{formatCurrency(data.netoPagar)}</p>
        </section>
        
         {/* FOOTER NOTE */}
        <footer style={{ marginTop: '20px', textAlign: 'center', fontSize: '10px', color: '#A0AEC0' }}>
            <p style={{margin: 0}}>Documento generado automáticamente por sistema de nómina. Para cualquier consulta: Valor Neto = Total Devengado ({formatCurrency(totalDevengado)}) - Total Deducido ({formatCurrency(totalDeducido)}) - contacte a RRHH.</p>
        </footer>

      </div>
    </div>
  );
};

export default PayrollReceipt;
