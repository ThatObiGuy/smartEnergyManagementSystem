import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useSiteContext } from "@/context/SiteContext";
import GrossSavings from "../../components/GrossSavings";
import BatteryAdvice from "../../components/BatteryAdvice";
import PaybackProgress from "../../components/PaybackProgress";

export default function FinReport() {
    const { siteId, installationDate, installationCost } = useSiteContext();
    const [dailySaleToGrid, setDailySaleToGrid] = useState({ lwr: 0, median: 0, upr: 0 });
    const [localInstallationDate, setLocalInstallationDate] = useState('');
    const [localInstallationCost, setLocalInstallationCost] = useState(0);
    const [annualGrossSavings, setAnnualGrossSavings] = useState(0);

    const BACKEND_URL = 'http://192.168.110.44:3000'; // local for now, will change when deploying.

    useEffect(() => {

        if (installationDate) {
            setLocalInstallationDate(installationDate);
        }
        if (installationCost) {
            setLocalInstallationCost(installationCost);
        }

        const fetchFinancialData = async () => {
            try {
                // Fetch daily sale to grid data
                const dailySaleResponse = await fetch(`${BACKEND_URL}/api/finReport/dailySaleToGrid/${siteId}`);
                if (dailySaleResponse.ok) {
                    const dailySaleData = await dailySaleResponse.json();
                    setDailySaleToGrid(dailySaleData.dailySaleToGrid);
                }

            } catch (err) {
                console.error('Error fetching financial data:', err);
            }
        };

        fetchFinancialData();
    }, [siteId]);

    return (
        <View style={styles.container}>
            <GrossSavings />

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
        padding: 10,
    },
    disclaimer: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 10,
    }
});
