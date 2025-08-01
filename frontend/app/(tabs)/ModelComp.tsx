import {View, Text} from 'react-native';
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
        <View>
            <ActiveModel siteId={siteId} />
            <DataTable onRowSelect={handleRowSelect} />
            <ModelInfo selectedRowIndex={selectedRowIndex} />
        </View>
    );
}
