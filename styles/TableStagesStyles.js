// styles/TableStagesStyles.js
import { StyleSheet } from 'react-native';

const TableStagesStyles = StyleSheet.create({
  sectionContainer: {
    marginTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 10,
  },
  sectionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  unscannedItems: {
    borderWidth: 2,
    borderColor: '#ff0000', // Rojo
    borderRadius: 5,
    padding: 5,
  },
  scannedItems: {
    borderWidth: 2,
    borderColor: '#00ff00', // Verde
    borderRadius: 5,
    padding: 5,
  },
  sectionLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 120,
    backgroundColor: '#fff',
    padding: 5,
  },
  tableRow: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
  },
});

export default TableStagesStyles;
