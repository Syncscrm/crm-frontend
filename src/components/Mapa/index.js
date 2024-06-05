import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import axios from 'axios';

import { useCard } from '../../contexts/cardContext';

const HeatmapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (data.length > 0) {
      const heatLayer = L.heatLayer(data, { radius: 25 });
      heatLayer.addTo(map);

      return () => {
        map.removeLayer(heatLayer);
      };
    }
  }, [data, map]);

  return null;
};

const Mapa = () => {
  const { cards } = useCard();
  const [heatmapData, setHeatmapData] = useState([]);

  console.log(cards)

  const fetchCoordinates = async (city, state) => {
    try {
      console.log(`Buscando coordenadas para ${city}, ${state}`);
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: `${city}, ${state}, Brazil`,
          format: 'json'
        }
      });

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        console.warn(`Nenhuma coordenada encontrada para ${city}, ${state}`);
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = [];

      for (const card of cards) {
        const { city, state, cost_value } = card;
        const coordinates = await fetchCoordinates(city, state);

        if (coordinates) {
          console.log(`Coordenadas encontradas: ${coordinates.latitude}, ${coordinates.longitude} para ${city}, ${state}`);
          data.push([coordinates.latitude, coordinates.longitude, cost_value]);
        }
      }

      setHeatmapData(data);
    };

    fetchData();
  }, [cards]);

  return (
    <MapContainer center={[-15.77972, -47.92972]} zoom={4} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <HeatmapLayer data={heatmapData} />
    </MapContainer>
  );
};

export default Mapa;
