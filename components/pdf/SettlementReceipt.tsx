import React from 'react';
import { SettlementCalculationResult } from '../../types';
import { formatCurrency, COMPANY_INFO } from '../../constants';
import macawLogo from './src/assets/macaw-logo-3d.png';

interface SettlementReceiptProps {
  data: SettlementCalculationResult;
}

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

const SettlementReceipt: React.FC<SettlementReceiptProps> = ({ data }) => {
  const { employee } = data;
  const subtotalLiquidacion =
    data.cesantias + data.interesesCesantias + data.prima + data.vacaciones;

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
            <span
              style={{
                color: item.value >= 0 ? '#2D3748' : '#E53E3E',
              }}
            >
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
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
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
                Recibo de Liquidación
              </h1>
              <p
                style={{
                  margin: '5px 0 0',
                  color: '#718096',
                }}
              >
                Terminación de Contrato
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
              label="Cédula de Ciudadanía"
              value={employee.Cedula}
            />
            <InfoRow label="Cargo" value={employee.Cargo} />
            <InfoRow
              label="Salario Base Mensual"
              value={formatCurrency(employee.Salario_Base)}
            />
            <InfoRow
              label="Fecha de Ingreso"
              value={employee.Fecha_Ingreso}
            />
            <InfoRow
              label="Fecha de Retiro"
              value={data.fechaRetiro}
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
            title="Días de Antigüedad"
            value={`${data.diasAntiguedad} DÍAS`}
            color="#EBF8FF"
          />
          <SummaryBox
            title="Salario Base (Prestaciones)"
            value={formatCurrency(data.salarioBasePromedio)}
            color="#E6FFFA"
          />
        </section>

        {/* LIQ + AJUSTES */}
        <section
          style={{
            marginTop: '25px',
            display: 'flex',
            gap: '20px',
          }}
        >
          <DetailTable
            title="Conceptos de Liquidación"
            titleBg="#C6F6D5"
            titleColor="#22543D"
            items={[
              { label: 'Cesantías', value: data.cesantias },
              {
                label: 'Intereses sobre Cesantías',
                value: data.interesesCesantias,
              },
              { label: 'Prima de Servicios', value: data.prima },
              { label: 'Vacaciones', value: data.vacaciones },
            ]}
            totalLabel="Subtotal Liquidación"
            totalValue={subtotalLiquidacion}
          />
          <DetailTable
            title="Ajustes Finales"
            titleBg="#BEE3F8"
            titleColor="#2A4365"
            items={[
              {
                label: 'Otros Conceptos (Bonos, etc.)',
                value: data.otrosConceptos,
              },
              {
                label: 'Deducciones (Préstamos, etc.)',
                value: -data.deducciones,
              },
            ]}
            totalLabel="Total Ajustes"
            totalValue={data.otrosConceptos - data.deducciones}
          />
        </section>

        {/* NETO LIQUIDACIÓN */}
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
            Total Liquidación a Pagar
          </p>
          <p
            style={{
              margin: '5px 0 0',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            {formatCurrency(data.totalLiquidacion)}
          </p>
        </section>

        <div style={{ flexGrow: 1 }} />

        {/* FOOTER LEGAL + FIRMAS */}
        <footer style={{ marginTop: '20px' }}>
          <p
            style={{
              fontSize: '10px',
              color: '#4A5568',
              margin: '0 0 6px 0',
              textAlign: 'justify',
            }}
          >
            SE HACE CONSTAR:
          </p>
          <p
            style={{
              fontSize: '10px',
              color: '#4A5568',
              margin: '0 0 4px 0',
              textAlign: 'justify',
            }}
          >
            1. Que el empleador ha incorporado en la presente liquidación
            los importes correspondientes a salarios, horas extras,
            descansos compensatorios, cesantías, vacaciones, prima de
            servicios, auxilio de transporte y, en general, todo concepto
            relacionado con salarios, prestaciones o indemnizaciones
            causadas al quedar extinguido el contrato de trabajo.
          </p>
          <p
            style={{
              fontSize: '10px',
              color: '#4A5568',
              margin: '0 0 10px 0',
              textAlign: 'justify',
            }}
          >
            2. Que con el pago del dinero anotado en la presente
            liquidación quedan transadas cualesquiera diferencias
            relativas al contrato de trabajo extinguido o a situaciones
            anteriores. En consecuencia, la presente liquidación tiene
            efecto de finiquito respecto de las obligaciones laborales que
            existieron entre el empleador y el trabajador, quienes
            declaran estar a paz y salvo por todo concepto aquí
            relacionado.
          </p>
          <p
            style={{
              textAlign: 'center',
              fontSize: '9px',
              color: '#A0AEC0',
              margin: '0 0 18px 0',
            }}
          >
            Documento generado automáticamente. Los cálculos son
            referenciales y deben ser validados según la normativa vigente
            y las políticas internas de la empresa.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-end',
              paddingTop: '20px',
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

export default SettlementReceipt;
