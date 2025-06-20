import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
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
    const { siteId } = useSiteContext(); // Context lets us know which site has been selected
    const [currentLocation, setCurrentLocation] = useState('');
    const [currentStatusVector, setCurrentStatusVector] = useState('1,1,-1,1');
    const [batterySOC, setBatterySOC] = useState(75);
    const [selectedTimeframe, setSelectedTimeframe] = useState('Day');
    const [gridIndependence, setGridIndependence] = useState(70);

    const BACKEND_URL = 'http://149.157.43.90:3000';

    // Set location based on site ID
    useEffect(() => {
        const fetchSiteInfo = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/site/${siteId}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const siteInfo = await response.json();

                setCurrentLocation(siteInfo.location);
            } catch (err) {
                console.error('Error fetching site information:', err);
                setCurrentLocation('Error');
            }
        };

        fetchSiteInfo();
    }, [siteId]);

    // Navigate back to site selection
    const handleReturnToSiteSelection = () => {
        router.replace('/landing');
    };

    return (
    <View style={styles.container}>
        <HomeInfo
            location={currentLocation}
        />
        <SystemDiagram
            status={currentStatusVector}
            soc={batterySOC}
        />
        <TimeSelector
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe} />
        <GridIndependance
            percentage={gridIndependence}
        />
        <HomeGraph />

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
        paddingBottom: 70, // Add padding to make room for the return button
    },
    returnButton: {
        ...commonStyles.button,
        ...commonStyles.primaryButton,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        left: 20,
        right: 20,
        justifyContent: 'center',
    },
    returnButtonText: {
        ...commonStyles.buttonText,
        marginLeft: 10,
    },
});
