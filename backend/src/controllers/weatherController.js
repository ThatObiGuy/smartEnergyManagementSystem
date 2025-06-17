import "dotenv/config";

// Get current weather for a specific location
export const getCurrentWeatherByLocation = async (req, res) => {
    try {
        const { location } = req.params;
        const API_KEY = process.env.WEATHER_API_KEY;

        // Validate API key exists
        if (!API_KEY) {
            return res.status(500).json({
                error: 'Weather API key not configured',
                code: 'CONFIG_ERROR'
            });
        }

        // Validate location parameter
        if (!location) {
            return res.status(400).json({
                error: 'Location parameter is required',
                code: 'MISSING_LOCATION'
            });
        }

        // Fetch weather data from external API
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`
        );

        const data = await response.json();

        // Handle API errors
        if (data.error) {
            return res.status(400).json({
                error: data.error.message || 'Weather API error',
                code: data.error.code || 'API_ERROR',
                details: data.error
            });
        }

        // Return successful response
        res.json(data);

    } catch (error) {
        console.error('Weather Controller Error:', error);
        res.status(500).json({
            error: 'Failed to fetch weather data',
            code: 'SERVER_ERROR',
            message: error.message
        });
    }
};
