import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_APP_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// export const fetchSystems = async () => {
//   try {
//     const { data, error } = await supabase.from('systems').select('*');

//     if (error) {
//       console.error('Supabase error fetching systems:', error);
//       throw error;
//     }

//     return data;
//   } catch (error) {
//     console.error('Error fetching systems:', error.message);
//     throw error;
//   }
// };

export const fetchSystems = async () => {
  try {
    const { data, error } = await supabase.from('systems').select('*');

    if (error) {
      console.error('Supabase error fetching systems:', error);
      throw error;
    }

    const systemsWithWiki = data.map(system => ({
      id: system.id,
      name: system.name,
      latitude: system.latitude,
      longitude: system.longitude,
      starType: system.starType,
      wiki: system.wiki || null, // Assuming wiki is stored directly in the 'systems' table
    }));

    systemsWithWiki.forEach(system => {
      if (system.wiki === null) {
        console.warn(`Warning: Wiki link is missing for system: ${system.name}`);
      }
    });

    return systemsWithWiki;
  } catch (error) {
    console.error('Error fetching systems:', error.message);
    throw error;
  }
};

// Add a new system
export const addSystem = async (name, latitude, longitude, starType) => {
  try {
    const latitudeValue = Number(latitude);
    const longitudeValue = Number(longitude);

    if (isNaN(latitudeValue) || isNaN(longitudeValue)) {
      throw new Error("Latitude and Longitude must be valid numbers.");
    }

    const { data, error } = await supabase.from('systems').upsert([
      {
        name,
        latitude: latitudeValue,
        longitude: longitudeValue,
        starType,
      },
    ]);

    if (error) {
      console.error('Supabase error adding system:', error);
      throw error;
    }

    console.log('System added:', data);
    return data;
  } catch (error) {
    console.error('Error adding system:', error.message);
    throw error;
  }
};

// Update an existing system
export const updateSystem = async (systemId, updatedData) => {
  try {
    const { data, error } = await supabase
      .from('systems')
      .update(updatedData)
      .match({ id: systemId });

    if (error) {
      throw error;
    }

    console.log('System updated:', data);
    return data;
  } catch (error) {
    console.error('Error updating system:', error.message);
    throw error;
  }
};

// Delete a system
export const deleteSystem = async (systemId) => {
  try {
    const { data, error } = await supabase.from('systems').delete().match({ id: systemId });

    if (error) {
      throw error;
    }

    console.log('System deleted:', data);
    return data;
  } catch (error) {
    console.error('Error deleting system:', error.message);
    throw error;
  }
};
