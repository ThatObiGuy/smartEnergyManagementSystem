import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useSiteContext } from "@/context/SiteContext";
import GrossSavings from "../../components/GrossSavings";
import BatteryAdvice from "../../components/BatteryAdvice";
import PaybackProgress from "../../components/PaybackProgress";

export default function FinReport() {
    const { siteId } = useSiteContext();
    const [dailySaleToGrid, setDailySaleToGrid] = useState({ lwr: 1, median: 4, upr: 59.5 });
    const [installationDate, setInstallationDate] = useState('2023-01-15');
    const [installationCost, setInstallationCost] = useState(15750);
    const [annualGrossSavings, setAnnualGrossSavings] = useState(12000);

    const BACKEND_URL = 'http://149.157.114.162:3000'; // local for now, will change when deploying.

    useEffect(() => {
        const fetchFinancialData = async () => {
            try {
                // Fetch daily sale to grid data
                const dailySaleResponse = await fetch(`${BACKEND_URL}/api/finReport/dailySaleToGrid/${siteId}`);
                if (dailySaleResponse.ok) {
                    const dailySaleData = await dailySaleResponse.json();
                    setDailySaleToGrid(dailySaleData.dailySaleToGrid);
                }

                // Fetch installation date
                const installDateResponse = await fetch(`${BACKEND_URL}/api/finReport/installationDate/${siteId}`);
                if (installDateResponse.ok) {
                    const installDateData = await installDateResponse.json();
                    setInstallationDate(installDateData.installDate);
                }

                // Fetch installation cost
                const installCostResponse = await fetch(`${BACKEND_URL}/api/finReport/installationCost/${siteId}`);
                if (installCostResponse.ok) {
                    const installCostData = await installCostResponse.json();
                    setInstallationCost(installCostData.installCost);
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
                installationDate={installationDate}
                installationCost={installationCost}
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
