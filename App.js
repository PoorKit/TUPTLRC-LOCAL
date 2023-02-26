import React from 'react';
import NavigationStack from './src/navigation/navigation';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  
  return (
    <PaperProvider>
      <StatusBar style='light'/>
      <NavigationStack/>
    </PaperProvider>
  );
}
