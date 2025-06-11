import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const PaybackProgressChart = ({
                                  title = "Payback Progress",
                                  subtitle = "Cost Paid vs Single Customer",
                                  chartData = null,
                                  currentPositionPercentage = 60 // Position of "You're here" indicator (0-100)
                              }) => {
    // Default sample data if none provided
    const defaultData = {
        labels: Array.from({ length: 20 }, (_, i) => (i + 1).toString()),
        datasets: [
            {
                data: [
                    -100, -95, -88, -82, -75, -68, -60, -52, -43, -34,
                    -25, -15, -5, 5, 18, 32, 48, 65, 85, 108
                ],
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                strokeWidth: 3,
            },
        ],
    };

    const data = chartData || defaultData;

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '0',
        },
        propsForBackgroundLines: {
            strokeWidth: 1,
            stroke: '#e3e3e3',
        },
    };

    return (
        <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>{title}</Text>
            <Text style={styles.chartSubtitle}>{subtitle}</Text>

            <View style={styles.chartContainer}>
                <LineChart
                    data={data}
                    width={screenWidth - 60}
                    height={200}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withInnerLines={true}
                    withOuterLines={false}
                    withVerticalLines={true}
                    withHorizontalLines={true}
                    fromZero={false}
                />

                {/* Current position indicator */}
                <View style={[
                    styles.currentPositionContainer,
                    { left: `${currentPositionPercentage}%` }
                ]}>
                    <View style={styles.currentPositionArrow} />
                    <Text style={styles.currentPositionText}>You're here</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    chartCard: {
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
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    chartSubtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 20,
    },
    chartContainer: {
        position: 'relative',
    },
    chart: {
        borderRadius: 16,
    },
    currentPositionContainer: {
        position: 'absolute',
        bottom: 40,
        alignItems: 'center',
        transform: [{ translateX: -20 }], // Center the indicator
    },
    currentPositionArrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 15,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#ff4444',
    },
    currentPositionText: {
        fontSize: 12,
        color: '#ff4444',
        fontWeight: '600',
        marginTop: 5,
    },
});

export default PaybackProgressChart;