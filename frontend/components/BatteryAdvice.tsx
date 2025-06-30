import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DailySaleData {
    lwr: number;
    median: number;
    upr: number;
}

interface BatteryAdviceProps {
    batteryCost?: number; // in euros
    batteryCapacity?: number; // in kWh
    dailySaleToGrid?: DailySaleData;
}

const BatteryAdvice = ({
                           batteryCost,
                           batteryCapacity,
                           dailySaleToGrid
                       }: BatteryAdviceProps) => {


    const generateAdvice = () => {
        // Check if all required props are provided
        if (!dailySaleToGrid || !batteryCost || !batteryCapacity) {
            return "Battery advice unavailable - missing data.";
        }

        const { median } = dailySaleToGrid;
        const dailySavings = median * 0.36; // Convert cents to euros - taken 36 cents as a sort of guess TODO: Investigate this figure.
        const annualSavings = dailySavings * 365;
        const paybackYears = Math.round((batteryCost / annualSavings) * 10) / 10;

        const shouldBuy = paybackYears <= 6;

        return `Given a ${batteryCapacity} kw battery costs €${batteryCost.toLocaleString()} and you're selling a average of ${median} kW back to the grid on an average day, you ${shouldBuy ? 'should' : 'shouldn\'t'} buy ${batteryCapacity} kw another battery. ${shouldBuy ? `The payback period would be approximately ${paybackYears} years.` : `The payback period would be too long at ${paybackYears} years.`}`;
    };

    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <View style={styles.battery}>
                    <View style={styles.batteryTip} />
                    <Text style={styles.batteryPlus}>+</Text>
                </View>
            </View>
            <Text style={styles.adviceText}>
                {generateAdvice()}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        margin: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 8,
    },
    battery: {
        position: 'relative',
        width: 24,
        height: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    batteryTip: {
        position: 'absolute',
        right: -3,
        top: '50%',
        marginTop: -2,
        width: 2,
        height: 4,
        backgroundColor: '#333',
        borderRadius: 1,
    },
    batteryPlus: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    adviceText: {
        fontSize: 12,
        lineHeight: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default BatteryAdvice;
