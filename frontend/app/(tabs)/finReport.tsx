import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useSiteContext } from "@/context/SiteContext";
import GrossSavings from "../../components/GrossSavings";
import BatteryAdvice from "../../components/BatteryAdvice";
import PaybackProgress from "../../components/PaybackProgress";

interface ProviderSavings {
    tariffId: number;
    providerName: string;
    grossSavings: number;
    costWithoutPV: number;
    actualSpending: number;
}

export default function FinReport() {
    const { siteId, installationDate, installationCost } = useSiteContext();
    const [dailySaleToGrid, setDailySaleToGrid] = useState({ lwr: 0, median: 0, upr: 0 });
    const [localInstallationDate, setLocalInstallationDate] = useState('');
    const [localInstallationCost, setLocalInstallationCost] = useState(0);
    const [daysCount, setDaysCount] = useState<number | undefined>(undefined);
    const [providers, setProviders] = useState<ProviderSavings[]>([]);
    const [isLoadingProviders, setIsLoadingProviders] = useState(true);
    const [annualGrossSavings, setAnnualGrossSavings] = useState(0);
    const [selectedProvider, setSelectedProvider] = useState<ProviderSavings | null>(null);

    const BACKEND_URL = 'https://smartenergymanagementsystem.onrender.com';

    // Handler for provider selection
    const handleProviderSelect = (provider: ProviderSavings) => {
        setSelectedProvider(provider);
    };

    // Calculate annual gross savings when selected provider or days count changes
    useEffect(() => {
        if (selectedProvider && daysCount) {
            // Calculate annual gross savings: ((gross savings) / daysCount) * 365
            const annual = (selectedProvider.grossSavings / daysCount) * 365;
            setAnnualGrossSavings(annual);
        }
    }, [selectedProvider, daysCount]);

    useEffect(() => {
        if (installationDate) {
            setLocalInstallationDate(installationDate);
        }
        if (installationCost) {
            setLocalInstallationCost(installationCost);
        }

        const fetchFinancialData = async () => {
            try {
                // Fetch daily sale to grid data for the battery advice component
                const dailySaleResponse = await fetch(`${BACKEND_URL}/api/finReport/dailySaleToGrid/${siteId}`);
                if (dailySaleResponse.ok) {
                    const dailySaleData = await dailySaleResponse.json();
                    setDailySaleToGrid(dailySaleData.dailySaleToGrid);
                }

                // Fetch runtime data (days count) for the gross savings and payback period components
                const runtimeResponse = await fetch(`${BACKEND_URL}/api/finReport/runTime/${siteId}`);
                if (runtimeResponse.ok) {
                    const runtimeData = await runtimeResponse.json();
                    setDaysCount(runtimeData.daysCount);
                }

                // Fetch provider savings data for the gross savings and payback period components
                setIsLoadingProviders(true);
                const providerSavingsResponse = await fetch(`${BACKEND_URL}/api/finReport/grossSavingsAllProviders/${siteId}`);
                if (providerSavingsResponse.ok) {
                    const providerSavingsData = await providerSavingsResponse.json();
                    setProviders(providerSavingsData.providers);
                }
                setIsLoadingProviders(false);

            } catch (err) {
                console.error('Error fetching financial data:', err);
                setIsLoadingProviders(false);
            }
        };

        fetchFinancialData();
    }, [siteId]);

    return (
        <View style={styles.container}>
            <GrossSavings
                daysCount={daysCount}
                providers={providers}
                isLoading={isLoadingProviders}
                onProviderSelect={handleProviderSelect}
            />

            <BatteryAdvice
                batteryCost={2000}
                batteryCapacity={5}
                dailySaleToGrid={dailySaleToGrid}
            />

            <PaybackProgress
                installationDate={localInstallationDate}
                installationCost={localInstallationCost}
                annualGrossSavings={annualGrossSavings}
            />

            <Text style={styles.disclaimer}>
                * Prices based on Irish rural smart meter tariffs with no consideration for discounts.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    disclaimer: {
        fontSize: 10,
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
        marginTop: 2,
        marginBottom: 2,
    }
});
