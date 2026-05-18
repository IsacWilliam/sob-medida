import { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import NewClientScreen from './src/screens/NewClientScreen';

import { initializeDatabase } from './src/database/database';

const Stack = createNativeStackNavigator();

export default function App() {
useEffect(() => {
  initializeDatabase();
}, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Sob Medida',
          }}
        />

        <Stack.Screen
          name="NovoCliente"
          component={NewClientScreen}
          options={{
          title: 'Novo Cliente',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
