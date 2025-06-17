// Time-of-Use (TOU) Rates in euro cents per kWh (VAT inclusive)
const touRates = {
    peak: {
        startHour: 17,
        endHour: 19,
        rate: 47.89,
    },
    day: {
        startHour: 8,
        endHour: 23,
        rate: 39.77,
    },
    night: {
        startHour: 23,
        endHour: 8,
        rate: 28.63,
    },
};

// This is what I found on the bord gaise website - thought it may be useful to store.