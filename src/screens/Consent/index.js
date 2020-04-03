import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { SAView, DivView, BottomView } from '@components/Container'
import { BRounded } from '@components/Button'

const ConsentScreen = () => {
    return (
        <SAView>
            <DivView>
                <View style={styles.mainContainer}>
                    <Text style={styles.text1}>Your consent is needed for the following:</Text>
                    <View style={{ height: 50 }} />
                    <View style={styles.rowContainer}>
                        <View style={{ height: 40, width: 40, backgroundColor: 'grey' }}>

                        </View>
                        <View style={{ width: 12 }} />
                        <View style={styles.textContainer}>
                            <Text style={styles.text2}>To store your mobile number in a secured TraceCov registry.</Text>
                        </View>
                    </View>
                    <View style={{ height: 30 }} />
                    <View style={styles.rowContainer}>
                        <View style={{ height: 40, width: 40, backgroundColor: 'grey' }}>

                        </View>
                        <View style={{ width: 12 }} />
                        <View style={styles.textContainer}>
                            <Text style={styles.text2}>For TraceCov users who are COVID-19 cases to share information about their possible encounters with you - so that we can call your mobile phone number about next steps.</Text>
                        </View>
                    </View>
                </View>
                <BottomView>
                    <BRounded
                        onPress={() => { }}
                        text="I agree"
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
    },
    rowContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    textContainer: {
        flex: 1,
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

export default ConsentScreen
