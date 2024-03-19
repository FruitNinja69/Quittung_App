import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

export default function App() {
  return (
    <View style={styles.container}>
      <Text> Hallo </Text>
      <StatusBar style="auto" />
      <View style={styles.cameraContainer}>
        <View style={styles.cameraCircle}>
          <AntDesign name="camera" size={24} color="black" />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  cameraCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
