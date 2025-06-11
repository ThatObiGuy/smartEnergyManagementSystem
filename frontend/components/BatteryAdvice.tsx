import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BatteryAdvice = ({
                                      title = "Should you invest in another battery?",
                                      recommendationText = "Based on your current energy consumption and production patterns, investing in an additional battery could increase your energy independence and potentially provide additional savings. Our analysis suggests that with current usage patterns, an additional battery investment could pay for itself within 3-5 years through increased energy storage capacity and reduced grid dependency. Consider factors such as available space, budget, and future energy needs when making this decision."
                                  }) => {
    return (
        <View style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
                <Text style={styles.recommendationTitle}>{title}</Text>
                <View style={styles.batteryIcon}>
                    <View style={styles.battery}>
                        <View style={styles.batteryBody} />
                        <View style={styles.batteryTip} />
                        <Text style={styles.batteryPlus}>+</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.recommendationText}>
                {recommendationText}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    recommendationCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        margin: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    recommendationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    recommendationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    batteryIcon: {
        marginLeft: 10,
    },
    battery: {
        position: 'relative',
        width: 30,
        height: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 3,
        borderWidth: 2,
        borderColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    batteryTip: {
        position: 'absolute',
        right: -4,
        top: '50%',
        marginTop: -3,
        width: 3,
        height: 6,
        backgroundColor: '#333',
        borderRadius: 1,
    },
    batteryPlus: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    recommendationText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
    },
});

export default BatteryAdvice;