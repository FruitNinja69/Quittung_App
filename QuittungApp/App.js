import React, { useState, useEffect, useRef } from 'react'
import {
  StatusBar,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native'
import { Camera } from 'expo-camera'
import { AntDesign } from '@expo/vector-icons'

export default function App() {
  const [hasPermission, setHasPermission] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const cameraRef = useRef(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const takePicture = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync()
      console.log(photo)
      // Hier können Sie die aufgenommenen Foto-Daten weiterverarbeiten
    }
  }

  const toggleCamera = () => {
    setShowCamera(!showCamera)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {!showCamera ? (
        <View style={styles.cameraIconContainer}>
          <TouchableOpacity onPress={toggleCamera} style={styles.cameraIcon}>
            <AntDesign name="camera" size={50} color="black" />
          </TouchableOpacity>
        </View>
      ) : (
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraIconContainer}>
            <TouchableOpacity onPress={takePicture} style={styles.cameraIcon}>
              <AntDesign name="camera" size={50} color="black" />
            </TouchableOpacity>
          </View>
        </Camera>
      )}
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
  camera: {
    flex: 1,
    width: '100%',
  },
  cameraIconContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 40,
  },
  cameraIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
