import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const tanzaniaRegions = [
    {
        name: "Dar es Salaam",
        wards: ["Ilala", "Kinondoni", "Temeke", "Ubungo", "Kigamboni"],
        center: [-6.8, 39.28],
        zoom: 12
    },
    {
        name: "Arusha",
        wards: ["Arusha Urban", "Arusha Rural", "Meru", "Karatu", "Monduli", "Longido", "Ngorongoro"],
        center: [-3.386925, 36.682993],
        zoom: 10
    },
    {
        name: "Kilimanjaro",
        wards: ["Moshi Urban", "Moshi Rural", "Hai", "Rombo", "Siha", "Mwanga", "Same"],
        center: [-3.375, 37.343],
        zoom: 10
    },
    {
        name: "Dodoma",
        wards: ["Dodoma Urban", "Dodoma Rural", "Bahi", "Chamwino", "Chemba", "Kondoa", "Kongwa", "Mpwapwa"],
        center: [-6.172, 35.739],
        zoom: 10
    },
    {
        name: "Mwanza",
        wards: ["Nyamagana", "Ilemela", "Kwimba", "Magu", "Misungwi", "Sengerema", "Ukerewe"],
        center: [-2.516, 32.917],
        zoom: 10
    },
    {
        name: "Mbeya",
        wards: ["Mbeya Urban", "Mbeya Rural", "Chunya", "Kyela", "Mbarali", "Rungwe", "Busokelo"],
        center: [-8.909, 33.460],
        zoom: 10
    },
    {
        name: "Morogoro",
        wards: ["Morogoro Urban", "Morogoro Rural", "Kilosa", "Kilombero", "Ulanga", "Mvomero", "Malinyi", "Gairo"],
        center: [-6.827, 37.663],
        zoom: 10
    },
    {
        name: "Tanga",
        wards: ["Tanga Urban", "Tanga Rural", "Handeni", "Kilindi", "Korogwe", "Lushoto", "Mkinga", "Muheza", "Pangani"],
        center: [-5.068, 39.098],
        zoom: 10
    },
    {
        name: "Mara",
        wards: ["Musoma Urban", "Musoma Rural", "Bunda", "Butiama", "Rorya", "Serengeti", "Tarime"],
        center: [-1.663, 34.473],
        zoom: 10
    },
    {
        name: "Iringa",
        wards: ["Iringa Urban", "Iringa Rural", "Kilolo", "Mufindi"],
        center: [-7.770, 35.693],
        zoom: 10
    },
    // Add more regions and wards here...
];

const FaultReportForm = () => {
    const [formData, setFormData] = useState({
        description: '',
        region: '',
        ward: '',
        faultType: ''
    });
    const [lng, setLng] = useState(null); // State for longitude
    const [lat, setLat] = useState(null); // State for latitude
    const [wards, setWards] = useState([]);
    const [mapCenter, setMapCenter] = useState([-6.369028, 34.888822]); // Default center for Tanzania view
    const [mapZoom, setMapZoom] = useState(6); // Default zoom level for Tanzania view

    const faultTypes = [
        "Meter Problem",
        "Transformer Fault",
        "Pipeline Fault",
        "Power Outage",
        "Other"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'region') {
            const selectedRegion = tanzaniaRegions.find(region => region.name === value);
            if (selectedRegion) {
                setWards(selectedRegion.wards);
                setFormData({ ...formData, ward: '' }); // reset ward selection
                setMapCenter(selectedRegion.center); // Update map center
                setMapZoom(selectedRegion.zoom); // Update map zoom
            }
        } else if (name === 'ward') {
            // You can handle ward specific changes here if needed
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const reportData = {
            ...formData,
            location: { lng, lat }
        };
        await axios.post('/api/fault-reports/', reportData);
    };

    const LocationMarker = () => {
        const map = useMapEvents({
            click(e) {
                setLng(e.latlng.lng);
                setLat(e.latlng.lat);
            },
        });

        return lng !== null && lat !== null ? (
            <Marker position={[lat, lng]}>
                <Popup>You selected coordinates: <br />Latitude: {lat}<br />Longitude: {lng}</Popup>
            </Marker>
        ) : null;
    };

    return (
        <div className="flex h-screen">
            <div className="w-80 p-6 bg-gray-100 shadow-lg overflow-y-auto">
                <h1 className="text-xl font-bold mb-4">Tanzania TANESCO Report Faults System</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        name="description"
                        onChange={handleChange}
                        placeholder="Description"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    ></textarea>
                    <select
                        name="faultType"
                        value={formData.faultType}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">Select Fault Type</option>
                        {faultTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                    <select
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">Select Region</option>
                        {tanzaniaRegions.map((region, index) => (
                            <option key={index} value={region.name}>{region.name}</option>
                        ))}
                    </select>
                    <select
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">Select Ward</option>
                        {wards.map((ward, index) => (
                            <option key={index} value={ward}>{ward}</option>
                        ))}
                    </select>
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Report Fault</button>
                </form>
            </div>
            <div className="flex-grow">
                <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker />
                </MapContainer>
            </div>
        </div>
    );
};

export default FaultReportForm;
