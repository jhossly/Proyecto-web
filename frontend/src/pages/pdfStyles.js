import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  // Diseño general
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333',
  },
  
  // Encabezado
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: '2px solid #FF6B35',
    paddingBottom: 15,
  },
  companyHeader: {
    width: '50%',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  companyContact: {
    fontSize: 10,
    marginBottom: 2,
    color: '#555',
  },
  companyAddress: {
    fontSize: 10,
    color: '#555',
    marginTop: 5,
  },
  reportHeader: {
    width: '45%',
    alignItems: 'flex-end',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004E89',
    textTransform: 'uppercase',
  },
  reportSubtitle: {
    fontSize: 10,
    color: '#666',
    marginTop: 3,
  },

  // Información del reporte
  reportInfo: {
    flexDirection: 'row',
    
  },
  
  infoLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#555',

    
  },
  infoValue: {
    fontSize: 10,
  },

  // Resumen de KPIs
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    width: '30%',
    backgroundColor: '#F7F9FC',
    padding: 10,
    borderRadius: 5,
    border: '1px solid #E0E0E0',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#004E89',
  },

  // Tabla
  tableContainer: {
    marginTop: 10,
    border: '1px solid #E0E0E0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#004E89',
    color: 'white',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #E0E0E0',
    minHeight: 25,
    alignItems: 'center',
  },
  evenRow: {
    backgroundColor: '#FAFAFA',
  },
  tableCell: {
    padding: 8,
  },
  // Encabezados de columna
  productHeader: {
    width: '50%',
  },
  quantityHeader: {
    width: '15%',
    textAlign: 'center',
  },
  priceHeader: {
    width: '20%',
    textAlign: 'right',
  },
  totalHeader: {
    width: '15%',
    textAlign: 'right',
  },
  // Celdas de datos
  productCell: {
    width: '50%',
  },
  quantityCell: {
    width: '15%',
    textAlign: 'center',
  },
  priceCell: {
    width: '20%',
    textAlign: 'right',
  },
  totalCell: {
    width: '15%',
    textAlign: 'right',
  },

  // Totales
  totalsContainer: {
    marginTop: 10,
    width: '30%',
    marginLeft: 'auto',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingVertical: 5,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalValue: {
    fontWeight: 'bold',
  },
  grandTotal: {
    fontWeight: 'bold',
    fontSize: 12,
    color: 'bold',
  },

  // Pie de página
  footer: {
    marginTop: 30,
    alignItems: 'center',
    borderTop: '1px solid #E0E0E0',
    paddingTop: 15,
  },
  barcode: {
    fontFamily: 'Courier',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 5,
  },
  footerText: {
    fontSize: 10,
    color: '#777',
    fontStyle: 'italic',
  },
  logo: {
  width: 80,
  height: 70,
  marginBottom: 10,
}
});