import { Text, View } from "react-native";
import HomeInfo from "../components/HomeInfo";
import SystemDiagram from "@/components/SystemDiagram";

export default function Index() {
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
      <Text>Edit app/index.tsx to edit this screen.123456</Text>
    </View>
  );
}
