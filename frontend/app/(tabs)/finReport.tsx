import {View, Text} from 'react-native';
import GrossSavings from "../../components/GrossSavings";
import BatteryAdvice from "../../components/BatteryAdvice";
import PaybackProgress from "../../components/PaybackProgress";

export default function finReport() {
    return (
        <View>
            <GrossSavings />
            <BatteryAdvice />
            <PaybackProgress />
        </View>
    );
}