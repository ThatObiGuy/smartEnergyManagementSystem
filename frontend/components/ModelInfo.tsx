import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useSiteContext } from '@/context/SiteContext';

const ModelInfo = ({ selectedRowIndex = 0 }) => {
    const { siteId } = useSiteContext();
    const [modalVisible, setModalVisible] = React.useState(false);

    // If siteId is neither 1 nor 2, show the modal
    React.useEffect(() => {
        if (siteId !== 1 && siteId !== 2 && siteId !== null) {
            setModalVisible(true);
        } else {
            setModalVisible(false);
        }
    }, [siteId]);

    // Content for each model type
    const modelInfoContent = [
        {
            title: "Rule-based Scheduling",
            content: `Rule-based scheduling, the default for most household invertors, is a straightforward approach to managing solar and battery systems.

• Simple to implement and understand
• Balanced performance between our 3 metrics of interest
• Kerry site shows it can underutilise larger batteries`
        },
        {
            title: "MILP Scheduling: Minimizing Cost",
            content: `Mixed Integer Linear Programming (MILP) for cost minimization finds the most cost-effective schedule for energy usage.

• Maximizes financial savings (or adjusted for other goals)
• Considers time-of-use pricing
• Computationally intensive`
        }
    ];

    // Get the current model info based on selected row
    const currentModelInfo = modelInfoContent[selectedRowIndex] || modelInfoContent[0];

    // Function to render content
    const renderContent = () => {
        const content = currentModelInfo.content;
        return <Text style={styles.informationContent}>{content}</Text>;
    };

    return (
        <View style={styles.informationContainer}>
            <Text style={styles.informationTitle}>{currentModelInfo.title}</Text>
            {renderContent()}

            {/* Modal for unsupported sites */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                            Contact owen.oconnor.2024@mumail.ie for model comparison service on this site.
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    informationContainer: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginBottom: 10,
    },
    informationTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    informationContent: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
        textAlign: 'justify',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
    },
    closeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        marginTop: 10,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ModelInfo
