import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const DataTable = ({
                            siteId = 1,
                            headers = {
                                model: 'Model',
                                independent: 'Independence',
                                co2Produced: 'Co2 Produced',
                                cost: 'Cost'
                            },
                            onRowSelect = () => {}
                        }) => {
    // Define data based on siteId
    const site1Data = [
        { model: 'Rule-based', independent: '39.66%', co2Produced: '537.05kg', cost: '€94.53' },
        { model: 'MILP', independent: '33.64%', co2Produced: '568.01kg', cost: '€72.99' }
    ];

    const site2Data = [
        { model: 'Rule-based', independent: '19.73%', co2Produced: '191.1kg', cost: '€173.83' },
        { model: 'MILP', independent: '23.19%', co2Produced: '183.8kg', cost: '€157.44' }
    ];

    let data;
    switch (siteId) {
        case 1:
            data = site1Data;
            break;
        case 2:
            data = site2Data;
            break;
    } // Easier to add more in the future

    const [selectedRowIndex, setSelectedRowIndex] = useState(0); // Default to first row selected

    const handleRowPress = (index) => {
        setSelectedRowIndex(index);
        onRowSelect(index);
    };
    return (
        <View style={styles.tableContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.table}>
                    {/* Header Row */}
                    <View style={[styles.row, styles.headerRow]}>
                        <Text style={[styles.cell, styles.headerCell, styles.modelCell]}>
                            {headers.model}
                        </Text>
                        <Text style={[styles.cell, styles.headerCell, styles.dataCell]}>
                            {headers.independent}
                        </Text>
                        <Text style={[styles.cell, styles.headerCell, styles.dataCell]}>
                            {headers.co2Produced}
                        </Text>
                        <Text style={[styles.cell, styles.headerCell, styles.dataCell]}>
                            {headers.cost}
                        </Text>
                    </View>

                    {/* Data Rows */}
                    {data.map((row, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={[
                                styles.row, 
                                styles.dataRow,
                                selectedRowIndex === index && styles.selectedRow
                            ]}
                            onPress={() => handleRowPress(index)}
                        >
                            <Text style={[
                                styles.cell, 
                                styles.dataCell, 
                                styles.modelCell,
                                selectedRowIndex === index && styles.selectedText
                            ]}>
                                {row.model}
                            </Text>
                            <Text style={[
                                styles.cell, 
                                styles.dataCell, 
                                styles.dataCell,
                                selectedRowIndex === index && styles.selectedText,
                                siteId === 1 && index === 1 && styles.redText, // Red text for MILP independence on site 1
                                siteId === 2 && index === 1 && styles.greenText // Green text for MILP independence on site 2
                            ]}>
                                {row.independent}
                            </Text>
                            <Text style={[
                                styles.cell, 
                                styles.dataCell, 
                                styles.dataCell,
                                selectedRowIndex === index && styles.selectedText,
                                siteId === 1 && index === 1 && styles.redText, // Red text for MILP CO2 produced on site 1
                                siteId === 2 && index === 1 && styles.greenText // Green text for MILP CO2 produced on site 2
                            ]}>
                                {row.co2Produced}
                            </Text>
                            <Text style={[
                                styles.cell, 
                                styles.dataCell, 
                                styles.dataCell,
                                selectedRowIndex === index && styles.selectedText,
                                index === 1 && styles.greenText // Green text for MILP cost on both sites
                            ]}>
                                {row.cost}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    tableContainer: {
        backgroundColor: '#ffffff',
        marginHorizontal: 5,
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    selectedRow: {
        backgroundColor: '#e6f7ff', // Light blue background for selected row
    },
    selectedText: {
        color: '#1890ff', // Blue text for selected row
        fontWeight: '500',
    },
    redText: {
        color: '#c62026',
    },
    greenText: {
        color: '#4CAF50',
    },
    table: {
        minWidth: '100%',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerRow: {
        backgroundColor: '#f8f8f8',
    },
    dataRow: {
        backgroundColor: '#ffffff',
    },
    cell: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        textAlign: 'center',
        fontSize: 14,
    },
    headerCell: {
        fontWeight: '500',
        color: '#333',
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',
    },
    dataCell: {
        color: '#666',
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',
    },
    modelCell: {
        flex: 1.5,
        minWidth: 90,
        textAlign: 'left',
        paddingLeft: 10,
    },
    dataCell: {
        flex: 1,
        minWidth: 60,
    },
});

export default DataTable;
