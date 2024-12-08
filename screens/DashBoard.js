// DashBoard.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ScreenOrientation from 'expo-screen-orientation';
import DashBoardStyles from '../styles/DashBoardStyles';
import axios from 'axios';
import { BASE_URL } from '../config/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import TableStages from '../screens/TableStages';

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

  useEffect(() => {
    if (route.params?.ocrText) {
      setOcrText(route.params.ocrText);
    }
  }, [route.params?.ocrText]);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/jobs/list`);
      console.log('Jobs data:', response.data);

      // Transforma los datos para el Picker
      const transformedJobs = response.data.map((job) => ({
        label: job.job_code,
        value: job.job_code,
      }));

      setJobs(transformedJobs);
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
      // Aquí utilizamos jobId directamente en la URL
      const response = await axios.get(`${BASE_URL}/jobs/${jobId}/status`);
      const data = response.data;
  
      // Filtrar y mapear stages para excluir "Initialized" y preparar las tablas
      const formattedStages = data.stages
        .filter((stage) => stage.stage_name !== "Initialized") // Ignorar "Initialized"
        .map((stage) => ({
          stageName: stage.stage_name, // Nombre de la etapa
          items: stage.items.map((item) => ({
            itemName: item.item_name, // Nombre del item
            totalQuantity: item.completed + item.pending, // Cantidad total
          })),
        }));
  
      setPieces(formattedStages);
    } catch (err) {
      setError('Error al cargar las piezas del trabajo seleccionado.');
      console.error(err);
    } finally {
      setLoadingPieces(false);
    }
  };

  const handleJobSelection = (jobId) => {
    setSelectedJob(jobId);
    // Llamamos a fetchPieces con el jobId seleccionado
    fetchPieces(jobId);
  };

  return (
    <SafeAreaView style={DashBoardStyles.safeArea}>
      <ScrollView
        style={DashBoardStyles.container}
        contentContainerStyle={DashBoardStyles.contentContainer}
      >
        <View>
          <Image
            source={require('../assets/grupo_arga_cover.jpg')}
            style={DashBoardStyles.coverImage}
          />
        </View>

        <View style={DashBoardStyles.header}>
          <View style={DashBoardStyles.headerBackground}>
            <Text
              style={[
                DashBoardStyles.title,
                DashBoardStyles.headerTitleWhite,
              ]}
            >
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
            <ActivityIndicator
              size="large"
              style={DashBoardStyles.activityIndicator}
            />
          ) : (
            <Picker
              selectedValue={selectedJob}
              onValueChange={(itemValue) => handleJobSelection(itemValue)}
              style={DashBoardStyles.picker}
            >
              <Picker.Item key="default" label="Choose a Job" value={null} />
              {jobs.map((job, index) => (
                <Picker.Item
                  key={index}
                  label={job.label}
                  value={job.value}
                />
              ))}
            </Picker>
          )}
        </View>

        <View style={DashBoardStyles.buttonContainer}>
          <Button
            title="Scan with Camera"
            onPress={() => navigation.navigate('TakePhoto')}
          />
        </View>

        <View style={DashBoardStyles.ocrContainer}>
          <Text style={DashBoardStyles.ocrLabel}>OCR Text:</Text>
          <View style={DashBoardStyles.row}>
            <TextInput
              style={DashBoardStyles.ocrInput}
              multiline
              value={ocrText}
              onChangeText={setOcrText}
              placeholder="Here the text read by OCR will be displayed, you can edit it..."
            />
            <Button title="Register" onPress={() => {}} />
          </View>
        </View>

        <View style={DashBoardStyles.console}>
          <Text style={DashBoardStyles.consoleTitle}>Console Messages</Text>
          <View style={DashBoardStyles.consoleBox}>
            {error && (
              <Text style={DashBoardStyles.errorText}>{error}</Text>
            )}
          </View>
        </View>

        {loadingPieces && (
          <ActivityIndicator
            size="large"
            style={DashBoardStyles.activityIndicator}
          />
        )}

        {selectedJob && !loadingPieces && <TableStages pieces={pieces} />}
      </ScrollView>
    </SafeAreaView>
  );
}
