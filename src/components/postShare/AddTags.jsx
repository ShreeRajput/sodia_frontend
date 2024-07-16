import React, { useRef, useState} from 'react';
import './addTags.css';
import axios from "axios"

const AddTags = ({type,tags,setTags,location,setLocation,setShowTagWindow}) => {

    /*
        i thing now i find very interesting that <div className="buttonGroup"> this class 
        css was not defined in css file added but still some particular css was applied to
        that div, then after some time i realizes that buttonGroup class was defined in 
        some other css file which is not attached to our current jsx file, then why ir 
        applied
    */

    const tagRef = useRef(null)
    const [suggestions, setSuggestions] = useState([])

    const handleAddTags = () => {
        const tag = tagRef.current.value
        setTags(tag)
        setShowTagWindow(false)
    };

    const handleQueryChange = async(e)=> {
        const query = e.target.value
        
        if (query.length > 2) {
            try {
                const response = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities`, {
                    params: {
                        namePrefix: query,
                        limit: 10
                    },
                    headers: {
                        'X-RapidAPI-Key': '0ac3bb4ba9msh08b17b65ef4ee58p16d8fcjsn15f993c7a037', 
                        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
                    }
                });
                setSuggestions(response.data.data.map(city => `${city.city}, ${city.region}, ${city.country}`));
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        } else {
            setSuggestions([]);
        }
    }

    return (
        <div className="editProfileOverlay">
            <div className="editProfileContainer">
            { type==='tag' ? <>
                <h2>Add Tags</h2>
                <form>
                    <div className="formGroup">
                        <label>Tags</label>
                        <textarea 
                            name="tags"
                            placeholder="Enter tags"
                            ref={tagRef}
                            defaultValue={tags}
                        />
                    </div>
                    <div className="buttonGroups">
                        <button type="button" className="cancelButtons" onClick={()=>setShowTagWindow(false)}>Cancel</button>
                        <button type="button" className="addButtons" onClick={handleAddTags}>Add</button>
                    </div>
                </form>
                </>
                :
                <>
                    <h2>Add Location</h2>
                    <form>
                        <div className="formGroup">
                            <label>Location</label>
                            <input 
                                type="text"
                                placeholder="Enter location"
                                onChange={handleQueryChange}
                                ref={tagRef}
                                defaultValue={location}
                            />
                        </div>
                        {suggestions?.length > 0 && (
                            <ul className="suggestionsList">
                                {suggestions.map((city, index) => (
                                    <li key={index} onClick={() => {tagRef.current.value=city;setSuggestions([])}}>
                                        {city}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="buttonGroups">
                            <button type="button" className="cancelButtons" onClick={()=>setShowTagWindow(false)}>Cancel</button>
                            <button type="button" className="addButtons" onClick={()=>{setLocation(tagRef.current.value);setShowTagWindow(false);}} >Add</button>
                        </div>
                    </form>
                </>
            }
            </div>
        </div>
    );
};

export default AddTags;
