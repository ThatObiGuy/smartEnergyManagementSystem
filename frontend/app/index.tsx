import { View, StyleSheet } from "react-native";
import HomeInfo from "../components/HomeInfo";
import SystemDiagram from "@/components/SystemDiagram";
import TimeSelector from "@/components/TimeSelector";
import GridIndependance from "@/components/GridIndependance";
import HomeGraph from "@/components/HomeGraph";
import { useState } from "react";


export default function Index() {
    const [selectedTimeframe, setSelectedTimeframe] = useState('Day');

    return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <HomeInfo />
        <SystemDiagram />
        <TimeSelector
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe} />
        <GridIndependance />
        <HomeGraph />

    </View>

  );
}

