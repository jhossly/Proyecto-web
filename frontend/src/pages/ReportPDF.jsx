import { Page, Text, View, Document,Image } from '@react-pdf/renderer';
import { styles } from './pdfStyles';
import logo from '../assets/logo.png';
export default function ReportPDF({ data, desde, hasta }) {
  const { kpis, porProducto } = data;

  // Formatea las fechas
  const formatoFecha = (fecha) => {
    if (!fecha) return 'todo el período';
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  };

  // Formato de moneda
  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(valor);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <View style={styles.companyHeader}>
            
            <Text style={styles.companyName}>El Golosito</Text>
            
            <Text style={styles.companyContact}>vivereselgolosito@gmail.com</Text>
            <Text style={styles.companyContact}>0992846413</Text>
            
      
          </View>
          
          <View style={styles.reportHeader}>
            <Text style={styles.reportTitle}>REPORTE DE VENTAS</Text><br />
            <Text style={styles.infoLabel}>Fecha de emisión:</Text>
            <Text style={styles.infoValue}>
              {new Date().toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}
            </Text><br />
            <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>N° de Reporte:</Text>
            <Text style={styles.infoValue}>REP-{new Date().getTime()}</Text>
          </View>
          </View>
        </View>

        {/* Información del reporte */}
        
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Período:</Text>
            <Text style={styles.infoValue}>
              {formatoFecha(desde)} - {formatoFecha(hasta)}
            </Text>
          </View>
        

        

        {/* Tabla de productos */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.productHeader]}>Producto</Text>
            <Text style={[styles.tableCell, styles.quantityHeader]}>Cantidad</Text>
            <Text style={[styles.tableCell, styles.priceHeader]}>P. Unitario</Text>
            <Text style={[styles.tableCell, styles.totalHeader]}>Total</Text>
          </View>
          
          {porProducto.map((producto, index) => (
            <View 
              key={producto._id} 
              style={[
                styles.tableRow,
                index % 2 === 0 && styles.evenRow
              ]}
            >
              <Text style={[styles.tableCell, styles.productCell]}>{producto._id}</Text>
              <Text style={[styles.tableCell, styles.quantityCell]}>{producto.unidades}</Text>
              <Text style={[styles.tableCell, styles.priceCell]}>
                {formatoMoneda(producto.ingresos / producto.unidades)}
              </Text>
              <Text style={[styles.tableCell, styles.totalCell]}>
                {formatoMoneda(producto.ingresos)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totales */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>SUBTOTAL:</Text>
            <Text style={styles.totalValue}>{formatoMoneda(kpis.totalVentas)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL:</Text>
            <Text style={styles.grandTotal}>{formatoMoneda(kpis.totalVentas)}</Text>
          </View>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text style={styles.barcode}>REP-{new Date().getTime()}</Text>
          <Text style={styles.footerText}> © Todos los derechos reservados EL Golosito</Text>
          <Text style={styles.footerText}>Chambo-Riobamba</Text>
          
        </View>
      </Page>
    </Document>
  );
}