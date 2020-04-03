import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { SAView, DivView, BottomView } from '@components/Container'
import { BRounded } from '@components/Button'

const PermissionScreen = () => {
  return (
    <SAView>
      <DivView>
        <View style={styles.mainContainer}>
          <View>
            <View style={styles.imageContainer}>

            </View>
            <View style={{ height: 20 }} />
            <Text style={styles.text1}>Set up permissions</Text>
            <View style={{ height: 50 }} />
            <Text style={styles.text2}>Allow these features to set up.</Text>
            <View style={{ height: 20 }} />
            <Text style={styles.text2}>1. Bluetooth</Text>
            <View style={{ height: 6 }} />
            <Text style={styles.text2}>2. Push Notifications</Text>
          </View>
          <View>
            <Text style={styles.text3}>Both features are needed for the app to work. Your battery usage may increase.</Text>
          </View>
        </View>
        <BottomView>
          <BRounded
            onPress={() => { }}
            text="Proceed"
          />
        </BottomView>
      </DivView>
    </SAView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 22,
    justifyContent: 'space-between',
  },
  imageContainer: {
    height: 158,
    width: '100%',
    backgroundColor: 'grey',
  },
  text1: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  text2: {
    fontSize: 20,
  },
  text3: {
    fontSize: 14,
  },
})

export default PermissionScreen
