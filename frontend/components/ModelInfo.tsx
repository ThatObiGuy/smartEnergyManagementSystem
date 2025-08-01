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
            content: `Rule-based scheduling is a straightforward approach to managing solar and battery systems. 

Pros:
• Simple to implement and understand
• Low computational requirements
• Predictable behavior
• Works well with existing systems
• Can be easily adjusted based on user preferences

Cons:
• Less efficient than optimization-based approaches
• Cannot adapt to complex scenarios
• May miss opportunities for cost savings
• Limited ability to consider multiple objectives simultaneously
• Requires manual tuning of rules`
        },
        {
            title: "MILP Scheduling: Minimizing Cost",
            content: `Mixed Integer Linear Programming (MILP) for cost minimization is an optimization approach that finds the most cost-effective schedule for energy usage.

Objective Function:
[Space for objective function]

Pros:
• Maximizes financial savings
• Considers time-of-use electricity pricing
• Can incorporate forecasts for better planning
• Optimizes battery charging/discharging cycles
• Provides provably optimal solutions

Cons:
• Computationally intensive
• Requires accurate forecasting
• May prioritize cost over environmental impact
• More complex to implement and maintain
• Depends on accurate pricing information`
        },
        {
            title: "MILP Scheduling: Maximizing CO2 Reduction",
            content: `Mixed Integer Linear Programming (MILP) for CO2 reduction prioritizes environmental impact over financial considerations.

Objective Function:
[Space for objective function]

Pros:
• Maximizes environmental benefits
• Reduces carbon footprint
• Aligns with sustainability goals
• Can incorporate grid carbon intensity data
• Optimizes for clean energy usage

Cons:
• May result in higher electricity costs
• Requires accurate carbon intensity data
• Computationally intensive
• More complex to implement and maintain
• Benefits may be less tangible to users`
        }
    ];

    // Get the current model info based on selected row
    const currentModelInfo = modelInfoContent[selectedRowIndex] || modelInfoContent[0];

    // Function to render content with special formatting for objective function
    const renderContent = () => {
        const content = currentModelInfo.content;

        // For MILP models, we want to format the objective function section
        if (selectedRowIndex === 1 || selectedRowIndex === 2) {
            const parts = content.split('[Space for objective function]');

            return (
                <>
                    <Text style={styles.informationContent}>{parts[0]}</Text>
                    <View style={styles.objectiveFunction}>
                        <Text style={{fontStyle: 'italic', textAlign: 'center'}}>
                            Space reserved for objective function
                        </Text>
                    </View>
                    <Text style={styles.informationContent}>{parts[1]}</Text>
                </>
            );
        }

        // For rule-based model, just render the content normally
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
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 20,
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
    objectiveFunction: {
        fontSize: 14,
        fontStyle: 'italic',
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
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
