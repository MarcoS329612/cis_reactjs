import { StyleSheet } from 'react-native';

const DashBoardStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 1,
  },
  contentContainer: {
    paddingBottom: 10,
  },
  coverImage: {
    width: '100%',
    height: undefined, // Para respetar aspectRatio
    aspectRatio: 15,
    resizeMode: 'cover',
  },
  header: {
    alignItems: 'center',
    marginBottom: 2,
    marginTop: 0,
  },
  headerBackground: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 100,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 2,
    marginBottom: 0,
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerTitleWhite: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'center',
    marginTop: 2,
  },
  jobSelectorContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
  },
  picker: {
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 1,
    width: 200,
    height: 'auto',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  ocrContainer: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  ocrLabel: {
    marginBottom: 5,
  },
  ocrInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    minHeight: 50,
    marginRight: 5,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  console: {
    marginTop: 10,
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
    marginTop: 2,
    padding: 5,
  },
  errorText: {
    color: 'red',
  },
  activityIndicator: {
    color: '#0000ff',
  },
  tableScroll: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 5,
    marginTop: 5,
  },  
});

export default DashBoardStyles;
