import React, { useState, useEffect, useCallback } from "react";
import CircleObject from "./shapes/Circle.jsx";
import TradeLine from "./shapes/TradeLine.jsx";
import TitleObject from "./shapes/Title.jsx";
import PolygonObject from "./shapes/Polygon.jsx";
import { fetchSystems } from "./functions/fetch.jsx";
import { useMap } from "react-leaflet";
import TradeNames from "./shapes/TradeNames.jsx";
import { useSystemContext } from "./functions/SystemContext.jsx";
import SearchBarUI from "./ui/SearchBarUI.jsx";
import Filter from "./ui/filter.jsx";
import Star from "./shapes/Star.jsx";
import NebulaObject from "./shapes/Nebula.jsx";

// const starComponents = {
//   MajorStar: React.lazy(() => import("./startypes/MajorStar.jsx")),
//   MidStar: React.lazy(() => import("./startypes/MidStar.jsx")),
//   MinorStar: React.lazy(() => import("./startypes/MinorStar.jsx")),
// };

export default function Markers() {
	const map = useMap();

	const savedZoom = localStorage.getItem("zoomLevel");
	const zoomLevel = savedZoom ? parseInt(savedZoom) : 5;

  const [starSystems, setStarSystems] = useState([]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  const [activeFilters, setActiveFilters] = useState([
    "legends",
    "canon",
    "shared",
  ]);

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchSystems();
      setStarSystems(data);
      setLoading(false);
      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, []);

  const updateVisibleMarkers = useCallback(() => {
    if (!map) {
      return;
    }

    const bounds = map.getBounds();

    const markers = starSystems.filter(
      ({ latitude, longitude, isCanon, isLegends, isShared }) => {
        const isCanonVisible = activeFilters.includes("canon");
        const isLegendsVisible = activeFilters.includes("legends");
        const isSharedVisible = activeFilters.includes("shared");

        if (
          (isCanon && isCanonVisible && !isShared) ||
          (isLegends && isLegendsVisible && !isShared) ||
          (isShared && isSharedVisible)
        ) {
          return bounds.contains([latitude, longitude]);
        } else {
          return false;
        }
      }
    );

    setVisibleMarkers(markers);
  }, [map, starSystems, activeFilters]);

  const handleFilterChange = useCallback((filter) => {
    setActiveFilters((prevFilters) => {
      if (prevFilters.includes(filter)) {
        return prevFilters.filter((f) => f !== filter);
      } else {
        return [...prevFilters, filter];
      }
    });
  }, []);

  useEffect(() => {
    const handleZoomEnd = () => {
      updateVisibleMarkers();
    };

    const handleMoveEnd = () => {
      updateVisibleMarkers();
    };

    if (map) {
      map.on("zoomend", handleZoomEnd);
      map.on("moveend", handleMoveEnd);

      if (!dataFetched) {
        fetchData();
      } else {
        updateVisibleMarkers();
      }

      return () => {
        map.off("zoomend", handleZoomEnd);
        map.off("moveend", handleMoveEnd);
      };
    }
  }, [map, dataFetched, fetchData, updateVisibleMarkers]);

  useEffect(() => {
    if (!loading) {
      updateVisibleMarkers();
    }
  }, [loading, zoomLevel, updateVisibleMarkers]);

  const { newSystemAdded, handleAddSystem } = useSystemContext();

  useEffect(() => {
    if (newSystemAdded === true) {
      handleAddSystem();
      fetchData();
      updateVisibleMarkers();
    }
  }, [newSystemAdded, fetchData, updateVisibleMarkers, handleAddSystem]);

  const handleSystemSelect = useCallback(
    (selectedSystem) => {
      const { latitude, longitude } = selectedSystem;
      map.flyTo([latitude, longitude], 10);
    },
    [map]
  );

  return (
    <div>
      {loading && <div>Loading...</div>}
      {!loading &&
        visibleMarkers.map(
          ({
            id,
            name,
            latitude,
            longitude,
            starType,
            wiki,
            isCanon,
            isLegends,
            hasError,
            alignRight,
          }) => {
            return (
              <React.Suspense key={id} fallback={<div>Loading...</div>}>
                <Star
                  position={[latitude, longitude]}
                  name={name}
                  wiki={wiki}
                  isCanon={isCanon}
                  isLegends={isLegends}
                  hasError={hasError}
                  alignRight={alignRight}
                  starType={starType} // Pass the starType property
                />
              </React.Suspense>
            );
          }
        )}

      <SearchBarUI systems={starSystems} onSystemSelect={handleSystemSelect} />

      <Filter
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />

      <div className="zone-circles">
        <PolygonObject plot="innerRim" color="#1B609F" opacity={0.2} />
        <PolygonObject plot="expansionRegion" color="#25538A" opacity={0.2} />
        <PolygonObject plot="midRim" color="#264476" opacity={0.2} />
        <PolygonObject plot="outerRim" color="#2D3E6E" opacity={0.2} />

        <CircleObject
          center={[-128.2, 128]}
          radius={31.6}
          color="#006CB5"
          opacity={0.6}
        />
        <CircleObject
          center={[-128.2, 128]}
          radius={23.9}
          color="#0073BB"
          opacity={0.6}
        />
        <CircleObject
          center={[-128.2, 128]}
          radius={14.4}
          color="#0079C0"
          opacity={0.6}
        />
      </div>

      <div className="nebula">
        <NebulaObject
          plot="koornacht"
          color="#A080A2"
          line="transparent"
          opacity={1}
          lineOpacity={1}
          dash={1}
        />

        <NebulaObject
          plot="ringall"
          color="#A080A2"
          line="transparent"
          opacity={1}
          lineOpacity={1}
          dash={1}
        />
      </div>

      <div className="territory">
        <PolygonObject
          plot="huttSpace"
          color="#2C446C"
          line="#FF7200"
          opacity={1}
          lineOpacity={1}
          dash={1}
        />
      </div>

      <div className="trade-routes">
        <TradeNames
          color="white"
          coords={[-122.48706536519038, 121.25]}
          text={`Byss Run`}
          rotation={"-35deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="byssRun" lineStyle="minStyle" />

        <TradeNames
          color="white"
          coords={[-113.41312524281274, 127.734375]}
          text={`Koros Trunk Line`}
          rotation={"-96deg"}
          textStyle="minStyle"
        />

        <TradeNames
          color="white"
          coords={[-117.90750291375292, 141.15625]}
          text={`Corellian Run`}
          rotation={"50deg"}
          textStyle="majStyle"
        />
        <TradeNames
          color="white"
          coords={[-161.44152583527585, 167.921875]}
          text={`Corellian Run`}
          rotation={"45deg"}
          textStyle="majStyle"
        />
        <TradeNames
          color="white"
          coords={[-192.45496794871795, 198.46875]}
          text={`Corellian Run`}
          rotation={"46deg"}
          textStyle="majStyle"
        />
				<TradeLine plot="corellian" lineStyle="majStyle" />

        <TradeNames
          color="white"
          coords={[-139.21791472416473, 145.6319376118068]}
          text={`Corellian Trade Spine`}
          rotation={"46deg"}
          textStyle="majStyle"
        />
				<TradeLine plot="corellianspine" lineStyle="majStyle" />

				<TradeLine plot="hoth" lineStyle="majStyle" />

        <TradeNames
          color="white"
          coords={[-39.64054001554007, 200.93844476744187]}
          text={`Hydian Way`}
          rotation={"0deg"}
          textStyle="majStyle"
        />

				<TradeLine plot="hydian" lineStyle="majStyle" />

        <TradeNames
          color="white"
          coords={[-154.34803321678322, 129.14653398926654]}
          text={`Rimma Trade Route`}
          rotation={"0deg"}
          textStyle="majStyle"
        />

				<TradeLine plot="rimma" lineStyle="majStyle" />

        <TradeNames
          color="white"
          coords={[-117.36744852369853, 129.64895833333333]}
          text={`Goluud Corridor`}
          rotation={"-23deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="goluud" lineStyle="minStyle" />

        <TradeNames
          color="white"
          coords={[-114.71099820318571, 119.671875]}
          text={`Metellost Trade Route`}
          rotation={"-43deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="metellost" lineStyle="minStyle" />

        <TradeNames
          color="white"
          coords={[-116.09460348679099, 115.4296875]}
          text={`Widek Bypass`}
          rotation={"-53deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="widek" lineStyle="minStyle" />

        <TradeNames
          color="#CC8A46"
          coords={[-117.31674983003109, 132.91486575704226]}
          text={`Carbonite Run`}
          rotation={"15deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="carbonite" lineStyle="dashStyle" color={"#CC8A46"} />


        <TradeNames
          color="white"
          coords={[-117.37158423174048, 129.5150205158265]}
          text={`Perlemian Trade Route`}
          rotation={"-31deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="perlemian" lineStyle="majStyle" />

        <TradeNames
          color="white"
          coords={[-119.60995168026417, 129.3428799091442]}
          text={`Agricultural Circuit`}
          rotation={"10deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="agri" lineStyle="minStyle" />

        <TradeNames
          color="white"
          coords={[-112.91495726495727, 123.94416398007034]}
          text={`Namadii Corridor`}
          rotation={"52deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="Namadii" lineStyle="minStyle" />
        <TradeLine plot="corkid" lineStyle="minStyle" />
        <TradeLine plot="corwak" lineStyle="minStyle" />
        <TradeLine plot="twihya" lineStyle="minStyle" />
      </div>
      <div className="zone-titles">
        <TitleObject
          color=""
          coords={[-127.31663752913752, 124.1328104993598]}
          text={`D E E P\nC O R E`}
        />
        <TitleObject
          color=""
          coords={[-137.03689782439784, 112.37980153649168]}
          text={`C O R E\nW O R L D S`}
        />
        <TitleObject
          color=""
          coords={[-144.50628885003886, 105.9716709346991]}
          text={`C O L O N I E S`}
        />
        <TitleObject
          color=""
          coords={[-154.32031371406373, 101.03290653008963]}
          text={`I N N E R\nR I M`}
        />
        <TitleObject
          color=""
          coords={[-165.0407294094794, 96.68804417413573]}
          text={`E X P A N S I O N\nR E G I O N`}
        />
				<TitleObject
					color=""
					coords={[-177.79271076146077, 98.4072343149808]}
					text={`M I D\nR I M`} />
        <TitleObject
          color=""
          coords={[-212.15455516705518, 107.75422535211267]}
          text={`O U T E R\nR I M`}
        />
        <TitleObject
          color=""
          coords={[-141.69406565656567, 51.19210947503201]}
          text={`U N K N O W N\nR E G I O N S`}
        />
        <TitleObject
          color=""
          coords={[-133.19274475524477, 218.48493918053776]}
          text={`H U T T\nS P A C E`}
        />
      </div>
    </div>
  );
}
