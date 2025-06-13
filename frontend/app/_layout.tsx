import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
      <Tabs
          screenOptions={{
            headerShown : false,
            tabBarActiveTintColor: 'blue',
          }}
      >
        <Tabs.Screen
            name="(tabs)/FinReport"
            options={{
              title: "Financial Report",
              tabBarIcon: ({ color }) => <FontAwesome size={28} name="euro" color={color} />
            }}
        />
        <Tabs.Screen
            name="Index"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />
            }}
        />
        <Tabs.Screen
            name="(tabs)/ModelComp"
            options={{
              title: "Model Comparison",
              tabBarIcon: ({ color }) => <AntDesign size={28} name="linechart" color={color} />
            }}
        />
      </Tabs>
  );
}
