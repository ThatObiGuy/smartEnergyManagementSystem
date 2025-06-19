import { View } from "react-native";
import HomeInfo from "../components/HomeInfo";
import SystemDiagram from "@/components/SystemDiagram";
import TimeSelector from "@/components/TimeSelector";
import GridIndependance from "@/components/GridIndependance";
import HomeGraph from "@/components/HomeGraph";
import { useState } from "react";

export default function Index() {
    const [currentStatusVector, setCurrentStatusVector] = useState('1,1,-1,1');
    const [batterySOC, setBatterySOC] = useState(75);
    const [selectedTimeframe, setSelectedTimeframe] = useState('Day');

    return (
    <View>
        <HomeInfo />
        <SystemDiagram status={currentStatusVector} soc={batterySOC} />
        <TimeSelector
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe} />
        <GridIndependance />
        <HomeGraph />
    </View>
  );
}

