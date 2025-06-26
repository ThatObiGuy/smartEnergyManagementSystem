import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { useSiteContext } from "@/context/SiteContext";
import GrossSavings from "../../components/GrossSavings";
import BatteryAdvice from "../../components/BatteryAdvice";
import PaybackProgress from "../../components/PaybackProgress";

export default function FinReport() {
    const { siteId } = useSiteContext();
    const [grossSavings, setGrossSavings] = useState<string>("Loading...");

    const BACKEND_URL = 'http://192.168.110.156:3000'; // local for now, will change when deploying.

    useEffect(() => {
        const fetchGrossSavings = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/finReport/grossSavings/${siteId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const grossSavings = await response.json();

                setGrossSavings(grossSavings.grossSavings.toString());
            } catch (err) {
                console.error('Error fetching gross savings:', err);
                setGrossSavings('Error');
            }
        };

        fetchGrossSavings();
    }, []);

    return (
        <View>
            <GrossSavings
                amount={grossSavings}
            />
            <BatteryAdvice
                batteryCost={2000}
                batteryCapacity={5}
                dailySaleToGrid={{ lwr: 1, median: 4, upr: 59.5 }}
            />
            <PaybackProgress
                installationDate={'2023-01-15'}
                installationCost={15750}
                annualGrossSavings={12000}
            />
        </View>
    );
} // we will need to get the amount from the backend for all these figures, but that may come in time.
