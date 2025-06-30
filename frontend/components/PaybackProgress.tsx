import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/colours';
import { Ionicons } from '@expo/vector-icons';

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

    // Calculate payback period in years
    const paybackPeriodYears = annualGrossSavings > 0
        ? installationCost / annualGrossSavings
        : 0;

    // Calculate years since installation for current position marker
    const yearsSinceInstallation = installationDate
        ? (new Date().getTime() - new Date(installationDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
        : 0;

    // Generate years for x-axis starting from installation year
    const installationYear = new Date(installationDate).getFullYear();
    const totalYears = Math.ceil(paybackPeriodYears) + 3;
    const years = Array.from({ length: totalYears }, (_, i) => installationYear + i);

    // Generate cashflow data for each year
    const cashflowData = years.map((year, index) => {
        // Negative at first (installation cost), then gradually becomes positive
        return index === 0 
            ? -installationCost 
            : -installationCost + (annualGrossSavings * index);
    });

    // Find max absolute value for scaling
    const maxAbsValue = Math.abs(Math.min(...cashflowData));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payback Progress</Text>

            <View style={styles.infoContainer}>
                <View style={styles.infoColumn}>
                    <View style={styles.propContainer}>
                        <Text style={styles.propLabel}>Installation Date:</Text>
                        <Text style={styles.propValue}>{formattedDate}</Text>
                    </View>
                    <View style={styles.propContainer}>
                        <Text style={styles.propLabel}>Installation Cost:</Text>
                        <Text style={styles.propValue}>€{installationCost.toLocaleString()}</Text>
                    </View>
                </View>
                <View style={styles.infoColumn}>
                    <View style={styles.propContainer}>
                        <Text style={styles.propLabel}>Annual Gross Savings:</Text>
                        <Text style={styles.propValue}>€{annualGrossSavings.toLocaleString()}</Text>
                    </View>
                    <View style={styles.propContainer}>
                        <Text style={styles.propLabel}>Estimated Payback Period:</Text>
                        <Text style={styles.propValue}>{paybackPeriodYears.toFixed(1)} years</Text>
                    </View>
                </View>
            </View>

            {/* Bar Chart */}
            <View style={styles.chartContainer}>

                {/* Y-axis label */}
                <View style={styles.yAxisLabel}>
                    <Text style={styles.axisText}>Cashflow (€)</Text>
                </View>

                {/* Chart area */}
                <View style={styles.chartArea}>
                    {/* Zero line */}
                    <View style={styles.zeroLine} />

                    {/* Bars */}
                    <View style={styles.barsContainer}>
                        {cashflowData.map((value, index) => {
                            // Calculate height as percentage of max value (half the available space)
                            const barHeight = Math.abs(value) / maxAbsValue * 50;
                            const isNegative = value < 0;

                            return (
                                <View key={index} style={styles.barColumn}>
                                    <View style={styles.barWrapper}>
                                        {/* Top half - for positive values */}
                                        <View style={styles.barHalf}>
                                            {!isNegative && (
                                                <View 
                                                    style={[
                                                        styles.bar, 
                                                        styles.positiveBar,
                                                        { 
                                                            height: `${barHeight}%`,
                                                            backgroundColor: colors.success
                                                        }
                                                    ]} 
                                                />
                                            )}
                                        </View>

                                        {/* Bottom half - for negative values */}
                                        <View style={styles.barHalf}>
                                            {isNegative && (
                                                <View 
                                                    style={[
                                                        styles.bar, 
                                                        styles.negativeBar,
                                                        { 
                                                            height: `${barHeight}%`,
                                                            backgroundColor: colors.danger
                                                        }
                                                    ]} 
                                                />
                                            )}
                                        </View>
                                    </View>
                                    <Text style={styles.barLabel}>{years[index]}</Text>
                                </View>
                            );
                        })}

                        {/* Progress indicator arrow */}
                        {yearsSinceInstallation > 0 && (
                            <View 
                                style={[
                                    styles.progressArrow,
                                    { 
                                        left: `${Math.min((yearsSinceInstallation / totalYears) * 100, 100 - 5)}%` 
                                    }
                                ]}
                            >
                                <Ionicons name="arrow-down" size={24} color={colors.danger} />
                                <Text style={styles.currentLabel}>Current</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* X-axis label */}
                <View style={styles.xAxisLabel}>
                    <Text style={styles.axisText}>Years</Text>
                </View>
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
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    infoColumn: {
        flex: 1,
        paddingHorizontal: 3,
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
    chartContainer: {
        marginTop: 10,
        height: 100,
    },
    chartArea: {
        flex: 1,
        flexDirection: 'row',
        position: 'relative',
    },
    yAxisLabel: {
        position: 'absolute',
        left: -30,
        top: '50%',
        transform: [{ rotate: '-90deg' }],
    },
    xAxisLabel: {
        alignItems: 'center',
        marginTop: 5,
    },
    axisText: {
        fontSize: 12,
        color: '#666',
    },
    zeroLine: {
        position: 'absolute',
        left: 12,
        right: 12,
        top: '40%',
        height: 0.5,
        backgroundColor: colors.gray,
        zIndex: 10,
    },
    barsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        position: 'relative',
    },
    barColumn: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
    },
    barWrapper: {
        flex: 1,
        width: 20,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    barHalf: {
        height: '50%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bar: {
        width: '100%',
        borderRadius: 2,
    },
    positiveBar: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 0,
    },
    negativeBar: {
        alignSelf: 'flex-start',
        position: 'absolute',
        top: 0,
    },
    barLabel: {
        fontSize: 10,
        color: '#666',
        marginTop: 2,
        transform: [{ rotate: '45deg' }],
        textAlign: 'center',
    },
    progressArrow: {
        position: 'absolute',
        top: -30,
        alignItems: 'center',
    },
    currentLabel: {
        fontSize: 10,
        color: colors.danger,
        fontWeight: 'bold',
    },
});

export default PaybackProgressChart;
