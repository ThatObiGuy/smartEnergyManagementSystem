import { colors } from './colours';

export const commonStyles = {
    // Shadow styles
    shadow: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    // Card styles
    card: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 15,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    // Container styles
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    // Text styles
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },

    subtitleText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
    },

    bodyText: {
        fontSize: 14,
        color: colors.textSecondary,
    },

    smallText: {
        fontSize: 12,
        color: colors.textSecondary,
    },

    // Button styles
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    primaryButton: {
        backgroundColor: colors.primary,
    },

    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.white,
    },

    // Layout styles
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    spaceBetween: {
        justifyContent: 'space-between',
    },

    centered: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Spacing
    marginSmall: {
        margin: 8,
    },

    marginMedium: {
        margin: 16,
    },

    marginLarge: {
        margin: 24,
    },

    paddingSmall: {
        padding: 8,
    },

    paddingMedium: {
        padding: 16,
    },

    paddingLarge: {
        padding: 24,
    },
};