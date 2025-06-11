import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GrossEnergySavingsCard = ({ amount = "XXX.XX" }) => {
    return (
        <View style={styles.savingsCard}>
            <View style={styles.savingsHeader}>
                <View style={styles.iconContainer}>
                    <View style={styles.coinStack}>
                        <View style={[styles.coin, styles.coin1]} />
                        <View style={[styles.coin, styles.coin2]} />
                        <View style={[styles.coin, styles.coin3]} />
                    </View>
                </View>
                <View style={styles.savingsText}>
                    <Text style={styles.savingsLabel}>GROSS ENERGY SAVINGS</Text>
                    <Text style={styles.savingsAmount}>€ {amount}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    savingsCard: {
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
    savingsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 15,
    },
    coinStack: {
        position: 'relative',
        width: 40,
        height: 30,
    },
    coin: {
        position: 'absolute',
        width: 30,
        height: 20,
        backgroundColor: '#333',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#555',
    },
    coin1: {
        top: 0,
        left: 0,
    },
    coin2: {
        top: 5,
        left: 5,
    },
    coin3: {
        top: 10,
        left: 10,
    },
    savingsText: {
        flex: 1,
    },
    savingsLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginBottom: 5,
    },
    savingsAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default GrossEnergySavingsCard;