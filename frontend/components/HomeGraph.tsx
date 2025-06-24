import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/colours';

interface HomeGraphProps {
    timeframe: string; // selected by user via TimeSelector component
    energyStats: any; // in the form:
    /*
        "energy_stats": {
    "day": {
      "total_production": "12053",
      "production_breakdown": {
        "solar_panels": "11011",
        "battery_discharge": "1042",
        "grid_purchase": "5"
      },
      "total_consumption": "418193",
      "consumption_breakdown": {
        "battery_charging": "8943",
        "grid_selling": "5",
        "home_power": "409245"
      }
    }, "week", "month", "year" and "total".
     */
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

    const timeframeData = energyStats[timeframe];

    // Handle missing data
    if (!timeframeData) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No data available for {timeframe}</Text>
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
    const toHome = getValue(timeframeData.production_breakdown?.to_home);
    const toBattery = getValue(timeframeData.production_breakdown?.to_battery);
    const toGrid = getValue(timeframeData.production_breakdown?.to_grid);

    // Get consumption values
    const totalConsumption = getValue(timeframeData.total_consumption);
    const fromSolar = getValue(timeframeData.consumption_breakdown?.from_solar);
    const fromBattery = getValue(timeframeData.consumption_breakdown?.from_battery);
    const fromGrid = getValue(timeframeData.consumption_breakdown?.from_grid);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Energy Summary</Text>
            <Text style={styles.subtitle}>
                Production: {totalProduction} w | Consumption: {totalConsumption} w
            </Text>

            <View style={styles.barContainer}>
                <View style={styles.barGroup}>
                    <Text style={styles.barLabel}>System has produced:</Text>
                    <View style={styles.bar}>
                        {totalProduction > 0 ? (
                            <>
                                <View style={[styles.barSegment, { 
                                    backgroundColor: colors.success,
                                    flex: toHome / totalProduction || 0
                                }]} />
                                <View style={[styles.barSegment, { 
                                    backgroundColor: colors.info,
                                    flex: toBattery / totalProduction || 0
                                }]} />
                                <View style={[styles.barSegment, {
                                    backgroundColor: colors.danger,
                                    flex: toGrid / totalProduction || 0
                                }]} />
                            </>
                        ) : (
                            <View style={[styles.barSegment, { backgroundColor: colors.lightGray, flex: 1 }]} />
                        )}
                    </View>
                    <Text style={styles.barValue}>{totalProduction} w</Text>
                </View>

                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: colors.warning }]} />
                        <Text style={styles.legendText}>To Home</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: colors.info }]} />
                        <Text style={styles.legendText}>To Battery</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: colors.danger }]} />
                        <Text style={styles.legendText}>To Grid</Text>
                    </View>
                </View>

                <View style={styles.barGroup}>
                    <Text style={styles.barLabel}>System has consumed:</Text>
                    <View style={styles.bar}>
                        {totalConsumption > 0 ? (
                            <>
                                <View style={[styles.barSegment, { 
                                    backgroundColor: colors.success,
                                    flex: fromSolar / totalConsumption || 0
                                }]} />
                                <View style={[styles.barSegment, {
                                    backgroundColor: colors.info,
                                    flex: fromBattery / totalConsumption || 0
                                }]} />
                                <View style={[styles.barSegment, {
                                    backgroundColor: colors.danger,
                                    flex: fromGrid / totalConsumption || 0
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
                    <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
                    <Text style={styles.legendText}>From Solar</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: colors.info }]} />
                    <Text style={styles.legendText}>From Battery</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: colors.danger }]} />
                    <Text style={styles.legendText}>From Grid</Text>
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
        marginTop: 10,
        marginBottom: 10,
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
        textAlign: 'right',
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 5,
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
