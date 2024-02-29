import { useState, useEffect, useCallback } from "react";
import { useMap } from "react-leaflet";
import { useSystemContext } from "./functions/SystemContext";
import { supabase } from "./functions/supabase";

const AddSystemForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    starType: "MinorStar",
    wiki: "",
    isCanon: false,
    alignRight: false,
  });

  const [formActive, setFormActive] = useState(false);

  const { handleAddSystem } = useSystemContext();

  const handleInputChange = useCallback((field, value) => {
    setFormData((prevFormData) => {
      if (field === "isCanon" || field === "alignRight") {
        return { ...prevFormData, [field]: value };
      }
      return { ...prevFormData, [field]: value !== undefined ? value : "" };
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !formData.starType ||
        formData.isCanon === undefined ||
        formData.alignRight === undefined
      ) {
        console.error(
          "Star Type, Is Canon, and Align Right are required fields"
        );
        return;
      }

      const { error } = await supabase.from("systems").upsert([
        {
          name: formData.name,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          starType: formData.starType,
          wiki: formData.wiki,
          isCanon: formData.isCanon,
          alignRight: formData.alignRight,
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
        starType: "MinorStar",
        isCanon: false,
        alignRight: false,
      });

      handleAddSystem();
    } catch (error) {
      console.error("Error adding system:", error.message);
    }
  };

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
            onChange={(e) => handleInputChange("starType", e.target.value)}
            value={formData.starType}
          >
            <option value="MinorStar">MinorStar</option>
            <option value="MajorStar">MajorStar</option>
            <option value="MidStar">MidStar</option>
          </select>
        </div>
        <div>
          <label>Wiki:</label>
          <input
            type="text"
            name="wiki"
            value={formData.wiki || ""}
            onChange={(e) => handleInputChange("wiki", e.target.value)}
          />
        </div>
        <div>
          <label>Is Canon:</label>
          <input
            type="checkbox"
            name="isCanon"
            checked={formData.isCanon}
            onChange={() => handleInputChange("isCanon", !formData.isCanon)}
          />
        </div>
        <div>
          <label>Align Right:</label>
          <input
            type="checkbox"
            name="alignRight"
            checked={formData.alignRight}
            onChange={() =>
              handleInputChange("alignRight", !formData.alignRight)
            }
          />
        </div>
        <button type="submit" id="addSystemSubmit">
          Add System
        </button>
      </form>
    </div>
  );
};

export default AddSystemForm;
