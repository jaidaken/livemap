import React from "react";
import PolygonObject from "../shapes/Polygon.jsx";

function TerritoryPlots() {
  return (
    <div className="territory">
      <PolygonObject
        plot="huttSpace"
        color="#2C446C"
        line="#FF7200"
        opacity={0.4}
        lineOpacity={1}
      />
    </div>
  );
}

// Memoize the named function component:
const MemoTerritoryPlots = React.memo(TerritoryPlots);

// Export the memoized version:
export default MemoTerritoryPlots;
