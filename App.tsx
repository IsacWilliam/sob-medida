import { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import NewClientScreen from './src/screens/NewClientScreen';
import ClientsScreen from './src/screens/ClientsScreen';
import ClientDetailsScreen from './src/screens/ClientDetailsScreen';
import MeasurementsScreen from './src/screens/MeasurementsScreen';

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

        <Stack.Screen
          name='Clientes'
          component={ClientsScreen}
          options={{
            title:'Clientes'
          }}
        />

        <Stack.Screen
            name="DetalhesCliente"
            component={ClientDetailsScreen}
            options={{
            title: 'Detalhes do Cliente'
          }}
        />

        <Stack.Screen
            name="Medidas"
            component={MeasurementsScreen}
            options={{
              title: 'Medidas',
            }}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
