import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/colours';

interface GridIndependenceProps {
    timeframe: string;
    energyStats: any;
}

const GridIndependence = ({ timeframe, energyStats }) => {

    // Calculate percentage
    const totalConsumption = energyStats?.[timeframe]?.total_consumption || 0;
    const gridConsumption = energyStats?.[timeframe]?.consumption_breakdown?.from_grid || 0;

    // Calculate percentage, handling division by zero
    let percentage = 0;
    if (totalConsumption > 0) {
        percentage = ((totalConsumption - gridConsumption) / totalConsumption) * 100;
        // Round to 1 decimal place
        percentage = Math.round(percentage * 10) / 10;
    }

    return (
        <View style={styles.gridIndependence}>
            <Text style={styles.gridText}>{percentage}%</Text>
            <Text style={styles.gridSubtext}>Grid-Independence</Text>
            <View style={styles.barContainer}>
                <View style={[styles.blueBar, { width: `${percentage}%` }]} />
                <View style={[styles.redBar, { width: `${100 - percentage}%` }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    gridIndependence: {
        alignItems: 'flex-end',
        alignSelf: 'center',
        margin: 0,
    },
    gridText: {
        fontSize: 20, // Reduced font size to save space on mobile
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'right',
    },
    gridSubtext: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
        textAlign: 'right',
    },
    barContainer: {
        flexDirection: 'row',
        height: 6,
        width: '80%',
        marginTop: 4,
        borderRadius: 3,
        overflow: 'hidden',
    },
    blueBar: {
        backgroundColor: 'blue',
        height: '100%',
    },
    redBar: {
        backgroundColor: 'red',
        height: '100%',
    },
});

export default GridIndependence;
