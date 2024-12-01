import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View} from 'react-native';
import 'react-native-gesture-handler';
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import DashBoard from './screens/DashBoard';
import Login from './screens/Login';
import TakePhoto from './screens/TakePhoto';

export default function App() {
  const Stack = createStackNavigator();
    function MyStack() {
      return (  
        <Stack.Navigator>
          <Stack.Screen name="Dashboard" component={DashBoard} />
          <Stack.Screen name="TakePhoto" component={TakePhoto} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      );
    }
  return(
    <NavigationContainer>
      <MyStack/>
    </NavigationContainer>
  );
}
