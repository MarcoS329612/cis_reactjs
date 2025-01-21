// styles/TableStagesStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stageContainer: {
    width: '48%',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },

  // Cabecera de la "tarjeta" de cada stage:
  // pone Título y el botón en la misma fila
  stageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,  
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // TextInput para filtrar
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 8,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  tableScroll: {
    maxHeight: 150,
  },
  tableContent: {
    flexDirection: 'column',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    marginVertical: 3,
    borderRadius: 5,
  },
  tableRowGreen: {
    backgroundColor: '#ccffcc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 5,
  },
});
