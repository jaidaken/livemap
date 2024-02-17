import React from 'react';
import { useMap } from 'react-leaflet';
import L, { Control } from 'leaflet';

const Patreon = () => {
  const map = useMap();

  const patreonControl = Control.extend({
    onAdd: function() {
      const div = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom patreon-container');
      div.innerHTML = `
        <div class="patreon-item">
          <a href="https://www.patreon.com/FantasyCartography">Patreon</a>
				<span >|</span>
          <a href="https://ko-fi.com/fantasycartographer">Ko-Fi</a>
        </div>

      `;
      return div;
    },
  });

  React.useEffect(() => {
    const patreonControlInstance = new patreonControl({ position: 'bottomleft' });
    map.addControl(patreonControlInstance);
    return () => {
      map.removeControl(patreonControlInstance);
    };
  }, [map, patreonControl]);

  return null;
};

export default Patreon;
