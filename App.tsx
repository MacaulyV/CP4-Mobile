import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FormScreen from './src/FormScreen';
import ResultScreen from './src/ResultScreen';

// Definindo os tipos para os parâmetros das telas, para evitar erros durante o desenvolvimento
export type RootStackParamList = {
  FormScreen: {
    name?: string; // Nome do produto (opcional)
    value?: number; // Valor original do produto
    percent?: number; // Percentual de aumento
  } | undefined;
  ResultScreen: {
    itemName: string; // Nome do produto
    originalValue: number; // Valor original
    updatedValue: number; // Novo valor após o aumento
    percentUsed: number; // Porcentagem usada para calcular o aumento
  };
};

// Configurando as rotas entre as telas do app
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FormScreen">
        <Stack.Screen 
          name="FormScreen" 
          component={FormScreen} 
          options={{ headerShown: false }} // Removendo a barra do topo para um visual mais limpo
        />
        <Stack.Screen 
          name="ResultScreen" 
          component={ResultScreen} 
          options={{ headerShown: false }} // Também sem a barra superior para manter o padrão
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
