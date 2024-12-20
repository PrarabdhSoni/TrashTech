import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import axios from "axios";
import Select from "react-select";
import { getDistance } from "geolib";
import { useParams, useNavigate } from 'react-router-dom';
import './WastePickUp.css'
import { Home, DoorOpen, Truck, MapPin, CreditCard, Building} from 'lucide-react';
import L from 'leaflet';



// const outlets = [
//   { name: "Delhi Outlet", lat: 28.7041, lng: 77.1025 },
//   { name: "Mumbai Outlet", lat: 19.076, lng: 72.8777 },
//   { name: "Bangalore Outlet", lat: 12.9716, lng: 77.5946 },
// ];

const outlets = [
  { name: "Delhi Outlet", lat: 28.7041, lng: 77.1025 },
  { name: "Visakhapatnam Midpoint", lat: 17.6868, lng: 83.2185 },
  { name: "Vijayawada Midpoint", lat: 16.5062, lng: 80.6480 },
  { name: "Guntur Midpoint", lat: 16.3067, lng: 80.4365 },
  { name: "Nellore Midpoint", lat: 14.4426, lng: 79.9865 },
  { name: "Tirupati Midpoint", lat: 13.6288, lng: 79.4192 },
  { name: "Itanagar Midpoint", lat: 27.0844, lng: 93.6053 },
  { name: "Tawang Midpoint", lat: 27.5863, lng: 91.8667 },
  { name: "Ziro Midpoint", lat: 27.5435, lng: 93.8507 },
  { name: "Pasighat Midpoint", lat: 28.0667, lng: 95.3333 },
  { name: "Guwahati Midpoint", lat: 26.1445, lng: 91.7362 },
  { name: "Silchar Midpoint", lat: 24.8333, lng: 92.7789 },
  { name: "Dibrugarh Midpoint", lat: 27.4728, lng: 94.9110 },
  { name: "Tezpur Midpoint", lat: 26.6338, lng: 92.7926 },
  { name: "Patna Midpoint", lat: 25.5941, lng: 85.1376 },
  { name: "Gaya Midpoint", lat: 24.7914, lng: 85.0002 },
  { name: "Bhagalpur Midpoint", lat: 25.2425, lng: 86.9842 },
  { name: "Muzaffarpur Midpoint", lat: 26.1226, lng: 85.3906 },
  { name: "Raipur Midpoint", lat: 21.2514, lng: 81.6296 },
  { name: "Bilaspur Midpoint", lat: 22.0796, lng: 82.1391 },
  { name: "Korba Midpoint", lat: 22.3588, lng: 82.7500 },
  { name: "Durg Midpoint", lat: 21.1946, lng: 81.2985 },
  { name: "Panaji Midpoint", lat: 15.4909, lng: 73.8278 },
  { name: "Margao Midpoint", lat: 15.2832, lng: 73.9862 },
  { name: "Vasco da Gama Midpoint", lat: 15.3959, lng: 73.8150 },
  { name: "Mapusa Midpoint", lat: 15.5915, lng: 73.8089 },
  { name: "Ahmedabad Midpoint", lat: 23.0225, lng: 72.5714 },
  { name: "Surat Midpoint", lat: 21.1702, lng: 72.8311 },
  { name: "Vadodara Midpoint", lat: 22.3072, lng: 73.1812 },
  { name: "Rajkot Midpoint", lat: 22.3039, lng: 70.8022 },
  { name: "Chandigarh Midpoint", lat: 30.7333, lng: 76.7794 },
  { name: "Gurgaon Midpoint", lat: 28.4595, lng: 77.0266 },
  { name: "Faridabad Midpoint", lat: 28.4089, lng: 77.3178 },
  { name: "Panipat Midpoint", lat: 29.3909, lng: 76.9635 },
  { name: "Shimla Midpoint", lat: 31.1048, lng: 77.1734 },
  { name: "Manali Midpoint", lat: 32.2396, lng: 77.1887 },
  { name: "Dharamshala Midpoint", lat: 32.2190, lng: 76.3234 },
  { name: "Mandi Midpoint", lat: 31.5892, lng: 76.9182 },
  { name: "Ranchi Midpoint", lat: 23.3441, lng: 85.3096 },
  { name: "Jamshedpur Midpoint", lat: 22.8046, lng: 86.2029 },
  { name: "Dhanbad Midpoint", lat: 23.7957, lng: 86.4304 },
  { name: "Bokaro Midpoint", lat: 23.6693, lng: 86.1511 },
  { name: "Bengaluru Midpoint", lat: 12.9716, lng: 77.5946 },
  { name: "Mysuru Midpoint", lat: 12.2958, lng: 76.6394 },
  { name: "Mangalore Midpoint", lat: 12.9141, lng: 74.8560 },
  { name: "Hubballi Midpoint", lat: 15.3647, lng: 75.1239 },
  { name: "Thiruvananthapuram Midpoint", lat: 8.5241, lng: 76.9366 },
  { name: "Kochi Midpoint", lat: 9.9312, lng: 76.2673 },
  { name: "Kozhikode Midpoint", lat: 11.2588, lng: 75.7804 },
  { name: "Kannur Midpoint", lat: 11.8745, lng: 75.3704 },
  { name: "Bhopal Midpoint", lat: 23.2599, lng: 77.4126 },
  { name: "Indore Midpoint", lat: 22.7196, lng: 75.8577 },
  { name: "Gwalior Midpoint", lat: 26.2183, lng: 78.1828 },
  { name: "Jabalpur Midpoint", lat: 23.1815, lng: 79.9864 },
  { name: "Mumbai Midpoint", lat: 19.0760, lng: 72.8777 },
  { name: "Pune Midpoint", lat: 18.5204, lng: 73.8567 },
  { name: "Nagpur Midpoint", lat: 21.1458, lng: 79.0882 },
  { name: "Nashik Midpoint", lat: 19.9975, lng: 73.7898 },
  { name: "Imphal Midpoint", lat: 24.8170, lng: 93.9368 },
  { name: "Churachandpur Midpoint", lat: 24.3337, lng: 93.6733 },
  { name: "Thoubal Midpoint", lat: 24.6389, lng: 93.9970 },
  { name: "Bishnupur Midpoint", lat: 24.6105, lng: 93.7687 },
  { name: "Shillong Midpoint", lat: 25.5788, lng: 91.8933 },
  { name: "Tura Midpoint", lat: 25.5148, lng: 90.2035 },
  { name: "Cherrapunji Midpoint", lat: 25.2847, lng: 91.7219 },
  { name: "Jowai Midpoint", lat: 25.5000, lng: 92.1998 },
  { name: "Aizawl Midpoint", lat: 23.7271, lng: 92.7176 },
  { name: "Lunglei Midpoint", lat: 22.8812, lng: 92.7381 },
  { name: "Champhai Midpoint", lat: 23.4568, lng: 93.3296 },
  { name: "Kolasib Midpoint", lat: 24.2220, lng: 92.6784 },
  { name: "Kohima Midpoint", lat: 25.6647, lng: 94.1194 },
  { name: "Dimapur Midpoint", lat: 25.8754, lng: 93.7274 },
  { name: "Mokokchung Midpoint", lat: 26.3237, lng: 94.5300 },
  { name: "Tuensang Midpoint", lat: 26.2783, lng: 94.8242 },
  { name: "Bhubaneswar Midpoint", lat: 20.2961, lng: 85.8245 },
  { name: "Cuttack Midpoint", lat: 20.4625, lng: 85.8828 },
  { name: "Rourkela Midpoint", lat: 22.2604, lng: 84.8536 },
  { name: "Puri Midpoint", lat: 19.8135, lng: 85.8312 },
  { name: "Chandigarh Midpoint", lat: 30.7333, lng: 76.7794 },
  { name: "Amritsar Midpoint", lat: 31.6340, lng: 74.8723 },
  { name: "Ludhiana Midpoint", lat: 30.9002, lng: 75.8573 },
  { name: "Jalandhar Midpoint", lat: 31.3260, lng: 75.5762 },
  { name: "Jaipur Midpoint", lat: 26.9124, lng: 75.7873 },
  { name: "Udaipur Midpoint", lat: 24.5854, lng: 73.7125 },
  { name: "Jodhpur Midpoint", lat: 26.2389, lng: 73.0243 },
  { name: "Kota Midpoint", lat: 25.2138, lng: 75.8648 },
  { name: "Gangtok Midpoint", lat: 27.3389, lng: 88.6065 },
  { name: "Namchi Midpoint", lat: 27.1717, lng: 88.3496 },
  { name: "Pelling Midpoint", lat: 27.3093, lng: 88.2441 },
  { name: "Gyalshing Midpoint", lat: 27.2897, lng: 88.2355 },
  { name: "Chennai Midpoint", lat: 13.0827, lng: 80.2707 },
  { name: "Coimbatore Midpoint", lat: 11.0168, lng: 76.9558 },
  { name: "Madurai Midpoint", lat: 9.9252, lng: 78.1198 },
  { name: "Tiruchirappalli Midpoint", lat: 10.7905, lng: 78.7047 },
  { name: "Hyderabad Midpoint", lat: 17.3850, lng: 78.4867 },
  { name: "Warangal Midpoint", lat: 17.9784, lng: 79.5941 },
  { name: "Nizamabad Midpoint", lat: 18.6725, lng: 78.0941 },
  { name: "Karimnagar Midpoint", lat: 18.4386, lng: 79.1288 },
  { name: "Agartala Midpoint", lat: 23.8315, lng: 91.2868 },
  { name: "Udaipur Midpoint (Tripura)", lat: 23.5334, lng: 91.4805 },
  { name: "Dharmanagar Midpoint", lat: 24.3620, lng: 92.1715 },
  { name: "Kailashahar Midpoint", lat: 24.3334, lng: 92.0121 },
  { name: "Lucknow Midpoint", lat: 26.8467, lng: 80.9462 },
  { name: "Kanpur Midpoint", lat: 26.4499, lng: 80.3319 },
  { name: "Varanasi Midpoint", lat: 25.3176, lng: 82.9739 },
  { name: "Agra Midpoint", lat: 27.1767, lng: 78.0081 },
  { name: "Dehradun Midpoint", lat: 30.3165, lng: 78.0322 },
  { name: "Haridwar Midpoint", lat: 29.9457, lng: 78.1642 },
  { name: "Nainital Midpoint", lat: 29.3919, lng: 79.4542 },
  { name: "Rishikesh Midpoint", lat: 30.0869, lng: 78.2676 },
  { name: "Kolkata Midpoint", lat: 22.5726, lng: 88.3639 },
  { name: "Darjeeling Midpoint", lat: 27.0410, lng: 88.2636 },
  { name: "Siliguri Midpoint", lat: 26.7271, lng: 88.3953 },
  { name: "Asansol Midpoint", lat: 23.6850, lng: 86.9833 }
];




function LocationPicker({ setLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });
    },
  });
  return null;
}

const customIcon = new L.Icon({
  iconUrl: '/dustbin.png',
  iconSize: [32, 32], 
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});


const StateCityDropdown = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedWasteType, setSelectedWasteType] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [nearestOutlet, setNearestOutlet] = useState(null);
  const [location, setLocation] = useState({ latitude: 28.6139, longitude: 77.2090 });
  const [error, setError] = useState(null);
  const {userId} = useParams()
  const mapRef = useRef()
  
  const [amount, setAmount] = useState(0);

  const cityCoordinates = {
    Mumbai: { lat: 19.076, lng: 72.8777 },
    Delhi: { lat: 28.7041, lng: 77.1025 },
    Bangalore: { lat: 12.9716, lng: 77.5946 },
    Chennai: { lat: 13.0827, lng: 80.2707 },
    Kolkata: { lat: 22.5726, lng: 88.3639 },
  };

  // Calculate distances and find the nearest outlet
  const findNearestOutlet = (customerLoc) => {
    if (!customerLoc) return null;

    let minDistance = Infinity;
    let closestOutlet = null;

    outlets.forEach((outlet) => {
      const distance = getDistance(
        { latitude: customerLoc.lat, longitude: customerLoc.lng },
        { latitude: outlet.lat, longitude: outlet.lng }
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestOutlet = { ...outlet, distance: (distance / 1000).toFixed(2) }; // Convert meters to kilometers
      }
    });

    setNearestOutlet(closestOutlet);
  };

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setLocation({ latitude, longitude });

  //         if (cityOption && mapRef.current) {
  //           const { lat, lng } = cityCoordinates[cityOption.value];
  //           mapRef.current.setView([lat, lng], 12); // Update the map view
  //         }
  //         if (mapRef.current) {
  //           mapRef.current.setView([latitude, longitude], 13);
  //         }
  //       },
  //       (err) => {
  //         setError(err.message);
  //         console.error(err);
  //       }
  //     );
  //   } else {
  //     setError("Geolocation is not supported by this browser.");
  //   }
  // }, []);

  useEffect(() => {
    if (mapRef.current) {
        mapRef.current.setView([location.latitude, location.longitude], 12);
    }
}, [location]);

  // const handleCityChange = (cityOption) => {
  //   console.log("Selected city:", cityOption);
  //   setSelectedCity(cityOption);
  
  //     const { lat, lng } = cityCoordinates[cityOption.value];
  //     console.log("Setting location to:", { latitude: lat, longitude: lng });
  //     setLocation({ latitude: lat, longitude: lng });
  //     mapRef.current.setView([lat, lng], 12);
  // };

  const handleCityChange = (selectedCity) => {
    setSelectedCity(selectedCity);
    const cityCoordinates = { /* Your city coordinates here */ };
  
    if (selectedCity && cityCoordinates[selectedCity.value]) {
      const { lat, lng } = cityCoordinates[selectedCity.value];
  
      if (mapRef.current) {
        mapRef.current.setView([lat, lng], 12); // Only call setView if mapRef is valid
      }
    }
  };

  useEffect(() => {
    if (mapRef.current && selectedCity) {
      const { lat, lng } = cityCoordinates[selectedCity.value];
      mapRef.current.setView([lat, lng], 12);
    }
  }, [selectedCity]);
  


  useEffect(() => {
    if (customerLocation) {
      findNearestOutlet(customerLocation);
    }
  }, [customerLocation]);

  useEffect(() => {
    if (nearestOutlet) {
      const distance = parseFloat(nearestOutlet.distance);
      if (distance <= 5) {
        setAmount(25);
      } else if (distance <= 10) {
        setAmount(30);
      } else if (distance <= 20) {
        setAmount(45);
      } else {
        setAmount(2400);
      }
    }
  }, [nearestOutlet]);

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    address: "",
  });

  const stateCityData = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"],
    "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Tezpur"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
    "Chhattisgarh": ["Raipur", "Bilaspur", "Korba", "Durg"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Haryana": ["Chandigarh", "Gurgaon", "Faridabad", "Panipat"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Mandi"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
    "Karnataka": ["Bengaluru", "Mysuru", "Mangalore", "Hubballi"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kannur"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Bishnupur"],
    "Meghalaya": ["Shillong", "Tura", "Cherrapunji", "Jowai"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Kolasib"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Puri"],
    "Punjab": ["Chandigarh", "Amritsar", "Ludhiana", "Jalandhar"],
    "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
    "Sikkim": ["Gangtok", "Namchi", "Pelling", "Gyalshing"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Rishikesh"],
    "West Bengal": ["Kolkata", "Darjeeling", "Siliguri", "Asansol"],
    "Delhi": ["New Delhi", "Rohini", "Dwarka", "Saket"] // Added Delhi and its cities
  };

  const wasteOptions = [
    { label: "Uncategorised Waste ", value: "Uncategorised Waste " },
    { label: "Recyclable Waste", value: "Recyclable Waste" },
    { label: "Biodegradable Waste", value: "Biodegradable Waste" },
    { label: "Non-Biodegradable Waste", value: "Non-Biodegradable Waste" },
    { label: "Electronic Waste ", value: "Electronic Waste " },
    { label: "Textile Waste", value: "Textile Waste" },
    { label: "Hazardous Waste", value: "Hazardous Waste" },
    { label: "Miscellaneous Waste ", value: "Miscellaneous Waste " },
    { label: "Construction and Demolition Waste ", value: "Construction and Demolition Waste " },

  ];

  const stateOptions = Object.keys(stateCityData).map((state) => ({
    label: state,
    value: state,
  }));

  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    // Fetch unavailable slots when the date changes
    const fetchUnavailableSlots = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/unavailable-slots/${selectedDate
            .toISOString()
            .split("T")[0]}`
        );
        setUnavailableSlots(response.data);
      } catch (err) {
        console.error("Error fetching unavailable slots:", err);
      }
    };

    fetchUnavailableSlots();
  }, [selectedDate]);

  useEffect(() => {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    if (selectedDate.toISOString().split("T")[0] === currentDate){
      const currentHour = now.getHours() + 1; // Get the current hour (0-23)
  
      // Define the end time for the slots
      const endHour = 20; // 8:00 PM in 24-hour format
    
      // Generate time slots dynamically from the current hour to the end hour
      const slots = [];
      for (let i = currentHour; i <= endHour; i++) {
        slots.push(`${i}:00`);
      }
    
      // Update the state with the generated slots
      setTimeSlots(slots);
    } else{
      const slots = [];
      for (let i = 7; i <= 20; i++) {
        slots.push(`${i}:00`);
      }
    
      // Update the state with the generated slots
      setTimeSlots(slots);
    }
    
    
    
  }, [selectedDate]);
  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if(selectedOption === 'COD'){
      try {
        const finalAmount = amount; 
        // Make an API call to book the slot
        await axios.post("http://localhost:4000/api/book", {
          name: formData.name,
          mobile_number: formData.mobileNumber,
          address: formData.address,
          state_name: selectedState.label,
          city_name: selectedCity.label,
          waste_type: selectedWasteType.label,
          booking_date: selectedDate.toISOString().split("T")[0],
          time_slot: selectedTime.value,
          latitude: location.latitude,
          longitude: location.longitude,
          outlet_name: nearestOutlet.name,
          distance: nearestOutlet.distance,
          delivery_cost: finalAmount,
          user_id: userId,
        });
        alert("Booking confirmed!");
        navigate(`/home/${userId}`)
        
      } catch (err) {
        console.error("Error booking slot:", err);
        alert("Error booking slot: " + (err.response?.data || err.message));
      }
    }else{
      alert('This is a project not an actual Site');
    }
    
  };

  const cityOptions =
  selectedState && stateCityData[selectedState.value]
    ? stateCityData[selectedState.value].map((city) => ({
        label: city,
        value: city,
      }))
    : [];

  useEffect(() => {
    if (selectedCity && mapRef.current) {
      const { lat, lng } = cityCoordinates[selectedCity.value];
      setLocation({ latitude: lat, longitude: lng });
    }
  }, [selectedCity, cityCoordinates]);


  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([location.latitude, location.longitude], 12);
    }
  }, [location]);
 
  const handleResidential = (e) => {
    navigate(`/wastepickup/${userId}`)
  };
  const handleComercial = (e) => {
    navigate(`/comercial/${userId}`)
  };

  return (
    <div className="waste-booking-container">
      <div className="waste-booking-form">
      <form onSubmit={handleSubmit}>
        <div className="form-header-icons">
          <Home className="icon green-icon"  onClick={handleResidential} style={{cursor: 'pointer'}}/>
          <Building className="icon green-icon" onClick={handleComercial} style={{cursor: 'pointer'}}/>
        </div>
        <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="tel"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            required
          />
          
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            maxDate={new Date(new Date().setDate(new Date().getDate() + 7))}
          />
          <Select
            options={timeSlots.map((slot) => ({
              value: slot,
              label: slot,
              isDisabled: unavailableSlots.includes(slot), // Mark unavailable slots as disabled
            }))}
            value={selectedTime}
            onChange={setSelectedTime}
            placeholder="Select a time slot"
            isOptionDisabled={(option) => option.isDisabled} // Use this property to enforce the disabled state
            isClearable
          />
          <Select
            options={stateOptions}
            value={selectedState}
            onChange={setSelectedState}
            placeholder="Select a state"
            isClearable
          />
          <Select
            options={cityOptions}
            value={selectedCity}
            onChange={handleCityChange}
            placeholder="Select a city"
            isClearable
            isDisabled={!cityOptions.length}
          />
          <Select
            options={wasteOptions}
            value={selectedWasteType}
            onChange={setSelectedWasteType}
            placeholder="Type of Waste"
            isClearable
          />

        {/* Date and Time Selection */}
 
      <div className="map-placeholder">
      {/* <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={12}
          style={{ height: "270px", width: "500px", marginTop: "20px", zIndex: 0 }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationPicker setLocation={setCustomerLocation} />
          {customerLocation && (
            <Marker position={[customerLocation.lat, customerLocation.lng]} icon={customIcon} >
              <Popup>Your location</Popup>
            </Marker>
          )}
          {outlets.map((outlet, index) => (
            <Marker key={index} position={[outlet.lat, outlet.lng]}>
              <Popup>{outlet.name}</Popup>
            </Marker>
          ))}
        </MapContainer> */}
        <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={12}
              style={{ height: "270px", width: "500px", marginTop: "20px", zIndex: 0 }}
              whenCreated={(mapInstance) => {mapRef.current = mapInstance;}}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker setLocation={setCustomerLocation} />
            {customerLocation && (
              <Marker position={[customerLocation.lat, customerLocation.lng]} icon={customIcon}>
                <Popup>Your location</Popup>
              </Marker>
            )}
            {outlets.map((outlet, index) => (
              <Marker key={index} position={[outlet.lat, outlet.lng]}>
                <Popup>{outlet.name}</Popup>
              </Marker>
            ))}
        </MapContainer>

      </div>
      <div className="nearest-outlet">
      {nearestOutlet && (

        <div>
            <div className="outlet-header">
              <MapPin className="outlet-icon green-icon" />
              <span>Nearest Outlet: <strong>{nearestOutlet.name}</strong><br /></span>
              </div>
              <p>Distance: <strong>{nearestOutlet.distance} km</strong><br/></p>
              <p>PickUp Cost: <strong>₹{amount}</strong></p>
        </div>
      )}
      </div>
      <div className="payment-options">
            <p>Select Payment Method</p>
            
            <div className="payment-methods">
              <div className="payment-method">
                <input
                  type="radio"
                  id="online-payment"
                  name="option"
                  value="online"
                  checked={selectedOption === "online"}
                 onChange={handleChange}
                />
                <label htmlFor="online-payment">
                  <CreditCard className="payment-icon green-icon" />
                  <span>Online Payment (BHIM/UPI/CARD/NETBANKING)</span>
                </label>
              </div>
              
              <div className="payment-method">
                <input
                  type="radio"
                  id="cod-payment"
                  name="option"
                  value="COD"
                  checked={selectedOption === "COD"}
                  onChange={handleChange}
                />
                <label htmlFor="cod-payment">
                  <Truck className="payment-icon green-icon" />
                  <span>Cash On Delivery (COD)</span>
                </label>
              </div>
            </div>
          </div>
          <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

        {/* Submit Button */}
        <button
          className="confirm-booking"
          type="submit"
          disabled={
            !selectedTime ||
            !formData.name ||
            !formData.mobileNumber ||
            !selectedState ||
            !selectedCity ||
            !selectedWasteType || 
            !userId || 
            !customerLocation || 
            !nearestOutlet || !selectedOption
          }
        >
          Confirm Booking
        </button>
      </form>
      </div>
    </div>
  );
};

export default StateCityDropdown;
