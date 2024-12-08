import { View, Text, TextInput, Button, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import * as ScreenOrientation from 'expo-screen-orientation';
import DashBoardStyles from '../styles/DashBoardStyles';
import axios from 'axios';
import { BASE_URL } from '../config/config';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashBoard({ navigation, route }) {
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingPieces, setLoadingPieces] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [error, setError] = useState(null);
  const [ocrText, setOcrText] = useState('');

  useEffect(() => {
    const enableOrientation = async () => {
      await ScreenOrientation.unlockAsync();
    };
    enableOrientation();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  // Este efecto era para ocrText, lo puedes dejar si en algún momento recibes ocrText
  // directamente como parámetro en lugar de ocrResult.
  useEffect(() => {
    if (route.params?.ocrText) {
      setOcrText(route.params.ocrText);
      console.log('Tipo de ocrText:', typeof route.params.ocrText);
    }
  }, [route.params?.ocrText]);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/jobs/test_job`);
      console.log('Jobs data:', response.data);
      setJobs(response.data);
    } catch (err) {
      setError('Error al cargar los trabajos disponibles.');
      console.error(err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchPieces = async (jobId) => {
    setLoadingPieces(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/object/data/${jobId}`);
      setPieces(response.data);
    } catch (err) {
      setError('Error al cargar las piezas del trabajo seleccionado.');
      console.error(err);
    } finally {
      setLoadingPieces(false);
    }
  };

  const handleJobSelection = (jobId) => {
    setSelectedJob(jobId);
    fetchPieces(jobId);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView 
        style={DashBoardStyles.container} 
        contentContainerStyle={DashBoardStyles.contentContainer}
      >
        <View>
          <Image
            source={require('../assets/grupo_arga_cover.jpg')}
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: 4.5,  
              resizeMode: 'cover',
            }}
          />
        </View>

        <View style={DashBoardStyles.header}>
          <View style={{
            backgroundColor: '#2196F3',
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 5,
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 5
          }}>
            <Text style={[DashBoardStyles.title, { color: '#fff', textAlign: 'center' }]}>
              INVENTORY CONTROL SYSTEM
            </Text>
          </View>
          
          <Text style={DashBoardStyles.subtitle}>
            INNOVATION AND TECHNOLOGY - Scanning and Control of Materials
          </Text>
        </View>

        <View style={DashBoardStyles.jobSelectorContainer}>
          <Text style={DashBoardStyles.label}>Select a Job:</Text>
          {loadingJobs ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Picker
              selectedValue={selectedJob}
              onValueChange={(itemValue) => handleJobSelection(itemValue)}
              style={DashBoardStyles.picker}
            >
              <Picker.Item key="default" label="Choose a Job" value={null} />
              {jobs.map((job, index) => (
                <Picker.Item
                key={job.id || `job-${index}`}
                label={job.name || `Job ${index + 1}`}
                value={job.id || index}
                />
              ))}
            </Picker>
          )}
        </View>

        {/* Campo de texto para el OCR */}
        <View style={{ marginVertical: 10, paddingHorizontal: 16 }}>
          <Text style={{ marginBottom: 5 }}>OCR Text:</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              padding: 10,
              minHeight: 100,
              textAlignVertical: 'top',
            }}
            multiline
            value={ocrText}
            onChangeText={setOcrText}
            placeholder="Aquí se mostrará el texto leído por OCR, puedes editarlo..."
          />
        </View>

        <View style={DashBoardStyles.buttonContainer}>
          <Button title="Scan with Camera" onPress={() => navigation.navigate('TakePhoto')} />
        </View>

        <View style={DashBoardStyles.console}>
          <Text style={DashBoardStyles.consoleTitle}>Console Messages</Text>
          <View style={DashBoardStyles.consoleBox}>
            {error && <Text style={DashBoardStyles.errorText}>{error}</Text>}
          </View>
        </View>

        {loadingPieces && <ActivityIndicator size="large" color="#0000ff" />}

        {selectedJob && !loadingPieces && (
          <View style={DashBoardStyles.sectionContainer}>
            {['CUTTING', 'MACHINING', 'WAREHOUSE', 'BENT'].map((section) => (
              <View key={section} style={DashBoardStyles.section}>
                <Text style={DashBoardStyles.sectionTitle}>{section}</Text>
                <View style={DashBoardStyles.sectionContent}>
                  <View style={[DashBoardStyles.sectionColumn, DashBoardStyles.unscannedItems]}>
                    <Text style={DashBoardStyles.sectionLabel}>UNSCANNED ITEMS</Text>
                    <View style={DashBoardStyles.table}>
                      {pieces
                        .filter((piece) => piece.section === section && !piece.scanned)
                        .map((item, index) => (
                          <Text key={index} style={DashBoardStyles.tableRow}>
                            {item.name}
                          </Text>
                        ))}
                    </View>
                  </View>
                  <View style={[DashBoardStyles.sectionColumn, DashBoardStyles.scannedItems]}>
                    <Text style={DashBoardStyles.sectionLabel}>SCANNED ITEMS</Text>
                    <View style={DashBoardStyles.table}>
                      {pieces
                        .filter((piece) => piece.section === section && piece.scanned)
                        .map((item, index) => (
                          <Text key={index} style={DashBoardStyles.tableRow}>
                            {item.name}
                          </Text>
                        ))}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
