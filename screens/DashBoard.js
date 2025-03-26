import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ScreenOrientation from 'expo-screen-orientation';
import DashBoardStyles from '../styles/DashBoardStyles';
import ConsoleMessages from '../screens/ConsoleMessages';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import TableStages from '../screens/TableStages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { config } from '../config/config';

export default function DashBoard({ navigation, route }) {
  const consoleRef = useRef();

  // Estados principales
  const [baseUrl, setBaseUrl] = useState('');
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingPieces, setLoadingPieces] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [error, setError] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const STORAGE_KEY = '@app_baseUrl';

  // Estados para el menú (modal) de configuración
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [ipValue, setIpValue] = useState('');
  const [portValue, setPortValue] = useState('');
  const [isHttps, setIsHttps] = useState(false);

  useEffect(() => {
    const loadSavedBaseUrl = async () => {
      try {
        const savedBaseUrl = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedBaseUrl !== null) {
          setBaseUrl(savedBaseUrl);
          // Extraer valores para el modal
          const url = new URL(savedBaseUrl);
          setIpValue(url.hostname);
          setPortValue(url.port);
          setIsHttps(url.protocol === 'https:');
        }
      } catch (e) {
        console.error('Error loading baseUrl:', e);
      }
    };
    loadSavedBaseUrl();
  }, []);

  useEffect(() => {
    const enableOrientation = async () => {
      await ScreenOrientation.unlockAsync();
    };
    enableOrientation();
  }, []);

  // Cargar jobs cuando cambie baseUrl
  useEffect(() => {
    if (baseUrl) {
      fetchJobs();
    }
  }, [baseUrl]);

  // Manejar datos recibidos (OCR, cámara, etc.)
  useEffect(() => {
    if (route.params?.ocrText) {
      setOcrText(route.params.ocrText);
      consoleRef.current?.addMessage('OCR text received from camera');
    }
    if (route.params?.fromCamera) {
      if (route.params.selectedJob) {
        setSelectedJob(route.params.selectedJob);
      }
      if (route.params.selectedStage) {
        setSelectedStage(route.params.selectedStage);
      }
      if (route.params.baseUrl) {
        setBaseUrl(route.params.baseUrl);
      }
    }
  }, [route.params]);

  // Cargar piezas cuando cambia el job seleccionado
  useEffect(() => {
    if (selectedJob && baseUrl) {
      fetchPieces(selectedJob);
    }
  }, [selectedJob, baseUrl]);

  // Función para obtener la lista de jobs
  const fetchJobs = async () => {
    if (!baseUrl) {
      console.log('No baseUrl available');
      return;
    }
    setLoadingJobs(true);
    setError(null);

    try {
      const response = await axios.get(`${baseUrl}/jobs/list`);
      const transformedJobs = response.data.map((job) => ({
        label: job.job_code,
        value: job.job_code,
      }));
      setJobs(transformedJobs);
      consoleRef.current?.addMessage(`Jobs loaded successfully from: ${baseUrl}`);
    } catch (err) {
      const errorMessage = 'Error loading available jobs.';
      setError(errorMessage);
      consoleRef.current?.addMessage(errorMessage);
      console.error(err);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Función para obtener las piezas (stages)
  const fetchPieces = async (jobId) => {
    if (!baseUrl || !jobId) {
      console.log('No baseUrl or jobId available');
      return;
    }
    setLoadingPieces(true);
    setError(null);

    try {
      const response = await axios.get(`${baseUrl}/jobs/${jobId}/status`);
      const data = response.data;
      const formattedStages = data.stages
        .filter((stage) => stage.stage_name !== 'Initialized')
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
    }
  };

  // Función para actualizar el stage de un item
  const updateItemStage = async () => {
    if (!baseUrl) {
      consoleRef.current?.addMessage('No baseUrl available');
      return;
    }
    if (!ocrText || !selectedStage) {
      consoleRef.current?.addMessage('Debe seleccionar un stage y tener texto OCR disponible.');
      return;
    }
    consoleRef.current?.addMessage('Iniciando actualización de stage...');
    try {
      const response = await axios.put(`${baseUrl}/object/update_stage`, null, {
        params: {
          ocr: ocrText,
          new_stage_name: selectedStage,
        },
      });
      if (response.status === 200) {
        consoleRef.current?.addMessage('Stage actualizado exitosamente.');
        if (selectedJob) {
          await fetchPieces(selectedJob);
        }
      } else {
        consoleRef.current?.addMessage(
          `Ocurrió un problema actualizando el stage. Código: ${response.status}`
        );
      }
    } catch (error) {
      consoleRef.current?.addMessage('Error al actualizar el stage.');
      console.error(error);
    }
  };

  // Función para aplicar la configuración del servidor
  const applySettings = async () => {
    if (!ipValue || !portValue) {
      Alert.alert('Error', 'Por favor ingrese IP y puerto');
      return;
    }
    const protocol = isHttps ? 'https://' : 'http://';
    const newBaseUrl = `${protocol}${ipValue}:${portValue}`;
  
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newBaseUrl);
      setBaseUrl(newBaseUrl);
      consoleRef.current?.addMessage(`BASE_URL saved and changed to: ${newBaseUrl}`);
    } catch (e) {
      console.error('Error saving baseUrl:', e);
      consoleRef.current?.addMessage('Error saving BASE_URL configuration');
      Alert.alert('Error', 'No se pudo guardar la configuración');
    }
    setSettingsVisible(false);
  };

  // Función de logout
  const handleLogout = async () => {
    try {
      // Obtener token y tipo de token
      const token = await AsyncStorage.getItem('userToken');
      const tokenType = await AsyncStorage.getItem('tokenType');

      // (Opcional) Llamada al endpoint /logout para invalidar el token en el servidor
      if (token && tokenType) {
        const response = await fetch(`${baseUrl}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `${tokenType} ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.log('Error al hacer logout:', JSON.stringify(errorData));
          throw errorData;
        }
      }

      // Eliminar token del AsyncStorage y remover la cabecera de axios
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('tokenType');
      delete axios.defaults.headers.common['Authorization'];

      // Navegar a la pantalla de Login
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'Ocurrió un error al cerrar sesión.');
    }
  };

  return (
    <SafeAreaView style={DashBoardStyles.safeArea}>
      <ScrollView
        style={DashBoardStyles.container}
        contentContainerStyle={DashBoardStyles.contentContainer}
        nestedScrollEnabled={true}
      >
        {/* Barra superior con íconos de configuración y logout */}
        <View style={DashBoardStyles.topBar}>
          <TouchableOpacity
            style={DashBoardStyles.iconButton}
            onPress={() => setSettingsVisible(true)}
          >
            <AntDesign name="tool" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={DashBoardStyles.iconButton}
            onPress={() =>
              Alert.alert(
                "Confirmación",
                "¿Estás seguro de que deseas cerrar la sesión?",
                [
                  { text: "Cancelar", style: "cancel" },
                  { text: "Sí", onPress: handleLogout }
                ],
                { cancelable: false }
              )
            }
          >
            <AntDesign name="logout" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View>
          <Image
            source={{ uri: `${baseUrl}/static/images/grupo_arga_cover.png` }}
            style={DashBoardStyles.coverImage}
          />
        </View>

        <View style={[DashBoardStyles.jobSelectorContainer, DashBoardStyles.row]}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <Text style={[DashBoardStyles.label, { marginBottom: 2 }]}>
              Select a Job:
            </Text>
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
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={[DashBoardStyles.label, { marginBottom: 2 }]}>
                Select a Stage:
              </Text>
              <Picker
                selectedValue={selectedStage}
                onValueChange={(value) => {
                  setSelectedStage(value);
                  if (value) {
                    consoleRef.current?.addMessage(`Selected stage: ${value}`);
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
        </View>

        {selectedJob && (
          <View
            style={[
              DashBoardStyles.row,
              { alignItems: 'center', justifyContent: 'space-evenly', marginVertical: 10 },
            ]}
          >
            <View style={{ flex: 0.5, marginRight: 10 }}>
              <Button
                title="Scan with Camera"
                onPress={() => {
                  consoleRef.current?.addMessage('Opening camera...');
                  navigation.navigate('TakePhoto', {
                    selectedJob,
                    selectedStage,
                    baseUrl,
                  });
                }}
              />
            </View>

            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={DashBoardStyles.ocrLabel}>OCR Text:</Text>
              <View style={[DashBoardStyles.row, { marginTop: 5 }]}>
                <TextInput
                  style={[DashBoardStyles.ocrInput, { flex: 1, marginRight: 5 }]}
                  multiline
                  value={ocrText}
                  onChangeText={setOcrText}
                  placeholder="Here the text read by OCR will be displayed, you can edit it..."
                />
                <Button
                  title="Register"
                  onPress={() => {
                    consoleRef.current?.addMessage('Registration process started');
                    updateItemStage();
                  }}
                />
              </View>
            </View>

            <View style={{ flex: 1, marginLeft: 10 }}>
              <ConsoleMessages ref={consoleRef} />
            </View>
          </View>
        )}

        {selectedJob && (
          <>
            {loadingPieces && (
              <ActivityIndicator size="large" style={DashBoardStyles.activityIndicator} />
            )}
            {!loadingPieces && pieces.length > 0 && (
              <ScrollView style={DashBoardStyles.tableScroll} nestedScrollEnabled={true}>
                <TableStages pieces={pieces} />
              </ScrollView>
            )}
          </>
        )}

        {/* Modal de Configuración */}
        <Modal visible={settingsVisible} transparent animationType="slide">
          <View style={DashBoardStyles.modalBackground}>
            <View style={DashBoardStyles.modalContainer}>
              <Text style={DashBoardStyles.modalTitle}>Configuración de Servidor</Text>
              <Text style={DashBoardStyles.modalLabel}>IP (sin http/https):</Text>
              <TextInput
                style={DashBoardStyles.modalInput}
                value={ipValue}
                onChangeText={setIpValue}
                placeholder="Ej: 192.168.0.123"
              />
              <Text style={DashBoardStyles.modalLabel}>Puerto:</Text>
              <TextInput
                style={DashBoardStyles.modalInput}
                value={portValue}
                onChangeText={setPortValue}
                keyboardType="numeric"
                placeholder="Ej: 8080"
              />
              <View style={DashBoardStyles.switchRow}>
                <Text style={DashBoardStyles.modalLabel}>HTTPS</Text>
                <Switch value={isHttps} onValueChange={(val) => setIsHttps(val)} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
                <Button title="Cancelar" onPress={() => setSettingsVisible(false)} />
                <Button title="Aplicar" onPress={applySettings} />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
