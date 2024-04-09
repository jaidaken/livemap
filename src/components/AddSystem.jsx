import { useState, useEffect, useCallback } from "react";
import { useMap } from "react-leaflet";
import { useSystemContext } from "./functions/SystemContext";
import { supabase, authenticateSupabase } from "./functions/supabase";

const AddSystemForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    starType: "MinorStar",
    wiki: "",
    isCanon: false,
    isLegends: false,
    alignRight: false,
  });

  const [formActive, setFormActive] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const { handleAddSystem } = useSystemContext();

  const handleInputChange = useCallback((field, value) => {
    setFormData((prevFormData) => {
      if (
        field === "isCanon" ||
        field === "isLegends" ||
        field === "alignRight"
      ) {
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
        formData.isLegends === undefined ||
        formData.alignRight === undefined
      ) {
        console.error(
          "Star Type, Is Canon, and Align Right are required fields"
        );
        return;
      }

      if (!authenticated) {
        await authenticateSupabase();
        setAuthenticated(true);
      }

      const { error } = await supabase.from("systems").upsert([
        {
          name: formData.name,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          starType: formData.starType,
          wiki: formData.wiki,
          isCanon: formData.isCanon,
          isLegends: formData.isLegends,
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
        isLegends: false,
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
    <div className="leaflet-control leaflet-control-custom add-system-container">
      <form id="addSystemForm" onSubmit={handleSubmit}>
        <h2>Add System</h2>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              autoComplete="off"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>Latitude:
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={(e) => handleInputChange("latitude", e.target.value)}
						/>
						</label>
        </div>
        <div>
          <label>Longitude:
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={(e) => handleInputChange("longitude", e.target.value)}
						/>
						</label>
        </div>
        <div>
          <label>Star Type:
          <select
            name="starType"
            onChange={(e) => handleInputChange("starType", e.target.value)}
            value={formData.starType}
          >
            <option value="MinorStar">MinorStar</option>
            <option value="MajorStar">MajorStar</option>
            <option value="MidStar">MidStar</option>
						</select>
						</label>
        </div>
        <div>
          <label>Wiki:
          <input
            type="text"
            name="wiki"
            value={formData.wiki || ""}
            onChange={(e) => handleInputChange("wiki", e.target.value)}
					/>
					</label>
        </div>
        <div>
          <label>Is Canon:
          <input
            type="checkbox"
            className="checkbox"
            name="isCanon"
            checked={formData.isCanon}
            onChange={() => handleInputChange("isCanon", !formData.isCanon)}
						/>
						</label>
        </div>
        <div>
          <label>Is Legends:
          <input
            type="checkbox"
            className="checkbox"
            name="isLegends"
            checked={formData.isLegends}
            onChange={() => handleInputChange("isLegends", !formData.isLegends)}
						/>
						</label>
        </div>
        <div>
          <label>Align Right:
          <input
            type="checkbox"
            className="checkbox"
            name="alignRight"
            checked={formData.alignRight}
            onChange={() =>
              handleInputChange("alignRight", !formData.alignRight)
            }
						/>
						</label>
        </div>
        <button type="submit" id="addSystemSubmit">
          Add System
        </button>
      </form>
    </div>
  );
};

export default AddSystemForm;
