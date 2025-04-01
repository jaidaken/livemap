import React from "react";
import PolygonObject from "../shapes/Polygon.jsx";

function ChosenPlots() {
  return (
    <div className="territory">
      <PolygonObject
        plot="huttSpace"
        color="#a38b2c"
        line="#a38b2c"
        opacity={0.8}
        lineOpacity={0}
      />

      <PolygonObject
        plot="rebel1"
				color="#CD6C3D"
        line="#CD6C3D"
        opacity={0.8}
        lineOpacity={0}
      />
    </div>
  );
}

// Memoize the named function component:
const MemoChosenPlots = React.memo(ChosenPlots);

// Export the memoized version:
export default MemoChosenPlots;
