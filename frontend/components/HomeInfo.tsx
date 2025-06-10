import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/colours';

const homeInfo = ({ temperature = '11°C', weather = 'Sunny', location = 'Co. Westmeath' }) => {
    return (
        <View style={styles.header}>

            <View style={styles.headerLeft}>
                <Ionicons name="sunny" size={24} color={colors.warning} />
                <View>
                    <Text style={styles.temperature}>{temperature}</Text>
                    <Text style={styles.weather}>{weather}</Text>
                </View>
            </View>

            <View style={styles.headerRight}>
                <Text style={styles.location}>{location}</Text>
                <Ionicons name="location" size={24} color={colors.textSecondary} />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        justifyContent: 'flex-start',
    },
    temperature: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    weather: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    location: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        justifyContent: 'flex-end',
    },
});

export default homeInfo;