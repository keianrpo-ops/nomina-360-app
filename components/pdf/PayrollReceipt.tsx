import React from 'react';
import { PayrollCalculationResult } from '../../types';
import { formatCurrency, COMPANY_INFO } from '../../constants';
import macawLogo from '../../assets/macaw-logo-3d.png';

interface PayrollReceiptProps {
  data: PayrollCalculationResult;
  period: { from: string; to: string };
}

// Logo EcoParadise
const CompanyLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
    <img
      src={macawLogo}
      alt={COMPANY_INFO.name}
      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
    />
    <span style={{ fontWeight: 'bold', color: '#2D3748', fontSize: '16px' }}>
      {COMPANY_INFO.name}
    </span>
  </div>
);

const PayrollReceipt: React.FC<PayrollReceiptProps> = ({ data, period }) => {
  const { employee } = data;
  const totalDevengado =
    data.devengadoSalario + data.devengadoAuxilio + data.devengadoOtros;
  const totalDeducido =
    data.deduccionSalud +
    data.deduccionPension +
    data.deduccionFSP +
    data.deduccionOtros;
  const porcentajeDeducido =
    totalDevengado > 0
      ? ((totalDeducido / totalDevengado) * 100).toFixed(2) + '%'
      : '0.00%';

  const InfoRow: React.FC<{ label: string; value: string | number }> = ({
    label,
    value,
  }) => (
    <div>
      <p
        style={{
          margin: '0 0 2px 0',
          fontSize: '11px',
          color: '#718096',
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: '13px',
          color: '#2D3748',
          fontWeight: 500,
        }}
      >
        {value}
      </p>
    </div>
  );

  const SummaryBox: React.FC<{ title: string; value: string; color: string }> = ({
    title,
    value,
    color,
  }) => (
    <div
      style={{
        flex: 1,
        border: `1px solid ${color}`,
        borderRadius: '6px',
        backgroundColor: '#FFFFFF',
        boxShadow:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }}
    >
      <div
        style={{
          padding: '8px',
          backgroundColor: color,
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '11px',
            color: '#4A5568',
            textAlign: 'center',
          }}
        >
          {title}
        </p>
      </div>
      <div style={{ padding: '12px' }}>
        <p
          style={{
            margin: 0,
            fontSize: '18px',
            color: '#2D3748',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );

  const DetailTable: React.FC<{
    title: string;
    titleBg: string;
    titleColor: string;
    items: { label: string; value: number }[];
    totalLabel: string;
    totalValue: number;
  }> = ({ title, titleBg, titleColor, items, totalLabel, totalValue }) => (
    <div
      style={{
        flex: 1,
        borderRadius: '6px',
        border: `1px solid ${
          titleBg === '#2C5282' ? titleBg : '#DDDDDD'
        }`,
      }}
    >
      <div
        style={{
          backgroundColor: titleBg,
          padding: '10px 12px',
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 'bold',
            color: titleColor,
          }}
        >
          {title}
        </h3>
      </div>
      <div
        style={{
          padding: '8px 12px',
          backgroundColor: 'white',
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
              fontSize: '12px',
            }}
          >
            <span style={{ color: '#4A5568' }}>{item.label}</span>
            <span style={{ color: '#2D3748' }}>
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
        <div
          style={{
            borderTop: '1px solid #E2E8F0',
            marginTop: '8px',
            paddingTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '13px',
            fontWeight: 'bold',
          }}
        >
          <span style={{ color: '#2D3748' }}>{totalLabel}</span>
          <span style={{ color: '#2D3748' }}>
            {formatCurrency(totalValue)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: '210mm',
        minHeight: '297mm',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        color: '#111827',
        backgroundColor: '#F7FAFC',
        padding: '25px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
        }}
      >
        {/* HEADER */}
        <header>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: '15px',
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '28px',
                  color: '#2C5282',
                  fontWeight: 'bold',
                }}
              >
                Recibo de Pago de Nómina
              </h1>
              <p
                style={{
                  margin: '5px 0 0',
                  color: '#718096',
                }}
              >
                Periodo: {period.from} al {period.to}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <CompanyLogo />
              <p
                style={{
                  margin: '5px 0 0',
                  fontSize: '10px',
                  color: '#A0AEC0',
                }}
              >
                {COMPANY_INFO.name} | NIT: {COMPANY_INFO.nit}
              </p>
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: '10px',
                  color: '#A0AEC0',
                }}
              >
                {COMPANY_INFO.address}
              </p>
            </div>
          </div>
          <hr
            style={{
              border: 'none',
              borderTop: '1px solid #E2E8F0',
            }}
          />
        </header>

        {/* EMPLOYEE INFO */}
        <section style={{ marginTop: '20px' }}>
          <h2
            style={{
              fontSize: '14px',
              color: '#2C5282',
              paddingBottom: '8px',
              marginBottom: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            Información del Empleado
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px 24px',
            }}
          >
            <InfoRow
              label="Nombre Completo"
              value={`${employee.Nombres} ${employee.Apellidos}`}
            />
            <InfoRow
              label="Fecha de Ingreso"
              value={employee.Fecha_Ingreso}
            />
            <InfoRow
              label="Cédula de Ciudadanía"
              value={employee.Cedula}
            />
            <InfoRow
              label="Tipo de Contrato"
              value={employee.Tipo_Contrato}
            />
            <InfoRow label="Cargo" value={employee.Cargo} />
            <InfoRow
              label="Salario Base Mensual"
              value={formatCurrency(employee.Salario_Base)}
            />
          </div>
        </section>

        {/* SUMMARY BOXES */}
        <section
          style={{
            marginTop: '25px',
            display: 'flex',
            gap: '20px',
          }}
        >
          <SummaryBox
            title="Días Laborados"
            value={`${data.diasLaborados} DÍAS`}
            color="#E6FFFA"
          />
          <SummaryBox
            title="Base de Cotización (IBC)"
            value={formatCurrency(data.baseIBC)}
            color="#EBF8FF"
          />
          <SummaryBox
            title="Porcentaje Deducido"
            value={porcentajeDeducido}
            color="#FFF5EB"
          />
        </section>

        {/* EARNINGS & DEDUCTIONS */}
        <section
          style={{
            marginTop: '25px',
            display: 'flex',
            gap: '20px',
          }}
        >
          <DetailTable
            title="Conceptos Devengados"
            titleBg="#C6F6D5"
            titleColor="#22543D"
            items={[
              {
                label: `Salario (${data.diasLaborados} días)`,
                value: data.devengadoSalario,
              },
              {
                label: 'Auxilio de Transporte',
                value: data.devengadoAuxilio,
              },
              {
                label: 'Otros Devengados',
                value: data.devengadoOtros,
              },
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
              {
                label: 'Aporte a Pensión (4%)',
                value: data.deduccionPension,
              },
              {
                label: 'Fondo Solidaridad Pensional',
                value: data.deduccionFSP,
              },
              {
                label: 'Otras Deducciones',
                value: data.deduccionOtros,
              },
            ]}
            totalLabel="Total Deducido"
            totalValue={totalDeducido}
          />
        </section>

        {/* NET PAY */}
        <section
          style={{
            marginTop: '30px',
            backgroundColor: '#2C5282',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Neto a Pagar
          </p>
          <p
            style={{
              margin: '5px 0 0',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            {formatCurrency(data.netoPagar)}
          </p>
        </section>

        <div style={{ flexGrow: 1 }} />

        {/* FOOTER LEGAL + FIRMAS */}
        <footer style={{ marginTop: '25px' }}>
          <p
            style={{
              fontSize: '10px',
              color: '#4A5568',
              margin: '0 0 12px 0',
              textAlign: 'justify',
            }}
          >
            El(la) trabajador(a) declara que el valor neto relacionado en
            el presente recibo corresponde a los pagos efectuados por
            concepto de salario y demás emolumentos derivados del contrato
            de trabajo durante el período indicado, y que recibe dichas
            sumas a entera satisfacción. Salvo las reservas de ley, el
            trabajador manifiesta encontrarse a paz y salvo por los
            conceptos aquí liquidados.
          </p>
          <p
            style={{
              fontSize: '9px',
              color: '#A0AEC0',
              margin: '0 0 20px 0',
              textAlign: 'center',
            }}
          >
            Documento generado automáticamente por el sistema de nómina.
            Para cualquier consulta: Valor Neto = Total Devengado (
            {formatCurrency(totalDevengado)}) - Total Deducido (
            {formatCurrency(totalDeducido)}).
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-end',
              paddingTop: '10px',
              borderTop: '1px solid #E2E8F0',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                fontSize: '12px',
                color: '#4A5568',
              }}
            >
              <div
                style={{
                  borderBottom: '1px solid #718096',
                  height: '40px',
                  width: '250px',
                  marginBottom: '8px',
                }}
              ></div>
              <p style={{ margin: 0 }}>Firma Empleado</p>
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: '10px',
                }}
              >
                C.C. {employee.Cedula}
              </p>
            </div>
            <div
              style={{
                textAlign: 'center',
                fontSize: '12px',
                color: '#4A5568',
              }}
            >
              <div
                style={{
                  borderBottom: '1px solid #718096',
                  height: '40px',
                  width: '250px',
                  marginBottom: '8px',
                }}
              ></div>
              <p style={{ margin: 0 }}>Firma Empleador</p>
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: '10px',
                }}
              >
                {COMPANY_INFO.name}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PayrollReceipt;
