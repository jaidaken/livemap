import React from "react";
import CircleObject from "../shapes/Circle.jsx";
import PolygonObject from "../shapes/Polygon.jsx";
import TitleObject from "../shapes/Title.jsx";

function AreaPlots() {
  return (
    <div className="zones">
      <div className="zone-circles">
        <PolygonObject plot="outerRim" color="#2D3E6E" opacity={0.2} />
        <PolygonObject plot="midRim" color="#264476" opacity={0.2} />
        <PolygonObject plot="expansionRegion" color="#25538A" opacity={0.2} />
        <PolygonObject plot="innerRim" color="#1B609F" opacity={0.9} />

        <CircleObject
          center={[-128.2, 128]}
          radius={31.6}
          color="#006CB5"
          opacity={1}
        />
        <CircleObject
          center={[-128.2, 128]}
          radius={23.9}
          color="#0073BB"
          opacity={1}
        />
        <CircleObject
          center={[-128.2, 128]}
          radius={14.4}
          color="#0079C0"
          opacity={1}
        />
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
          text={`M I D\nR I M`}
        />
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

// Memoize the named function component:
const MemoAreaPlots = React.memo(AreaPlots);

// Export the memoized version:
export default MemoAreaPlots;
