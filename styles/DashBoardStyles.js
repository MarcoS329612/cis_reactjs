import { StyleSheet } from 'react-native';

export const DashBoardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 10,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    flex: 1,
    marginRight: 10,
  },
  consoleBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 80,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  consoleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
  },
});

export default DashBoardStyles;
