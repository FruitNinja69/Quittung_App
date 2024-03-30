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
  const [sortMode, setSortMode] = useState('ascending') // Default sort mode is ascending
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
      sortCapturedPhotos(updatedPhotos) // Sort the captured photos after adding a new one
    }
  }

  const sortCapturedPhotos = (photos) => {
    // Check if there are any photos
    if (photos.length > 0) {
      // Sort based on the selected mode
      if (sortMode === 'ascending') {
        // Sort ascending based on the timestamp of the photo
        photos.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      } else if (sortMode === 'descending') {
        // Sort descending based on the timestamp of the photo
        photos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      }
      setCapturedPhotos([...photos]) // Update the state with sorted photos
    }
  }

  const toggleCamera = () => {
    setIsCameraOpen(!isCameraOpen)
  }

  const changeSortMode = (value) => {
    setSortMode(value)
    sortCapturedPhotos(capturedPhotos) // Sort the captured photos after changing the sort mode
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Camera Button - Always visible */}
      <TouchableOpacity onPress={toggleCamera} style={styles.cameraButton}>
        <AntDesign name="camera" size={50} color="black" />
      </TouchableOpacity>

      {/* Dropdown Menu */}
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
          {/* Anzeige der aufgenommenen Fotos hier, falls vorhanden */}
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  imageItem: {
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  dropdown: {
    height: 50,
    width: 150,
  },
})
