import { StyleSheet } from 'react-native';

const DashBoardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 10,
  },
  contentContainer: {
    // Estos estilos son opcionales, puedes agregar lo que necesites:
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0056b3',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  // Si usas un jobSelectorContainer
  jobSelectorContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  console: {
    marginTop: 20,
  },
  consoleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  consoleBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 80,
    backgroundColor: '#fff',
    marginTop: 5,
    padding: 5,
  },
  errorText: {
    color: 'red',
  },
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

export default DashBoardStyles;
