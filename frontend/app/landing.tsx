import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/colours';
import { commonStyles } from '@/styles/commonStyles';
import { router } from 'expo-router';

export default function Landing() {
  const handleSiteSelection = () => {
    // Navigate to the Index page when site 1 is selected
    router.replace('/Index');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="school" size={80} color={colors.textSecondary} />
        <Text style={styles.title}>Energy Management System</Text>
      </View>

      <View style={styles.siteSelectionContainer}>
        <Text style={styles.siteSelectionTitle}>Select a site:</Text>
        
        <TouchableOpacity 
          style={styles.siteButton} 
          onPress={handleSiteSelection}
        >
          <Ionicons name="business" size={24} color={colors.white} />
          <Text style={styles.siteButtonText}>Site 1</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 20,
    textAlign: 'center',
  },
  siteSelectionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  siteSelectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 20,
  },
  siteButton: {
    ...commonStyles.button,
    ...commonStyles.primaryButton,
    flexDirection: 'row',
    width: '80%',
    marginVertical: 10,
  },
  siteButtonText: {
    ...commonStyles.buttonText,
    marginLeft: 10,
  },
});