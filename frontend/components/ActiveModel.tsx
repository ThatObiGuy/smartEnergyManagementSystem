import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ActiveModel = ({ title = "ACTIVE MODEL : RULE-BASED", siteId = null }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            {/* Display image based on siteId */}
            {siteId === 1 && (
                <Image 
                    source={require('../assets/images/RuleBasedSite1.png')} 
                    style={styles.image} 
                    resizeMode="contain"
                />
            )}

            {siteId === 2 && (
                <Image 
                    source={require('../assets/images/RuleBasedSite2.png')} 
                    style={styles.image} 
                    resizeMode="contain"
                />
            )}

            {/* Show placeholder if siteId is null */}
            {siteId === null && (
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>Please select a site</Text>
                </View>
            )}
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
    image: {
        width: '100%',
        height: 200,
        marginVertical: 10,
    },
});

export default ActiveModel;
