import React from 'react'
import { StyleSheet, TextInput } from 'react-native'

import Colors from '@utils/colors'

const TILine = React.forwardRef((props, ref) => {
    return (
        <TextInput
            ref={ref}
            style={[
                styles.container,
                props.center && { textAlign: 'center' },
                !props.editable && styles.topRadius
            ]}
            onChangeText={props.onChangeText}
            value={props.value}
            {...props}
        />
    )
})

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        fontSize: 20,
    },
    topRadius: {
        backgroundColor: Colors.lightgrey1,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    }
})

export default TILine