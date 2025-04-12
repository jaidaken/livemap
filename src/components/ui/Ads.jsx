import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const Ads = () => {
  const map = useMap();

  useEffect(() => {
    const AdsControl = L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create(
          "div",
          "leaflet-control leaflet-control-custom ads-container"
        );
        div.innerHTML = `
          <div class="ads-item">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9043801834976142"
crossorigin="anonymous"></script>
<!-- bottom ad -->
<ins class="adsbygoogle"
style="display:inline-block;width:320px;height:100px"
data-ad-client="ca-pub-9043801834976142"
data-ad-slot="6539702628"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
          </div>
        `;
        return div;
      },
    });

    const adsControlInstance = new AdsControl({ position: "bottomleft" });
    map.addControl(adsControlInstance);

    // Use a timeout to ensure the control is added to the DOM before we move it.
    setTimeout(() => {
      const adsElement = document.querySelector(".ads-container");
      const controlContainer = document.querySelector(
        ".leaflet-control-container"
      );
      if (
        adsElement &&
        controlContainer &&
        adsElement.parentElement !== controlContainer
      ) {
        // Remove it from its current parent and append directly to the control container.
        adsElement.parentElement.removeChild(adsElement);
        controlContainer.appendChild(adsElement);
      }
    }, 0);

    return () => {
      map.removeControl(adsControlInstance);
    };
  }, [map]);

  return null;
};

export default Ads;
