import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colours';

const HomeGraph = () => {
    // Generic bar chart data for production vs consumption
    const data = [
        { label: 'Jan', production: 10, consumption: 25 },
        { label: 'Feb', production: 15, consumption: 30 },
        { label: 'Mar', production: 30, consumption: 40 },
        { label: 'Apr', production: 50, consumption: 45 },
        { label: 'May', production: 60, consumption: 45 },
        { label: 'Jun', production: 50, consumption: 45 },
    ];

    const maxValue = Math.max(...data.flatMap(d => [d.production, d.consumption]));

    return (
        <View style={styles.container}>
                <View style={styles.chart}>
                    {data.map((item, index) => (
                        <View key={index} style={styles.barGroup}>
                            <View style={styles.bars}>
                                <View 
                                    style={[
                                        styles.bar, 
                                        styles.productionBar,
                                        { height: (item.production / maxValue) * 100 }
                                    ]} 
                                />
                                <View 
                                    style={[
                                        styles.bar, 
                                        styles.consumptionBar,
                                        { height: (item.consumption / maxValue) * 100 }
                                    ]} 
                                />
                            </View>
                            <Text style={styles.label}>{item.label}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
                        <Text style={styles.legendText}>Production</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: colors.danger }]} />
                        <Text style={styles.legendText}>Consumption</Text>
                    </View>
                </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 5,
        elevation: 3,
        marginTop: 15,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 120,
        marginBottom: 16,
    },
    barGroup: {
        alignItems: 'center',
    },
    bars: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 2,
        marginBottom: 8,
    },
    bar: {
        width: 8,
        minHeight: 4,
        borderRadius: 2,
    },
    productionBar: {
        backgroundColor: colors.primary,
    },
    consumptionBar: {
        backgroundColor: colors.danger,
    },
    label: {
        fontSize: 10,
        color: colors.textSecondary,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 2,
    },
    legendText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
});

export default HomeGraph;