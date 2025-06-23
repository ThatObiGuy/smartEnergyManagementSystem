import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/styles/colours';

interface HomeGraphProps {
    timeframe: string;
    energyStats: any;
}

const HomeGraph: React.FC<HomeGraphProps> = ({ timeframe, energyStats }) => {
    // Simple loading state
    if (!energyStats) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading energy data...</Text>
            </View>
        );
    }

    // Normalize timeframe and get data
    const normalizedTimeframe = timeframe?.toLowerCase() || 'day';
    const timeframeData = energyStats && energyStats[normalizedTimeframe];

    // Handle missing data
    if (!timeframeData) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No data available for {normalizedTimeframe}</Text>
            </View>
        );
    }

    // Simple function to safely parse values
    const getValue = (value) => {
        if (value === undefined || value === null) return 0;
        const parsed = parseInt(value);
        return isNaN(parsed) ? 0 : parsed;
    };

    // Get production values
    const totalProduction = getValue(timeframeData.total_production);
    const solarProduction = getValue(timeframeData.production_breakdown?.solar_panels);
    const batteryDischarge = getValue(timeframeData.production_breakdown?.battery_discharge);

    // Get consumption values
    const totalConsumption = getValue(timeframeData.total_consumption);
    const batteryCharging = getValue(timeframeData.consumption_breakdown?.battery_charging);
    const homePower = getValue(timeframeData.consumption_breakdown?.home_power);

    // Simplified chart data
    const chartData = {
        labels: ['Production', 'Consumption'],
        data: [
            [totalProduction, 0],
            [0, totalConsumption]
        ],
        colors: [colors.chartGreen, colors.chartRed]
    };

    // Display title with proper capitalization
    const displayTimeframe = normalizedTimeframe.charAt(0).toUpperCase() + normalizedTimeframe.slice(1);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Energy Summary</Text>
            <Text style={styles.subtitle}>
                Production: {totalProduction} w | Consumption: {totalConsumption} w
            </Text>

            <View style={styles.barContainer}>
                <View style={styles.barGroup}>
                    <Text style={styles.barLabel}>Production</Text>
                    <View style={styles.bar}>
                        {totalProduction > 0 ? (
                            <>
                                <View style={[styles.barSegment, { 
                                    backgroundColor: colors.chartGreen, 
                                    flex: solarProduction / totalProduction || 0 
                                }]} />
                                <View style={[styles.barSegment, { 
                                    backgroundColor: colors.chartBlue, 
                                    flex: batteryDischarge / totalProduction || 0 
                                }]} />
                            </>
                        ) : (
                            <View style={[styles.barSegment, { backgroundColor: colors.lightGray, flex: 1 }]} />
                        )}
                    </View>
                    <Text style={styles.barValue}>{totalProduction} w</Text>
                </View>

                <View style={styles.barGroup}>
                    <Text style={styles.barLabel}>Consumption</Text>
                    <View style={styles.bar}>
                        {totalConsumption > 0 ? (
                            <>
                                <View style={[styles.barSegment, { 
                                    backgroundColor: colors.chartOrange, 
                                    flex: batteryCharging / totalConsumption || 0 
                                }]} />
                                <View style={[styles.barSegment, { 
                                    backgroundColor: colors.chartRed, 
                                    flex: homePower / totalConsumption || 0 
                                }]} />
                            </>
                        ) : (
                            <View style={[styles.barSegment, { backgroundColor: colors.lightGray, flex: 1 }]} />
                        )}
                    </View>
                    <Text style={styles.barValue}>{totalConsumption} w</Text>
                </View>
            </View>

            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: colors.chartGreen }]} />
                    <Text style={styles.legendText}>Solar</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: colors.chartBlue }]} />
                    <Text style={styles.legendText}>Battery Discharge</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: colors.chartOrange }]} />
                    <Text style={styles.legendText}>Battery Charging</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: colors.chartRed }]} />
                    <Text style={styles.legendText}>Home Power</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: colors.white,
        borderRadius: 10,
        margin: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
        color: colors.gray,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 16,
        color: colors.danger,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: colors.gray,
        marginBottom: 8,
        textAlign: 'center',
    },
    barContainer: {
        marginVertical: 8,
    },
    barGroup: {
        marginBottom: 8,
    },
    barLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 3,
    },
    bar: {
        height: 25,
        flexDirection: 'row',
        backgroundColor: colors.lightGray,
        borderRadius: 5,
        overflow: 'hidden',
    },
    barSegment: {
        height: '100%',
    },
    barValue: {
        fontSize: 10,
        color: colors.gray,
        marginTop: 2,
        textAlign: 'right',
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 3,
    },
    legendColor: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 3,
    },
    legendText: {
        fontSize: 10,
        color: colors.gray,
    },
});

export default HomeGraph;
