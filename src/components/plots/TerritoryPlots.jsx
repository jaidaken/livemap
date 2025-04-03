import React from "react";
import PolygonObject from "../shapes/Polygon.jsx";

function TerritoryPlots() {
  return (
    <div className="territory">
      <PolygonObject
        plot="huttSpace"
        color="#2C446C"
        line="#FF7200"
        opacity={0.8}
        lineOpacity={1}
      />
    </div>
  );
}

const MemoTerritoryPlots = React.memo(TerritoryPlots);

export default MemoTerritoryPlots;
