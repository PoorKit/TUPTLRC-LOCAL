import React, { useState } from 'react';
import NavigationStack from './src/navigation/navigation';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import URLSettingModal from './src/services/url_modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(true);

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const setWebUrl = async (UrlSetByUser) => {
    await AsyncStorage.setItem('WebUrl', UrlSetByUser + "/api/v1");
    hideModal();
  }

  return (
    <PaperProvider>
      <StatusBar style='light' />
      <NavigationStack />

      {/* The Modal */}
      <Portal>
        <URLSettingModal visible={isModalVisible} hideModal={hideModal} setWebUrl={setWebUrl} />
      </Portal>
    </PaperProvider>
  );
}
