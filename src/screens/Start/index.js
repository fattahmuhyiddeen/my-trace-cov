import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { SAView, DivView, BottomView } from '@components/Container'
import { BRounded } from '@components/Button'

const HomeScreen = () => {
  return (
    <SAView>
      <DivView>
        <View style={styles.mainContainer}>
          <View>
            <View style={styles.imageContainer}>

            </View>
            <View style={{ height: 20 }} />
            <Text style={styles.text1}>Help stop the spread of COVID-19 by turning Bluetooth on</Text>
            <View style={{ height: 50 }} />
            <Text style={styles.text2}>If you had close contact with a COVID-19 case, we help the Kementerian Kesihatan Malaysia (KKM) call you more quickly.</Text>
            <View style={{ height: 50 }} />
          </View>
          <View>
            <Text style={styles.text3}>Your data is never accessed, unless you were near a confirmed case.</Text>
          </View>
        </View>
        <BottomView>
          <BRounded
            onPress={() => { }}
            text="I want to help"
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

export default HomeScreen
