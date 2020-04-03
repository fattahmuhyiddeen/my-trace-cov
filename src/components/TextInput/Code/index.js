import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'

import { TILine } from '@components/TextInput'

const TICode = (props) => {

    let codeTextInput = []
    const [code, setOtp] = useState(props.initialValue ? props.initialValue : [])

    focusPrevious = (key, index) => {
        if (key === 'Backspace' && index !== 0)
            codeTextInput[index - 1].focus();
    }

    focusNext = (index, value) => {
        if (index < codeTextInput.length - 1 && value) {
            codeTextInput[index + 1].focus();
        }
        if (index === codeTextInput.length - 1) {
            codeTextInput[index].blur();
        }
        const codeArr = code;
        codeArr[index] = value;
        setOtp(codeArr)
        props.onChangeText(code.join(''))
    }

    renderInputs = () => {
        const inputs = Array(6).fill(0)
        const txt = inputs.map(
            (i, j) => {
                return (
                    <View
                        key={j}
                        style={styles.inputContainer}
                    >
                        <TILine
                            maxLength={1}
                            value={code[j]}
                            onChangeText={v => focusNext(j, v)}
                            onKeyPress={e => focusPrevious(e.nativeEvent.key, j)}
                            ref={ref => codeTextInput[j] = ref}
                            center
                            keyboardType={props.keyboardType}
                            editable={props.editable}
                        />
                    </View>
                )
            }
        )
        return txt
    }

    return (
        <View style={styles.rowContainer}>
            {renderInputs()}
        </View>
    )
}

const styles = StyleSheet.create({
    rowContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputContainer: {
        flex: 1,
        paddingHorizontal: 6,
    },
})

export default TICode
