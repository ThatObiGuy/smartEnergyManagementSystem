import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

interface ProviderSavings {
    tariffId: number;
    providerName: string;
    grossSavings: number;
    costWithoutPV: number;
    actualSpending: number;
}

interface GrossEnergySavingsCardProps {
    amount?: string;
    daysCount?: number;
    providers: ProviderSavings[];
    isLoading: boolean;
    onProviderSelect?: (provider: ProviderSavings) => void;
}

const GrossEnergySavingsCard = ({ amount = "XXX.XX", daysCount, providers, isLoading, onProviderSelect }: GrossEnergySavingsCardProps) => {
    const [selectedProvider, setSelectedProvider] = useState<ProviderSavings | null>(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        // Only set the first provider as selected by default if no provider is currently selected
        if (providers && providers.length > 0 && !selectedProvider) {
            setSelectedProvider(providers[0]);
            // Call the callback with the first provider
            if (onProviderSelect) {
                onProviderSelect(providers[0]);
            }
        }
    }, [providers, onProviderSelect, selectedProvider]);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const selectProvider = (provider: ProviderSavings) => {
        setSelectedProvider(provider);
        setExpanded(false);
        // Call the callback with the selected provider
        if (onProviderSelect) {
            onProviderSelect(provider);
        }
    };

    const getProviderLogo = (providerName: string) => {
        // Map provider names to logo filenames
        const logoMap: { [key: string]: any } = {
            'Electric Ireland': require('@/assets/images/electric-ireland.png'),
            'Bord Gáis Energy': require('@/assets/images/bord-gais-energy.png'),
            'SSE Airtricity': require('@/assets/images/sse-airtricity.png'),
            'Flogas': require('@/assets/images/flogas.png'),
            'Pinergy': require('@/assets/images/pinergy.png'),
            'Energia': require('@/assets/images/energia.png'),
        };

        return logoMap[providerName] || null;
    };

    if (isLoading) {
        return (
            <View style={styles.savingsCard}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading provider savings...</Text>
            </View>
        );
    }

    return (
        <View style={styles.savingsCard}>
            <View style={styles.savingsHeader}>

                <View style={styles.savingsText}>
                    <Text style={styles.savingsLabel}>COMPARE ENERGY PROVIDERS</Text>
                    {daysCount && (
                        <Text style={styles.disclaimer}>
                            The numbers shown are based on {daysCount} days of data & don't include fixed costs.
                        </Text>
                    )}
                </View>
            </View>

            {selectedProvider && (
                <View style={styles.providerInfo}>
                    <TouchableOpacity 
                        style={styles.providerSelector} 
                        onPress={toggleExpanded}
                    >
                        {getProviderLogo(selectedProvider.providerName) && (
                            <Image 
                                source={getProviderLogo(selectedProvider.providerName)} 
                                style={styles.providerLogo} 
                            />
                        )}
                        <Text style={styles.providerName}>{selectedProvider.providerName}</Text>
                        <Text style={styles.dropdownIcon}>{expanded ? '▲' : '▼'}</Text>
                    </TouchableOpacity>

                    {expanded && (
                        <ScrollView style={styles.providerList}>
                            {providers.map((provider) => (
                                <TouchableOpacity 
                                    key={provider.tariffId}
                                    style={[
                                        styles.providerItem,
                                        selectedProvider.tariffId === provider.tariffId && styles.selectedProviderItem
                                    ]}
                                    onPress={() => selectProvider(provider)}
                                >
                                    {getProviderLogo(provider.providerName) && (
                                        <Image 
                                            source={getProviderLogo(provider.providerName)} 
                                            style={styles.providerItemLogo} 
                                        />
                                    )}
                                    <View style={styles.providerItemInfo}>
                                        <Text style={styles.providerItemName}>{provider.providerName}</Text>
                                        <Text style={styles.providerItemSavings}>€ {provider.actualSpending.toFixed(2)}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    <View style={styles.savingsDetails}>
                        <View style={styles.savingsDetailRow}>
                            <Text style={styles.savingsDetailLabel}>Cost without PV/Battery:</Text>
                            <Text style={styles.savingsDetailValue}>€ {selectedProvider.costWithoutPV.toFixed(2)}</Text>
                        </View>
                        <View style={styles.savingsDetailRow}>
                            <Text style={styles.savingsDetailLabel}>Actual spending:</Text>
                            <Text style={styles.savingsDetailValue}>€ {selectedProvider.actualSpending.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.savingsDetailRow, styles.savingsDetailTotal]}>
                            <Text style={styles.savingsDetailTotalLabel}>Gross savings:</Text>
                            <Text style={styles.savingsDetailTotalValue}>€ {selectedProvider.grossSavings.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    savingsCard: {
        marginTop: 25,
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
    savingsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconContainer: {
        marginRight: 15,
    },
    savingsText: {
        flex: 1,
    },
    savingsLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginBottom: 5,
    },
    savingsAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#666',
    },
    providerInfo: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
    },
    providerSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    providerLogo: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 20,
    },
    providerName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    dropdownIcon: {
        fontSize: 16,
        color: '#666',
    },
    providerList: {
        maxHeight: 200,
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
    },
    providerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedProviderItem: {
        backgroundColor: '#f0f0f0',
    },
    providerItemLogo: {
        width: 30,
        height: 30,
        marginRight: 10,
        borderRadius: 15,
    },
    providerItemInfo: {
        flex: 1,
    },
    providerItemName: {
        fontSize: 14,
        fontWeight: '500',
    },
    providerItemSavings: {
        fontSize: 12,
        color: '#666',
    },
    savingsDetails: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    savingsDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    savingsDetailLabel: {
        fontSize: 14,
        color: '#666',
    },
    savingsDetailValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    savingsDetailTotal: {
        marginTop: 5,
        paddingTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    savingsDetailTotalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    savingsDetailTotalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    disclaimer: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#666',
        marginTop: 2,
    },
});

export default GrossEnergySavingsCard;
