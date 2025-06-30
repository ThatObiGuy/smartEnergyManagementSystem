import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PaybackProgressChartProps {
    installationDate: string;
    installationCost: number;
    annualGrossSavings: number;
}

const PaybackProgressChart: React.FC<PaybackProgressChartProps> = ({
    installationDate,
    installationCost,
    annualGrossSavings
}) => {
    // Format installation date to show only the date part (YYYY-MM-DD)
    const formattedDate = installationDate ? installationDate.split('T')[0] : '';

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payback Progress</Text>

            <View style={styles.propContainer}>
                <Text style={styles.propLabel}>Installation Date:</Text>
                <Text style={styles.propValue}>{formattedDate}</Text>
            </View>
            
            <View style={styles.propContainer}>
                <Text style={styles.propLabel}>Installation Cost:</Text>
                <Text style={styles.propValue}>€{installationCost.toLocaleString()}</Text>
            </View>
            
            <View style={styles.propContainer}>
                <Text style={styles.propLabel}>Annual Gross Savings:</Text>
                <Text style={styles.propValue}>€{annualGrossSavings.toLocaleString()}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        margin: 5,
        shadowColor: '#000',
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    propContainer: {
        marginBottom: 12,
    },
    propLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    propValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default PaybackProgressChart;