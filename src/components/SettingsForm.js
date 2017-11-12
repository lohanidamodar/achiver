import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Form, Picker, View, Item} from 'native-base';
import { TIMER_TYPES } from '../utils/constants';
import material from '../../native-base-theme/variables/material';

class SettingsForm extends Component{ 
    handleSbreakDurChange = (value) => {
        this.props.onChange(TIMER_TYPES.shortBreak, parseInt(value) * 60 * 1000);
    }
    handleLBreakDurChange = (value) => {
        this.props.onChange(TIMER_TYPES.longBreak, parseInt(value) * 60 * 1000);
    }
    handleSessionLengthChange = (value) => {
        this.props.onChange('sessionsBeforeLongBreak', parseInt(value));
    }
    render(){ 
        var durOptions = [];
        for(var i=5; i < 60; i= i + 5){
            durOptions.push(<Item key={i} label={i.toString() + ' minutes'} value={i} />);
        }
        var sessionLengths = [];
        for(var j = 2; j <= 10; j++){
            sessionLengths.push(<Item key={j} label={j.toString()} value={j} />);

        }
        return( 
            <View style={styles.container}>
                <Text style={styles.heading}>SETTINGS</Text>
                <Form>
                    <Text note>Short Break Duration</Text>
                    <Picker
                        mode="dropdown"
                        placeholder="Select time"
                        selectedValue={parseInt(this.props.shortBreak) / (60 * 1000)}
                        onValueChange={this.handleSBreakDurChange}
                    >
                        {durOptions}
                    </Picker>
                    <View style={styles.separator} />
                    <Text note>Long Break Duration</Text>
                    <Picker
                        mode="dropdown"
                        placeholder="Select time"
                        selectedValue={parseInt(this.props.longBreak) / (60 * 1000)}
                        onValueChange={this.handleLBreakDurChange}
                    >
                        {durOptions}
                    </Picker>
                    <View style={styles.separator} />
                    <Text note>Sessions before long break</Text>
                    <Picker
                        mode="dropdown"
                        placeholder="Select session length"
                        selectedValue={parseInt(this.props.sessionLength)}
                        onValueChange={this.handleSessionLengthChange}
                    >
                        {sessionLengths}
                    </Picker>

                </Form>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    heading: {
        fontSize: 20,
        color: material.brandInfo,
        textAlign: 'center',
        marginBottom: 20
    },
    separator: {
        borderWidth: material.borderWidth,
        borderColor: material.listBorderColor,
        marginBottom: 10
    }
})

export default SettingsForm;