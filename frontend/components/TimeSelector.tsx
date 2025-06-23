import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/colours';

const TimeSelector = ({ selectedTimeframe, onTimeframeChange, timeframes = ['day', 'week', 'month', 'year', 'total'] }) => {
    return (
        <View style={styles.timeSelector}>
            {timeframes.map((timeframe) => (
                <TouchableOpacity
                    key={timeframe}
                    style={[
                        styles.timeButton,
                        selectedTimeframe === timeframe && styles.timeButtonActive,
                    ]}
                    onPress={() => onTimeframeChange(timeframe)}
                >
                    <Text
                        style={[
                            styles.timeButtonText,
                            selectedTimeframe === timeframe && styles.timeButtonTextActive,
                        ]}
                    >
                        {timeframe}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    timeSelector: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        padding: 4,
        marginBottom: 5,
    },
    timeButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    timeButtonActive: {
        backgroundColor: colors.primary,
    },
    timeButtonText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    timeButtonTextActive: {
        color: colors.white,
        fontWeight: '500',
    },
});

export default TimeSelector;