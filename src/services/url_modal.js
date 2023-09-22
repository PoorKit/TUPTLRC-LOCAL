import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { Modal, Text } from 'react-native-paper';

const URLSettingModal = ({ visible, hideModal, setWebUrl }) => {
  const [newURL, setNewURL] = useState('');

  const handleSetURL = () => {
    setWebUrl(newURL); // Call the action to set the URL with the new value
    hideModal(); // Close the modal
  };

  return (
    <Modal visible={visible} onDismiss={hideModal}>
      <View style={{ margin: 20, backgroundColor: "#ffffff", padding: 12, borderRadius: 4}}>
        <Text>Enter Host URL:</Text>
        <TextInput
          placeholder="https://example.com/api/v1"
          onChangeText={(text) => setNewURL(text)}
          value={newURL}
          style={{marginVertical: 10}}
        />
        <Button title="Set URL" onPress={handleSetURL} />
      </View>
    </Modal>
  );
};

export default URLSettingModal;
