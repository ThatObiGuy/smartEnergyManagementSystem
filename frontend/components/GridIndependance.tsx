import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/colours';

const GridIndependence = ({ percentage = 80 }) => {
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
        fontSize: 24,
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