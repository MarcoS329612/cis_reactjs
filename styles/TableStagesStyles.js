// styles/TableStagesStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    margin: 10,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  stageContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
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
    textAlign: 'center'
  },
  tableRow: {
    flexDirection: 'row',
    marginVertical: 3,
    borderRadius: 5,
  },
  tableRowRed: {
    backgroundColor: '#ffcccc', // rojo suave si pending > 0
  },
  tableRowGreen: {
    backgroundColor: '#ccffcc', // verde suave si pending = 0
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 5,
  },
});
