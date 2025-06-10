import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/colours';
import { commonStyles } from '@/styles/commonStyles';

const systemDiagram = () => {
    return (
        <View style={styles.diagramContainer}>
            
            {/* Solar Panel */}
            <View style={[styles.iconContainer, styles.solarPanel]}>
                <Ionicons name="grid" size={30} color={colors.success} />
            </View>

            {/* Battery */}
            <View style={[styles.iconContainer, styles.battery]}>
                <Ionicons name="battery-full" size={30} color={colors.info} />
            </View>

            {/* Central Hub */}
            <View style={styles.centralHub}>
                <Ionicons name="nuclear" size={40} color={colors.textSecondary} />
            </View>

            {/* House */}
            <View style={[styles.iconContainer, styles.house]}>
                <Ionicons name="home" size={30} color={colors.warning} />
            </View>

            {/* Grid Connection */}
            <View style={[styles.iconContainer, styles.grid]}>
                <Ionicons name="flash" size={30} color={colors.danger} />
            </View>

            {/* Connection Lines */}
            <View style={styles.connectionLines}>
                <View style={[styles.line, styles.lineToSolar]} />
                <View style={[styles.line, styles.lineToBattery]} />
                <View style={[styles.line, styles.lineToHouse]} />
                <View style={[styles.line, styles.lineToGrid]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    diagramContainer: {
        height: 250,
        width: '100%',
        marginVertical: 20,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
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
    },
    centralHub: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...commonStyles.shadow,
    },
    solarPanel: {
        top: 20,
    },
    battery: {
        left: 40,
        top: 75,
    },
    house: {
        right: 40,
        top: 75,
    },
    grid: {
        bottom: 20,
    },
    connectionLines: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    line: {
        position: 'absolute',
        backgroundColor: colors.border,
    },
    lineToSolar: {
        width: 2,
        height: 30,
        top: 50,
        left: '50%',
        marginLeft: -1,
    },
    lineToBattery: {
        width: 30,
        height: 2,
        top: '50%',
        left: 70,
        marginTop: -1,
    },
    lineToHouse: {
        width: 30,
        height: 2,
        top: '50%',
        right: 70,
        marginTop: -1,
    },
    lineToGrid: {
        width: 2,
        height: 30,
        bottom: 50,
        left: '50%',
        marginLeft: -1,
    },
});


export default systemDiagram;