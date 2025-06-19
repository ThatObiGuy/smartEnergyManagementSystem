import { View } from "react-native";
import HomeInfo from "@/components/HomeInfo";
import SystemDiagram from "@/components/SystemDiagram";
import TimeSelector from "@/components/TimeSelector";
import GridIndependance from "@/components/GridIndependance";
import HomeGraph from "@/components/HomeGraph";
import { useState } from "react";

export default function Index() {
    const [currentLocation, setCurrentLocation] = useState('Moate,Westmeath');
    const [currentStatusVector, setCurrentStatusVector] = useState('1,1,-1,1');
    const [batterySOC, setBatterySOC] = useState(75);
    const [selectedTimeframe, setSelectedTimeframe] = useState('Day');
    const [gridIndependence, setGridIndependence] = useState(70);

    return (
    <View>
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
    </View>
  );
}