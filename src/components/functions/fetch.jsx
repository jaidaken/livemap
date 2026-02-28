import { api } from "./api";

let cachedSystems = null;

const handleAPIError = (error, action) => {
  console.error(`API error ${action}:`, error);
  throw error;
};

const handleCache = (key, data = null) => {
  if (data) {
    localStorage.setItem(key, JSON.stringify(data));
  } else {
    const cachedData = localStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
  }
};

export const fetchSystems = async () => {
  if (!cachedSystems) {
    cachedSystems = handleCache("cachedSystems");
    if (cachedSystems) {
      console.log("Returning systems from localStorage cache");
      return cachedSystems;
    }
  }

  try {
    console.log("Fetching systems from database");
    const data = await api.select("systems", "select=*");

    if (!data) handleAPIError(new Error('No data returned'), "fetching systems");

    const systems = data.map((system) => ({
      id: system.id,
      name: system.name,
      latitude: system.latitude,
      longitude: system.longitude,
      starType: system.starType,
      wiki: system.wiki || null,
      isCanon: system.isCanon === true,
      isLegends: system.isLegends === true,
      isShared: system.isCanon === true && system.isLegends === true,
      hasError:
        system.isCanon === null ||
        system.isCanon === undefined ||
        system.isLegends === null ||
        system.isLegends === undefined,
      alignRight: system.alignRight === true,
    }));

    systems.forEach((system) => {
      if (system.wiki === null) {
        console.warn(
          `Warning: Wiki link is missing for system: ${system.name}`
        );
      }
    });

    cachedSystems = systems;
    handleCache("cachedSystems", systems);
    return systems;
  } catch (error) {
    console.error("Error fetching systems:", error.message);
    throw error;
  }
};

export const addSystem = async (name, latitude, longitude, starType) => {
  try {
    const latitudeValue = Number(latitude);
    const longitudeValue = Number(longitude);

    if (isNaN(latitudeValue) || isNaN(longitudeValue)) {
      throw new Error("Latitude and Longitude must be valid numbers.");
    }

    const data = await api.upsert("systems", [{
      name,
      latitude: latitudeValue,
      longitude: longitudeValue,
      starType,
    }], true);

    console.log("System added:", data);
    cachedSystems = null;
    localStorage.removeItem("cachedSystems");
    console.log("Cached systems cleared");
    await fetchSystems();

    return data;
  } catch (error) {
    console.error("Error adding system:", error.message);
    throw error;
  }
};

export const updateSystem = async (systemId, updatedData) => {
  try {
    const data = await api.update("systems", updatedData, `id=eq.${systemId}`);

    console.log("System updated:", data);
    return data;
  } catch (error) {
    console.error("Error updating system:", error.message);
    throw error;
  }
};

export const deleteSystem = async (systemId) => {
  try {
    const data = await api.delete("systems", `id=eq.${systemId}`);

    console.log("System deleted:", data);
    return data;
  } catch (error) {
    console.error("Error deleting system:", error.message);
    throw error;
  }
};
