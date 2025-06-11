import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DataTable = ({
                            data = [
                                { model: 'A', independent: '58%', co2Saved: '15kg', costSaved: '€30' },
                                { model: 'B', independent: '80%', co2Saved: '9kg', costSaved: '€20' },
                                { model: 'C', independent: '60%', co2Saved: '10kg', costSaved: '€25' }
                            ],
                            headers = {
                                model: 'Model',
                                independent: 'Independent',
                                co2Saved: 'Co2 Saved',
                                costSaved: 'Cost Saved'
                            }
                        }) => {
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
                            {headers.co2Saved}
                        </Text>
                        <Text style={[styles.cell, styles.headerCell, styles.dataCell]}>
                            {headers.costSaved}
                        </Text>
                    </View>

                    {/* Data Rows */}
                    {data.map((row, index) => (
                        <View key={index} style={[styles.row, styles.dataRow]}>
                            <Text style={[styles.cell, styles.dataCell, styles.modelCell]}>
                                ({index + 1}) {row.model}
                            </Text>
                            <Text style={[styles.cell, styles.dataCell, styles.dataCell]}>
                                {row.independent}
                            </Text>
                            <Text style={[styles.cell, styles.dataCell, styles.dataCell]}>
                                {row.co2Saved}
                            </Text>
                            <Text style={[styles.cell, styles.dataCell, styles.dataCell]}>
                                {row.costSaved}
                            </Text>
                        </View>
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
        paddingVertical: 12,
        paddingHorizontal: 10,
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
        flex: 1,
        minWidth: 80,
        textAlign: 'left',
        paddingLeft: 15,
    },
    dataCell: {
        flex: 1,
        minWidth: 60,
    },
});

export default DataTable;