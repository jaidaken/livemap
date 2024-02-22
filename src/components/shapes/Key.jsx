import React from 'react';
import { useMap } from 'react-leaflet';
import L, { Control } from 'leaflet';

const Key = () => {
  const map = useMap();

  // Create a custom control element for the key
  const keyControl = Control.extend({
    onAdd: function() {
      const div = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom key-container');
      // Customize the content of the key
      div.innerHTML = `
        <div class="key-item">
          <img src="assets\marker-icon.svg" alt="Canon" style="width: 24px; height: 24px; margin-right: 8px;" />
          <span style="font-size: 14px;">Canon</span>
        </div>
        <div class="key-item">
          <img src="assets\marker-legend.svg" alt="Legends" style="width: 24px; height: 24px; margin-right: 8px;" />
          <span style="font-size: 14px;">Legends</span>
        </div>
      `;
      return div;
    },
  });

  // Add the custom control to the map
  React.useEffect(() => {
    const keyControlInstance = new keyControl({ position: 'bottomright' });
    map.addControl(keyControlInstance);
    return () => {
      map.removeControl(keyControlInstance);
    };
  }, [map, keyControl]);

  return null;
};

export default Key;
