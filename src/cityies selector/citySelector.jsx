import React,{useState, useEffect } from 'react';
import axios from "axios";
import styles from './citySelector.module.css';


const CitySelector=()=>{
    const [countries,setCountries]=React.useState([]);
    const [states,setStates]=React.useState([]);
    const [cities,setCities]=React.useState([]);
    const [selectedCountry,setSelectedCountry]=useState("");
    const [selectedState,setSelectedState]=useState("");
    const [selectedCity,setSelectedCity]=useState("");

    useEffect(()=>{
        axios.get ("https://location-selector.labs.crio.do/countries")
        .then((response)=>{
            setCountries(response.data);
            
        })
        .catch((error)=>{
            console.log("Error fetching countries:", error);
        });
    },[]);

    useEffect(()=>{
        if(selectedCountry){
            axios.get(`https://location-selector.labs.crio.do/country=${selectedCountry}/states`)
            .then((response)=>{
                setStates(response.data);
                setSelectedState("");
                setCities([]);
                setSelectedCity("");
            })
            .catch((error)=>{
                console.log("Error fetching states:", error);
            });
        }
    },[selectedCountry]);

    useEffect(()=>{
        if(selectedState && selectedCountry){
            axios.get( `https://location-selector.labs.crio.do/country=${selectedCountry}/state=${selectedState}/cities`)
            .then((response)=>{
                setCities(response.data);
                setSelectedCity("");
            })
            .catch((error)=>{
                console.log("Error fetching cities:", error);
            });
        }
    },[selectedState, selectedCountry]);

    return(
        <div className={styles["city-selector"]}>
            <h1>Select Location</h1>
            <div className={styles.dropdowns}>
                <select
                value={selectedCountry}
                onChange={(e)=>setSelectedCountry(e.target.value)}
                >
                    <option value="" disabled >Select Country</option>
                    {countries.map((country)=>(
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>

                <select
                value={selectedState}
                onChange={(e)=>setSelectedState(e.target.value)}
                disabled={!selectedCountry}
                className={styles.dropdown}
                >
                    <option value="" disabled>Select State</option>
                    {states.map((state)=>(
                        <option key={state} value={state}>
                            {state}
                        </option>
                    ))}
                </select>
                
                <select
                value={selectedCity}
                onChange={(e)=>setSelectedCity(e.target.value)}
                disabled={!selectedState}
                className={styles.dropdown}
                >
                    <option value="" disabled>Select City</option>
                    {cities.map((city)=>(
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
            </div>
            {selectedCity && (
                <div className={styles.result}>
                    <h3>You selected <span className={styles.highlight}>{selectedCity},</span>
                    <span className={styles.fade}>
                    {" "}
                    {selectedState}, {selectedCountry}
                    </span>
                    </h3> 
                </div>
            ) }
        </div>
    )
}
export default CitySelector;