import React from "react";
import PolygonObject from "../shapes/Polygon.jsx";
import Stripe from "../shapes/Stripe.jsx";


function ChosenPlots() {
  return (
    <div className="territory">
      <Stripe id="rebelempire" primary="#CD6C3D" secondary="#01258D" />

      <PolygonObject
        plot="empire"
        color="#01258D"
        line="#a38b2c"
				opacity={0.7
				}
        lineOpacity={0}
			/>

      <PolygonObject
        plot="maul"
        color="#5E0909"
        line="#5E0909"
				opacity={0.9
				}
        lineOpacity={0}
			/>

      <PolygonObject
        plot="huttSpace"
        color="#a38b2c"
        line="#a38b2c"
        opacity={0.7}
        lineOpacity={0}
      />

      <PolygonObject
        plot="rebel1"
        // color="#CD6C3D"
        color="url(#rebelempire)"
        line="#CD6C3D"
        opacity={0.7}
        lineOpacity={0}
      />

      <PolygonObject
        plot="rebel2"
        // color="#CD6C3D"
        color="url(#rebelempire)"
        line="#CD6C3D"
        opacity={0.7}
        lineOpacity={0}
      />
    </div>
  );
}

// Memoize the named function component:
const MemoChosenPlots = React.memo(ChosenPlots);

// Export the memoized version:
export default MemoChosenPlots;
