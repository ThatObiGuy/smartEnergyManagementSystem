import {View, Text, StyleSheet} from 'react-native';
import React, { useState, useEffect } from 'react';
import ActiveModel from "../../components/ActiveModel";
import DataTable from "../../components/DataTable";
import ModelInfo from "../../components/ModelInfo";
import { useSiteContext } from '@/context/SiteContext';

export default function ModelComp() {
    const { siteId } = useSiteContext();
    const [selectedRowIndex, setSelectedRowIndex] = useState(0); // Default to first row

    const handleRowSelect = (index) => {
        setSelectedRowIndex(index);
    };

    return (
        <View style={styles.container}>
            <ActiveModel siteId={siteId} selectedRowIndex={selectedRowIndex} />
            <Text style={styles.disclaimer}>
                * Figures based on monthly-mean across a year of data.
            </Text>
            <DataTable siteId={siteId} onRowSelect={handleRowSelect} />
            <ModelInfo selectedRowIndex={selectedRowIndex} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10, // Add padding to prevent content from touching the bottom edge
    },
    disclaimer: {
        fontSize: 10,
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
        marginTop: 0,
        marginBottom: 0,
    }
});
