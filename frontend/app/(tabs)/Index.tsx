import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import HomeInfo from "@/components/HomeInfo";
import SystemDiagram from "@/components/SystemDiagram";
import TimeSelector from "@/components/TimeSelector";
import GridIndependance from "@/components/GridIndependance";
import HomeGraph from "@/components/HomeGraph";
import { useState, useEffect } from "react";
import { useSiteContext } from "@/context/SiteContext";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/colours';
import { commonStyles } from '@/styles/commonStyles';

export default function Index() {
    const { siteId, setInstallationDate, setInstallationCost } = useSiteContext(); // Context lets us know which site has been selected
    const [currentLocation, setCurrentLocation] = useState('');
    const [dataType, setDataType] = useState(''); // Are we using historical or live data
    const [currentStatusVector, setCurrentStatusVector] = useState('1,1,-1,1');
    const [batterySOC, setBatterySOC] = useState(75);
    const [selectedTimeframe, setSelectedTimeframe] = useState('day');
    const [energyStats, setEnergyStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const BACKEND_URL = 'https://smartenergymanagementsystem.onrender.com';

    // Set location based on site ID
    useEffect(() => {
        const fetchSiteInfo = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${BACKEND_URL}/api/site/${siteId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const siteInfo = await response.json();

                setCurrentLocation(siteInfo.location);
                setEnergyStats(siteInfo.energy_stats);
                setDataType(siteInfo.dataType); // Store the dataType from response

                // Store installation date and cost in context
                if (siteInfo.installation_date) {
                    setInstallationDate(siteInfo.installation_date);
                }
                if (siteInfo.installation_cost) {
                    setInstallationCost(siteInfo.installation_cost);
                }
            } catch (err) {
                console.error('Error fetching site information:', err);
                setCurrentLocation('Error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSiteInfo();
    }, [siteId]);

    // Fetch site status based on dataType
    useEffect(() => {
        const fetchSiteStatus = async () => {
            if (!siteId || !dataType) return;

            try {
                const response = await fetch(`${BACKEND_URL}/api/status/${siteId}?dataType=${dataType}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const statusData = await response.json();

                setCurrentStatusVector(statusData.solar_status);
                setBatterySOC(statusData.soc_percent);

            } catch (err) {
                console.error('Error fetching site status:', err);
            }
        };

        fetchSiteStatus();
    }, [siteId, dataType]);

    // Navigate back to site selection
    const handleReturnToSiteSelection = () => {
        router.replace('/landing');
    };

    // Show loading indicator while fetching site data
    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading site data...</Text>
            </View>
        );
    }

    return (
    <View style={styles.container}>
        {/* Only render HomeInfo when site data is loaded */}
        <HomeInfo
            location={currentLocation}
        />
        <SystemDiagram
            status={currentStatusVector}
            soc={batterySOC}
            dataType={dataType}
        />
        <TimeSelector
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe} />
        <GridIndependance
            timeframe={selectedTimeframe}
            energyStats={energyStats}
        />
        <HomeGraph 
            timeframe={selectedTimeframe}
            energyStats={energyStats}
        />
        <TouchableOpacity 
            style={styles.returnButton}
            onPress={handleReturnToSiteSelection}
        >
            <Ionicons name="home" size={20} color={colors.white} />
            <Text style={styles.returnButtonText}>Return to Site Selection</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        paddingBottom: 60, // Further reduced padding to prevent overflow
        // Removed minHeight to allow container to adapt to content
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: colors.textSecondary,
    },
    returnButton: {
        ...commonStyles.button,
        ...commonStyles.primaryButton,
        flexDirection: 'row',
        position: 'absolute', // Use absolute position which is supported in React Native
        bottom: 30, // Further increased bottom margin to move button even higher up
        left: 10,
        right: 10,
        justifyContent: 'center',
        paddingVertical: 12, // Increased padding to make button more tappable
        zIndex: 1000, // Ensure button is above other elements
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Increased elevation for Android
        borderWidth: 1, // Add border for better visibility
        borderColor: colors.white, // White border for contrast
    },
    returnButtonText: {
        ...commonStyles.buttonText,
        marginLeft: 6,
        fontSize: 14, // Kept reduced font size to make text more compact
        fontWeight: 'bold', // Make text bold for better visibility
    },
});
