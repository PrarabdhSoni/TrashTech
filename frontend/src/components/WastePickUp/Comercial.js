import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Select from "react-select";
import { useParams, useNavigate } from 'react-router-dom';
import './WastePickUp.css'
import { Home, Building, Truck, CreditCard} from 'lucide-react';




const ComercialWaste = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(1);
  const [selectedWasteType, setSelectedWasteType] = useState(null);
  const [error, setError] = useState(null);
  const {userId} = useParams()
  const [amount, setAmount] = useState(1000);
  



 
  const handleCityChange = (selectedCity) => {
    setSelectedCity(selectedCity);
  
  };



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
    { label: "Construction and Demolition Waste ", value: "Construction and Demolition Waste" },
    { label: "Medical or Biodegradable Waste ", value: "Medical or Biodegradable Waste " },
    { label: "Packaging Waste", value: "Packaging Waste " },
    { label: " Liquid Waste", value: "Liquid Waste " },
    
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
    if (selectedTime) {
      const finalAmount = 1000 * selectedTime.value; // Use selectedTime.value
      setAmount(finalAmount);
    } else {
      setAmount(1000); // Handle the case where no value is selected
    }
  }, [selectedTime]);


  useEffect(() => {
      const slots = [];
      for (let i = 1; i <= 3; i++) {
        slots.push(`${i}`);
    
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
        await axios.post("http://localhost:4000/commercial/api/book", {
          name: formData.name,
          mobile_number: formData.mobileNumber,
          address: formData.address,
          state_name: selectedState.label,
          city_name: selectedCity.label,
          waste_type: selectedWasteType.label,
          booking_date: selectedDate.toISOString().split("T")[0],
          time_slot: selectedTime.value,
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
          <Home className="icon green-icon" onClick={handleResidential} style={{cursor: 'pointer'}}/>
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
        <Select
        options={timeSlots.map((slot) => ({
          value: slot,
          label: `${slot}`, // Convert to string for labels
        }))}
        value={selectedTime}
        onChange={(option) => setSelectedTime(option)} // Option contains {value, label}
        placeholder="Number of waste pickup per day"
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
            placeholder="Type of Waste found most"
            isClearable
          />

     

      <div className="nearest-outlet">

        <div>
            <div className="outlet-header">
              </div>
              <p>Subscription Cost: <strong>₹ {amount}</strong></p>
        </div>
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
            {/* <p>Business Verification needed for Special Waste type Pickup Services</p> */}
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
             !selectedOption
          }
        >
          Confirm Booking
        </button>
      </form>
      </div>
    </div>
  );
};

export default ComercialWaste;
