import { useState, useEffect, useCallback } from "react";
import { useMap } from "react-leaflet";
import { createClient } from "@supabase/supabase-js";
import { useSystemContext } from "./functions/SystemContext";

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AddSystemForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    starType: "",
  });

  const [formActive, setFormActive] = useState(false);

	const { handleAddSystem } = useSystemContext();

	const handleInputChange = useCallback(
		(field, value) => {
			setFormData((prevFormData) => ({ ...prevFormData, [field]: value }));
		},
		[]
	);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from("systems").upsert([
        {
          name: formData.name,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          starType: formData.starType,
        },
      ]);

      if (error) {
        throw error;
      }

      console.log("System added:", formData);
      setFormData({
        name: "",
        latitude: "",
        longitude: "",
        starType: "",
      });

      handleAddSystem();
    } catch (error) {
      console.error("Error adding system:", error.message);
    }
  };

  const starTypeOptions = [
    "MajorStar",
    "MidStar",
    "MinorStarLeft",
    "MinorStarRight",
    "MinorStarLeftLegends",
    "MinorStarRightLegends",
  ];

  const map = useMap();

	useEffect(() => {
		const handleMapClick = (e) => {
			if (!formActive) {
				handleInputChange("latitude", e.latlng.lat);
				handleInputChange("longitude", e.latlng.lng);
			}
		};

		const formElement = document.getElementById("addSystemForm");

		const activateForm = () => {
			setFormActive(true);
		};

		const deactivateForm = () => {
			setFormActive(false);
		};

		formElement.addEventListener("mouseenter", activateForm);
		formElement.addEventListener("mouseleave", deactivateForm);

		map.addEventListener("click", handleMapClick);

		return () => {
			map.removeEventListener("click", handleMapClick);
			formElement.removeEventListener("mouseenter", activateForm);
			formElement.removeEventListener("mouseleave", deactivateForm);
		};
	}, [map, formActive, handleInputChange]);


  return (
    <div className="leaflet-control leaflet-control-custom add-container">
      <form id="addSystemForm" onSubmit={handleSubmit}>
        <h2>Add System</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>
        <div>
          <label>Latitude:</label>
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={(e) => handleInputChange("latitude", e.target.value)}
          />
        </div>
        <div>
          <label>Longitude:</label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={(e) => handleInputChange("longitude", e.target.value)}
          />
        </div>
        <div>
          <label>Star Type:</label>
          <select
            name="starType"
            value={formData.starType}
            onChange={(e) => handleInputChange("starType", e.target.value)}
          >
            <option value="">Select Star Type</option>
            {starTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" id="addSystemSubmit">
          Add System
        </button>
      </form>
    </div>
  );
};

export default AddSystemForm;
