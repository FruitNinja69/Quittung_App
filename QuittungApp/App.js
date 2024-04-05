import React, { useState, useEffect, useRef } from 'react'
import {
  StatusBar,
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native'
import { Camera } from 'expo-camera'
import { AntDesign } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'

export default function App() {
  const [hasPermission, setHasPermission] = useState(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const [sortMode, setSortMode] = useState('ascending')
  const cameraRef = useRef(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync()
      const updatedPhotos = [
        ...capturedPhotos,
        { ...photo, timestamp: new Date() },
      ]
      setCapturedPhotos(updatedPhotos)
      setIsCameraOpen(false)
      sortCapturedPhotos(updatedPhotos)
    }
  }
  //hallo
  const sortCapturedPhotos = (photos) => {
    if (photos.length > 0) {
      if (sortMode === 'ascending') {
        photos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      } else if (sortMode === 'descending') {
        photos.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      }
      setCapturedPhotos([...photos])
    }
  }

  const toggleCamera = () => {
    setIsCameraOpen(!isCameraOpen)
  }

  const changeSortMode = (value) => {
    setSortMode(value)
    sortCapturedPhotos(capturedPhotos)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <TouchableOpacity onPress={toggleCamera} style={styles.cameraButton}>
        <AntDesign name="camera" size={50} color="black" />
      </TouchableOpacity>

      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={sortMode}
          style={styles.dropdown}
          onValueChange={(itemValue, itemIndex) => changeSortMode(itemValue)}
        >
          <Picker.Item label="Aufsteigend" value="ascending" />
          <Picker.Item label="Absteigend" value="descending" />
        </Picker>
      </View>

      {isCameraOpen ? (
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraIconContainer}>
            <TouchableOpacity onPress={takePicture} style={styles.cameraIcon}>
              <AntDesign name="camera" size={50} color="black" />
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <>
          <View style={styles.imageContainer}>
            {capturedPhotos.map((photo, index) => (
              <View key={index} style={styles.imageItem}>
                <Image source={{ uri: photo.uri }} style={styles.image} />
              </View>
            ))}
          </View>
        </>
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
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'transparent',
  },
  cameraIconContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  imageItem: {
    margin: 10,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },

  dropdownContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  dropdown: {
    height: 50,
    width: 150,
  },
})
