import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ScreenOrientation from 'expo-screen-orientation';
import DashBoardStyles from '../styles/DashBoardStyles';
import ConsoleMessages from '../screens/ConsoleMessages';
import axios from 'axios';
import { BASE_URL } from '../config/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import TableStages from '../screens/TableStages';

export default function DashBoard({ navigation, route }) {
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingPieces, setLoadingPieces] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [error, setError] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const consoleRef = useRef();

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
      consoleRef.current?.addMessage('OCR text received from camera');
    }
  }, [route.params?.ocrText]);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    setError(null);

    try {
      const response = await axios.get(`http://192.168.2.26:8080/jobs/list`);
      const transformedJobs = response.data.map((job) => ({
        label: job.job_code,
        value: job.job_code,
      }));

      setJobs(transformedJobs);
      consoleRef.current?.addMessage('Jobs loaded successfully');
    } catch (err) {
      const errorMessage = 'Error loading available jobs.';
      setError(errorMessage);
      consoleRef.current?.addMessage(errorMessage);
      console.error(err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchPieces = async (jobId) => {
    setLoadingPieces(true);
    setError(null);
    try {
      const response = await axios.get(`http://192.168.2.26:8080/jobs/${jobId}/status`);
      const data = response.data;
  
      const formattedStages = data.stages
        .filter((stage) => stage.stage_name !== "Initialized")
        .map((stage) => ({
          stageName: stage.stage_name,
          items: stage.items.map((item) => ({
            itemName: item.item_name,
            itemOCR: item.item_ocr,
            ratio: item.ratio,
            status: item.status,
            
            
          })),
        }));
  
      setPieces(formattedStages);
      consoleRef.current?.addMessage(`Pieces loaded for job: ${jobId}`);
    } catch (err) {
      const errorMessage = 'Error loading parts for selected job.';
      setError(errorMessage);
      consoleRef.current?.addMessage(errorMessage);
      console.error(err);
    } finally {
      setLoadingPieces(false);
    }
  };

  const handleJobSelection = (jobId) => {
    setSelectedJob(jobId);
    if (jobId) {
      consoleRef.current?.addMessage(`Selected job: ${jobId}`);
      fetchPieces(jobId);
    }
  };

  useEffect(() => {
    if (route.params?.fromCamera) {
      if (route.params.selectedJob) {
        setSelectedJob(route.params.selectedJob);
        fetchPieces(route.params.selectedJob);
      }
      if (route.params.selectedStage) {
        setSelectedStage(route.params.selectedStage);
      }
    }
  }, [route.params?.fromCamera]);

  // Agregar esta función justo arriba del return o en cualquier lugar dentro del componente
  const updateItemStage = async () => {
    if (!ocrText || !selectedStage) {
      consoleRef.current?.addMessage('Debe seleccionar un stage y tener texto OCR disponible.');
      return;
    }

    consoleRef.current?.addMessage('Iniciando actualización de stage...');
    try {
      const response = await axios.put(`http://192.168.2.26:8080/object/update_stage`, null, {
        params: {
          ocr: ocrText,
          new_stage_name: selectedStage
        }
      });

      if (response.status === 200) {
        consoleRef.current?.addMessage('Stage actualizado exitosamente.');
        // Aquí puedes actualizar el estado local o hacer algún otro proceso tras el update.
        // Por ejemplo, volver a cargar las piezas si así lo necesitas:
        if (selectedJob) {
          await fetchPieces(selectedJob);
        }
      } else {
        consoleRef.current?.addMessage(`Ocurrió un problema actualizando el stage. Código: ${response.status}`);
      }
    } catch (error) {
      consoleRef.current?.addMessage('Error al actualizar el stage.');
      console.error(error);
    }
  };


  return (
    <SafeAreaView style={DashBoardStyles.safeArea}>
      <ScrollView
        style={DashBoardStyles.container}
        contentContainerStyle={DashBoardStyles.contentContainer}
      >
        <View>
          <Image
            source={require('../assets/grupo_arga_cover.png')}
            style={DashBoardStyles.coverImage}
          />
        </View>

        <View style={DashBoardStyles.header}>
          <View style={DashBoardStyles.headerBackground}>
            <Text style={[DashBoardStyles.title, DashBoardStyles.headerTitleWhite]}>
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
            <ActivityIndicator size="large" style={DashBoardStyles.activityIndicator} />
          ) : (
            <Picker
              selectedValue={selectedJob}
              onValueChange={handleJobSelection}
              style={DashBoardStyles.picker}
            >
              <Picker.Item key="default" label="Choose a Job" value={null} />
              {jobs.map((job, index) => (
                <Picker.Item key={index} label={job.label} value={job.value} />
              ))}
            </Picker>
          )}
        </View>

        {selectedJob && (
          <View style={DashBoardStyles.stageSelectorContainer}>
            <Text style={DashBoardStyles.label}>Select a Stage:</Text>
            <Picker
              selectedValue={selectedStage}
              onValueChange={(itemValue) => {
                setSelectedStage(itemValue);
                if (itemValue) {
                  consoleRef.current?.addMessage(`Selected stage: ${itemValue}`);
                }
              }}
              style={DashBoardStyles.picker}
            >
              <Picker.Item key="default" label="Choose a Stage" value={null} />
              <Picker.Item key="cutting" label="CUTTING" value="CUTTING" />
              <Picker.Item key="bent" label="BENT" value="BENT" />
              <Picker.Item key="machining" label="MACHINING" value="MACHINING" />
              <Picker.Item key="warehouse" label="WAREHOUSE" value="WAREHOUSE" />
            </Picker>
          </View>
        )}

        {selectedJob && (
          <>
            <View style={DashBoardStyles.buttonContainer}>
              <Button
                title="Scan with Camera"
                onPress={() => {
                  consoleRef.current?.addMessage('Opening camera...');
                  navigation.navigate('TakePhoto', {
                    selectedJob: selectedJob,
                    selectedStage: selectedStage
                  });
                }}
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

                <Button 
                  title="Register" 
                  onPress={() => {
                    consoleRef.current?.addMessage('Registration process started');
                    updateItemStage(); // Llamamos a la función que realiza la petición al endpoint
                  }} 
                />
              </View>
            </View>

            <ConsoleMessages ref={consoleRef} />

            {loadingPieces && (
              <ActivityIndicator size="large" style={DashBoardStyles.activityIndicator} />
            )}

            {!loadingPieces && <TableStages pieces={pieces} />}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}