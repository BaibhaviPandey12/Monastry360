import React, { useState, useEffect } from 'react';
import './WeatherModal.css';
import { getWeatherData } from '../../services/weatherApi';

const WeatherModal = ({ isOpen, onClose, location, monasteryName }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && location) {
            fetchWeatherData();
        }
    }, [isOpen, location]);

    const fetchWeatherData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getWeatherData(location);
            setWeatherData(data);
        } catch (err) {
            setError('Failed to fetch weather data. Please try again.');
            console.error('Weather fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getWeatherIcon = (condition) => {
        const icons = {
            'clear sky': '☀️',
            'few clouds': '🌤️',
            'scattered clouds': '⛅',
            'broken clouds': '☁️',
            'shower rain': '🌦️',
            'rain': '🌧️',
            'thunderstorm': '⛈️',
            'snow': '❄️',
            'mist': '🌫️',
            'overcast clouds': '☁️'
        };
        return icons[condition.toLowerCase()] || '🌤️';
    };

    const getRainProbability = (weather) => {
        if (weather.rain) return Math.min(weather.clouds + 20, 90);
        return Math.max(weather.clouds - 20, 10);
    };

    if (!isOpen) return null;

    return (
        <div className="weather-modal-overlay" onClick={onClose}>
            <div className="weather-modal" onClick={(e) => e.stopPropagation()}>
                <div className="weather-modal-header">
                    <h2>
                        <span className="weather-icon">🌤️</span>
                        Weather Update
                    </h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="weather-modal-body">
                    {loading ? (
                        <div className="weather-loading">
                            <div className="loading-spinner"></div>
                            <p>Fetching live weather data...</p>
                        </div>
                    ) : error ? (
                        <div className="weather-error">
                            <div className="error-icon">⚠️</div>
                            <p>{error}</p>
                            <button onClick={fetchWeatherData} className="retry-btn">
                                Try Again
                            </button>
                        </div>
                    ) : weatherData ? (
                        <>
                            <div className="location-info">
                                <h3>{monasteryName}</h3>
                                <p className="location-text">📍 {location}</p>
                            </div>

                            <div className="current-weather">
                                <div className="current-temp-section">
                                    <div className="main-temp">
                                        <span className="temperature">
                                            {Math.round(weatherData.main.temp)}°C
                                        </span>
                                        <div className="weather-desc">
                                            <span className="weather-icon-main">
                                                {getWeatherIcon(weatherData.weather[0].description)}
                                            </span>
                                            <span className="condition">
                                                {weatherData.weather[0].description}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="feels-like">
                                        Feels like {Math.round(weatherData.main.feels_like)}°C
                                    </div>
                                </div>

                                <div className="temp-range">
                                    <div className="day-night-temps">
                                        <div className="temp-item">
                                            <span className="temp-label">🌅 Day</span>
                                            <span className="temp-value">{Math.round(weatherData.main.temp_max)}°C</span>
                                        </div>
                                        <div className="temp-item">
                                            <span className="temp-label">🌙 Night</span>
                                            <span className="temp-value">{Math.round(weatherData.main.temp_min)}°C</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="weather-details">
                                <div className="weather-grid">
                                    <div className="weather-card">
                                        <div className="weather-card-icon">☀️</div>
                                        <div className="weather-card-label">Sunny</div>
                                        <div className="weather-card-value">
                                            {100 - weatherData.clouds.all}%
                                        </div>
                                    </div>
                                    
                                    <div className="weather-card">
                                        <div className="weather-card-icon">☁️</div>
                                        <div className="weather-card-label">Cloudy</div>
                                        <div className="weather-card-value">
                                            {weatherData.clouds.all}%
                                        </div>
                                    </div>

                                    <div className="weather-card">
                                        <div className="weather-card-icon">🌧️</div>
                                        <div className="weather-card-label">Rain Chance</div>
                                        <div className="weather-card-value">
                                            {getRainProbability(weatherData)}%
                                        </div>
                                    </div>

                                    <div className="weather-card">
                                        <div className="weather-card-icon">💧</div>
                                        <div className="weather-card-label">Humidity</div>
                                        <div className="weather-card-value">
                                            {weatherData.main.humidity}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sun-times">
                                <h4>🌅 Sun Times</h4>
                                <div className="sun-times-grid">
                                    <div className="sun-time-item">
                                        <span className="sun-label">Sunrise</span>
                                        <span className="sun-time">
                                            {formatTime(weatherData.sys.sunrise)}
                                        </span>
                                    </div>
                                    <div className="sun-time-item">
                                        <span className="sun-label">Sunset</span>
                                        <span className="sun-time">
                                            {formatTime(weatherData.sys.sunset)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="additional-info">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Wind Speed</span>
                                        <span className="info-value">{weatherData.wind.speed} m/s</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Pressure</span>
                                        <span className="info-value">{weatherData.main.pressure} hPa</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Visibility</span>
                                        <span className="info-value">{(weatherData.visibility / 1000).toFixed(1)} km</span>
                                    </div>
                                </div>
                            </div>

                            <div className="weather-footer">
                                <p className="last-updated">
                                    Last updated: {new Date().toLocaleTimeString()}
                                </p>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default WeatherModal;