import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ActiveModel = ({ title = "ACTIVE MODEL" }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Chart Placeholder</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        backgroundColor: '#ffffff',
        padding: 20,
        margin: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    placeholder: {
        height: 120,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
    },
    placeholderText: {
        color: '#999',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ActiveModel;