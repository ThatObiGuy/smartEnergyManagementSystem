import {View, Text} from 'react-native';
import ActiveModel from "../../components/ActiveModel";
import DataTable from "../../components/DataTable";
import ModelInfo from "../../components/ModelInfo";

export default function modelComp() {
    return (
        <View>
            <ActiveModel />
            <DataTable />
            <ModelInfo />
        </View>
    );
}