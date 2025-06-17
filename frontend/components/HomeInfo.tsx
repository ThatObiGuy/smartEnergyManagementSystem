import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/colours';

interface WeatherData {
  location: {
    name: string;
    region: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

const HomeInfo = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const BACKEND_URL = 'http://149.157.43.90:3000';

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/weather/current/Moate,Westmeath`
                );

                // Debugging
                console.log(`${BACKEND_URL}/api/weather/current/Moate,Westmeath`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.error) {
                    throw new Error(data.error.message || 'Weather API error');
                }

                setWeatherData(data);
                setError(null);

            } catch (err) {
                console.log('Weather fetch error:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
                setWeatherData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    // Show loading indicator while fetching data
    if (loading) {
        return (
            <View style={[styles.header, styles.loadingContainer]}>
                <ActivityIndicator size="small" color={colors.textPrimary} />
                <Text style={styles.loadingText}>Loading weather...</Text>
            </View>
        );
    }

    // Show error state if data failed to load
    if (error || !weatherData) {
        return (
            <View style={styles.header}>
                <View style={styles.errorContainer}>
                    <Ionicons name="cloud-offline" size={24} color={colors.textSecondary} />
                    <Text style={styles.errorText}>
                        {error || 'Weather data unavailable'}
                    </Text>
                </View>
            </View>
        );
    }

    // Only access weatherData properties after confirming it exists
    const temperature = `${weatherData.current.temp_c}°C`;
    const weather = weatherData.current.condition.text;
    const location = `${weatherData.location.name}, ${weatherData.location.region}`;
    const iconUrl = `https:${weatherData.current.condition.icon}`;

    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Image 
                    source={{ uri: iconUrl }} 
                    style={styles.weatherIcon}
                    resizeMode="contain"
                />
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
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    loadingContainer: {
        justifyContent: 'center',
        gap: 10,
    },
    loadingText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        flex: 1,
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
    weatherIcon: {
        width: 24,
        height: 24,
    },
});

export default HomeInfo;