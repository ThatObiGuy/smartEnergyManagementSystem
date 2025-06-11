import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ModelInfo = ({
                              title = "Model Information",
                              content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                          }) => {
    return (
        <View style={styles.informationContainer}>
            <Text style={styles.informationTitle}>{title}</Text>
            <Text style={styles.informationContent}>{content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    informationContainer: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 20,
    },
    informationTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    informationContent: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
        textAlign: 'justify',
    },
});

export default ModelInfo