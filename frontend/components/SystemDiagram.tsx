import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/colours';
import { commonStyles } from '@/styles/commonStyles';


interface SystemDiagramProps {
  /**
   * Status string representing system state as comma-separated values:
   * Format: "solar,battery,home,grid" where:
   * - solar: 1 = producing, 0 = not producing
   * - battery: 1 = charging, -1 = discharging, 0 = nothing
   * - home: -1 = consuming (always negative since it's always consuming)
   * - grid: 1 = feed out (exporting), -1 = feed in (importing), 0 = nothing
   * Example: "1,1,-1,1" means solar producing, battery charging, home consuming, grid exporting
   */
  status?: string;
  soc?: number; // State of Charge (SOC) of the battery as a percentage (0-100)
  dataType?: string; // Tells us whether data displayed graph is based on live data or simulated from historical data
}

// Flow state constants
const FLOW_PRODUCING = 1;
const FLOW_CONSUMING = -1;
const FLOW_NONE = 0;

    const SystemDiagram = ({ status = '1,1,-1,1', soc = 75, dataType = 'Live' }: SystemDiagramProps) => {
    // Parse the status string into individual flow states
    const [solarFlow, batteryFlow, homeFlow, gridFlow] = status.split(',').map(Number);

    // Animation values for the moving circles
    const [solarToHubValue] = useState(new Animated.Value(0));
    const [hubToBatteryValue] = useState(new Animated.Value(0));
    const [hubToHouseValue] = useState(new Animated.Value(0));
    const [hubToGridValue] = useState(new Animated.Value(0));

    // Start the animations when the component mounts or animation type changes
    useEffect(() => {
        // Reset all animations
        solarToHubValue.setValue(0);
        hubToBatteryValue.setValue(0);
        hubToHouseValue.setValue(0);
        hubToGridValue.setValue(0);

        // Create animations based on flow states
        const solarAnimation = Animated.loop(
            Animated.timing(solarToHubValue, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        );

        const batteryAnimation = Animated.loop(
            Animated.timing(hubToBatteryValue, {
                toValue: 1,
                duration: 2200,
                useNativeDriver: true,
            })
        );

        const houseAnimation = Animated.loop(
            Animated.timing(hubToHouseValue, {
                toValue: 1,
                duration: 2200,
                useNativeDriver: true,
            })
        );

        const gridAnimation = Animated.loop(
            Animated.timing(hubToGridValue, {
                toValue: 1,
                duration: 2200,
                useNativeDriver: true,
            })
        );

        // Start animations based on flow states
        if (solarFlow === FLOW_PRODUCING) {
            solarAnimation.start();
        }

        if (batteryFlow !== FLOW_NONE) {
            batteryAnimation.start();
        }

        if (homeFlow === FLOW_CONSUMING) {
            houseAnimation.start();
        }

        if (gridFlow !== FLOW_NONE) {
            gridAnimation.start();
        }

        // Cleanup function to stop animations when component unmounts or values change
        return () => {
            solarAnimation.stop();
            batteryAnimation.stop();
            houseAnimation.stop();
            gridAnimation.stop();
        };
    }, [solarFlow, batteryFlow, homeFlow, gridFlow, solarToHubValue, hubToBatteryValue, hubToHouseValue, hubToGridValue]);

    // Animation styles for the solar line circle
    const solarCircleStyle = {
        transform: [
            {
                translateY: solarToHubValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 55], // Travel down the height of lineToSolar - can only do this or nothing
                }),
            },
        ],
        opacity: solarFlow === FLOW_PRODUCING ? 1 : 0,
        zIndex: 1, // Lower zIndex to ensure it renders beneath other elements
    };

    // Animation styles for the hub to battery circle
    const hubToBatteryStyle = {
        transform: [
            {
                translateX: hubToBatteryValue.interpolate({
                    inputRange: [0, 1],
                    // Direction based on battery flow: charging goes from hub to battery (left)
                    // discharging goes from battery to hub (right)
                    outputRange: batteryFlow === FLOW_PRODUCING ? [95, -20] : [-20, 95],
                }),
            },
        ],
        opacity: batteryFlow !== FLOW_NONE ? 1 : 0,
        zIndex: 1,
    };

    // Animation styles for the hub to house circle
    const hubToHouseStyle = {
        transform: [
            {
                translateX: hubToHouseValue.interpolate({
                    inputRange: [0, 1],
                    // House is always consuming, so flow is always from hub to house (right)
                    outputRange: [-95, 20],
                }),
            },
        ],
        opacity: homeFlow === FLOW_CONSUMING ? 1 : 0,
        zIndex: 1,
    };

    // Animation styles for the hub to grid circle
    const hubToGridStyle = {
        transform: [
            {
                translateY: hubToGridValue.interpolate({
                    inputRange: [0, 1],
                    // Direction based on grid flow: exporting goes from hub to grid (down)
                    // importing goes from grid to hub (up)
                    outputRange: gridFlow === FLOW_PRODUCING ? [0, 85] : [85, 0],
                }),
            },
        ],
        opacity: gridFlow !== FLOW_NONE ? 1 : 0,
        zIndex: 1,
    };
    return (
        <View style={styles.diagramContainer}>
            {/* Data Type Indicator */}
            <View style={[styles.dataTypeIndicator, dataType === 'Live' ? styles.liveIndicator : null]}>
                <Text style={styles.dataTypeText}>
                    {dataType === 'Live' ? 'LIVE' : 'SIMULATED HISTORICAL'}
                </Text>
            </View>
            {/* Connection Lines */}
            <View style={styles.connectionLines}>
                <View style={[
                    styles.line, 
                    styles.lineToSolar,
                    solarFlow === FLOW_PRODUCING && { backgroundColor: colors.success }
                ]} />
                <View style={[
                    styles.line, 
                    styles.lineToBattery,
                    batteryFlow !== FLOW_NONE && { backgroundColor: colors.info }
                ]} />
                <View style={[
                    styles.line, 
                    styles.lineToHouse,
                    homeFlow === FLOW_CONSUMING && { backgroundColor: colors.warning }
                ]} />
                <View style={[
                    styles.line, 
                    styles.lineToGrid,
                    gridFlow !== FLOW_NONE && { backgroundColor: colors.danger }
                ]} />

                {/* Animated circles on all lines */}
                <Animated.View style={[styles.animatedCircle, styles.solarLineCircle, solarCircleStyle]} />
                <Animated.View style={[styles.animatedCircle, styles.batteryLineCircle, hubToBatteryStyle]} />
                <Animated.View style={[styles.animatedCircle, styles.houseLineCircle, hubToHouseStyle]} />
                <Animated.View style={[styles.animatedCircle, styles.gridLineCircle, hubToGridStyle]} />
            </View>

            {/* Solar Panel */}
            <View style={[styles.iconContainer, styles.solarPanel]}>
                <Ionicons name="grid" size={30} color={solarFlow === FLOW_PRODUCING ? colors.success : colors.textSecondary} />
            </View>

            {/* Battery with SOC indicator */}
            <View style={[styles.iconContainer, styles.battery]}>
                <Ionicons
                    name={batteryFlow === FLOW_PRODUCING ? "battery-charging" : "battery-full"}
                    size={30}
                    color={batteryFlow !== FLOW_NONE ? colors.info : colors.textSecondary}
                />
                <Text style={styles.socText}>{`${soc}%`}</Text>
            </View>


            {/* Central Hub */}
            <View style={styles.centralHub}>
                <Ionicons name="school" size={40} color={colors.textSecondary} />
            </View>

            {/* House */}
            <View style={[styles.iconContainer, styles.house]}>
                <Ionicons name="home" size={30} color={homeFlow === FLOW_CONSUMING ? colors.warning : colors.textSecondary} />
            </View>

            {/* Grid Connection */}
            <View style={[styles.iconContainer, styles.grid]}>
                <Ionicons name="flash" size={30} color={gridFlow !== FLOW_NONE ? colors.danger : colors.textSecondary} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    liveIndicator: {
        backgroundColor: colors.danger,
    },
    dataTypeIndicator: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: colors.lightGray,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        zIndex: 15,
        opacity: 0.85,
    },
    dataTypeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: '500',
    },
    socText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.info,
    },
    diagramContainer: {
        height: 250,
        width: '100%',
        marginVertical: 10,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    animatedCircle: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    solarLineCircle: {
        top: 55, // Same starting position as lineToSolar
        left: '50%',
        marginLeft: -5, // Center the circle (half of width)
        backgroundColor: colors.success, // Green for solar energy
    },
    batteryLineCircle: {
        top: '50%',
        left: 90, // Start at the center hub side
        marginTop: -5, // Center vertically
        backgroundColor: colors.info, // Blue for battery energy
    },
    houseLineCircle: {
        top: '50%',
        right: 90, // Start at the center hub side
        marginTop: -5, // Center vertically
        backgroundColor: colors.warning, // Orange for house energy
    },
    gridLineCircle: {
        bottom: 55,
        top: '50%', // Position at the center hub height
        left: '50%',
        marginLeft: -5, // Center horizontally
        backgroundColor: colors.danger, // Red for grid energy
    },
    iconContainer: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...commonStyles.shadow,
        zIndex: 5, // Higher zIndex to ensure icons render above the animated circle
    },
    centralHub: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...commonStyles.shadow,
        zIndex: 10, // Higher zIndex to ensure it renders above the animated circle
    },
    solarPanel: {
        top: 5,
    },
    battery: {
        left: 40,
        top: '40%',
    },
    house: {
        right: 40,
        top: '40%',
    },
    grid: {
        bottom: 5,
    },
    connectionLines: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    line: {
        position: 'absolute',
        backgroundColor: colors.lightGray,
    },
    lineToSolar: {
        width: 2,
        height: 40,
        top: 55,
        left: '50%',
        marginLeft: -1,
    },
    lineToBattery: {
        width: 85,
        height: 2,
        top: '50%',
        left: 90,
        marginTop: -1,
    },
    lineToHouse: {
        width: 85,
        height: 2,
        top: '50%',
        right: 90,
        marginTop: -1,
    },
    lineToGrid: {
        width: 2,
        height: 40,
        bottom: 55,
        left: '50%',
        marginLeft: -1,
        backgroundColor: colors.lightGray, // Ensure the line is visible
    },
});


export default SystemDiagram;