import React from "react";
import TradeLine from "../shapes/TradeLine.jsx";
import TradeNames from "../shapes/TradeNames.jsx";

function LanePlots() {
  return (
    <div className="lanes">
      <div className="MajorLanes">
        <div className="lane corellian-run">
          <TradeLine plot="corellian" lineStyle="majStyle" />
          <TradeNames
            color="white"
            coords={[-117.90750291375292, 141.15625]}
            text="Corellian Run"
            rotation="50deg"
            textStyle="majStyle"
          />
          <TradeNames
            color="white"
            coords={[-161.44152583527585, 167.921875]}
            text="Corellian Run"
            rotation="45deg"
            textStyle="majStyle"
          />
          <TradeNames
            color="white"
            coords={[-201.90884324009323, 209.3329941860465]}
            text="Corellian Run"
            rotation="38deg"
            textStyle="majStyle"
          />
        </div>

        <div className="lane corellian-trade-spine">
          <TradeLine plot="corellianspine" lineStyle="majStyle" />
          <TradeNames
            color="white"
            coords={[-152.555, 141.487]}
            text="Corellian Trade Spine"
            rotation="-72deg"
            textStyle="majStyle"
          />
          <TradeNames
            color="white"
            coords={[-190.847, 120.6418]}
            text="Corellian Trade Spine"
            rotation="-71deg"
            textStyle="majStyle"
          />
          <TradeNames
            color="white"
            coords={[-233.1303, 117.785]}
            text="Corellian Trade Spine"
            rotation="-90deg"
            textStyle="majStyle"
          />
        </div>

        <div className="lane rimma-trade-route">
          <TradeLine plot="rimma" lineStyle="majStyle" />

          <TradeNames
            color="white"
            coords={[-158.2055676961927, 130.93849846390168]}
            text={`Rimma Trade Route`}
            rotation={"50deg"}
            textStyle="majStyle"
          />
          <TradeNames
            color="white"
            coords={[-183.97075563325564, 143.48843917710195]}
            text={`Rimma Trade Route`}
            rotation={"75deg"}
            textStyle="majStyle"
          />
          <TradeNames
            color="white"
            coords={[-227.82966686091686, 146.47266882826477]}
            text={`Rimma Trade Route`}
            rotation={"90deg"}
            textStyle="majStyle"
          />
        </div>

        <div className="lane hydian-way">
          <TradeLine plot="hydian" lineStyle="majStyle" />
          <TradeNames
            color="white"
            coords={[-39.64054001554007, 200.93844476744187]}
            text={`Hydian Way`}
            rotation={"0deg"}
            textStyle="majStyle"
          />
          <TradeNames
            color="white"
            coords={[-83.68949834887334, 148.53339669051877]}
            text={`Hydian Way`}
            rotation={"-30deg"}
            textStyle="majStyle"
          />
          <TradeNames
            color="white"
            coords={[-116.69232711732712, 142.03481663685153]}
            text={`Hydian Way`}
            rotation={"46deg"}
            textStyle="majStyle"
          />
          <TradeNames
            color="white"
            coords={[-176.44247037684536, 153.50500894454382]}
            text={`Hydian Way`}
            rotation={"-82deg"}
            textStyle="majStyle"
          />
          <TradeNames
            color="white"
            coords={[-223.66002573815075, 133.23474396243293]}
            text={`Hydian Way`}
            rotation={"-52deg"}
            textStyle="majStyle"
          />
        </div>

        <div className="lane ootmian-pabol">
          <TradeLine plot="ootmian" lineStyle="majStyle" />
          <TradeNames
            color="white"
            coords={[-114, 199.65625]}
            text="Pabol Sleheyron"
            rotation="-10deg"
            textStyle="majStyle"
          />
          <TradeNames
            color="white"
            coords={[-121.875, 178.34375]}
            text="Ootmian Pabol"
            rotation="-50deg"
            textStyle="majStyle"
          />
        </div>

        <div className="lane perlemian-route">
          <TradeLine plot="perlemian" lineStyle="majStyle" />
          <TradeNames
            color="white"
            coords={[-109.0319, 131.0409]}
            text="Perlemian Trade Route"
            rotation="-31deg"
            textStyle="minStyle"
          />
          <TradeNames
            color="white"
            coords={[-74.236, 206.4574]}
            text="Perlemian Trade Route"
            rotation="-60deg"
            textStyle="minStyle"
          />
        </div>
      </div>

      <div className="MinorLanes">
        <TradeLine plot="byssRun" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-122.487, 121.25]}
          text="Byss Run"
          rotation="-35deg"
          textStyle="minStyle"
        />

        <TradeLine plot="mandalorian" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-78.28125, 166.84375]}
          text="Mandalorian Road"
          rotation="30deg"
          textStyle="minStyle"
        />

        <TradeLine plot="calanon" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-59.5, 150]}
          text="Celanon Spur"
          rotation="-12deg"
          textStyle="minStyle"
        />

        <TradeLine plot="phalanx" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-94.2656, 72.164]}
          text="Phalanx Route"
          rotation="-12deg"
          textStyle="minStyle"
        />

        <TradeLine plot="schesa" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-90.328, 70.015]}
          text="Way of Schesa"
          rotation="-20deg"
          textStyle="minStyle"
        />

        <TradeLine plot="houses" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-99.4218, 60.429]}
          text="Path of the Houses"
          rotation="35deg"
          textStyle="minStyle"
        />

        <TradeLine plot="Vaagari" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-99.156, 65.187]}
          text="Vaagari Corridor"
          rotation="8deg"
          textStyle="minStyle"
        />

        <TradeLine plot="cressus" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-98.125, 50.976]}
          text="Cressus Route"
          rotation="-45deg"
          textStyle="minStyle"
        />

        <TradeLine plot="chasdemonus" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-90.609, 54.593]}
          text="Chasdemonus Route"
          rotation="-10deg"
          textStyle="minStyle"
				/>
        <TradeLine plot="entralla" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-54.28125, 117.53125]}
          text="Entralla Route"
          rotation="94deg"
          textStyle="minStyle"
				/>
        <TradeNames
          color="white"
          coords={[-71.71875, 125.59375]}
          text="Entralla Route"
          rotation="60deg"
          textStyle="minStyle"
				/>


      </div>

      <div className="MinorLanes2">
        <TradeLine plot="goluud" lineStyle="minStyle" />
        <TradeLine plot="metellost" lineStyle="minStyle" />
        <TradeLine plot="widek" lineStyle="minStyle" />
        <TradeLine plot="shipwrights" lineStyle="minStyle" />
        <TradeLine plot="agri" lineStyle="minStyle" />
        <TradeLine plot="Namadii" lineStyle="minStyle" />
        <TradeLine plot="corkid" lineStyle="minStyle" />
        <TradeLine plot="corwak" lineStyle="minStyle" />
        <TradeLine plot="twihya" lineStyle="minStyle" />
        <TradeLine plot="brencomm" lineStyle="minStyle" />
        <TradeLine plot="fedcomm" lineStyle="minStyle" />
        <TradeLine plot="trelcomm" lineStyle="minStyle" />
        <TradeLine plot="byssabre" lineStyle="minStyle" />
        <TradeLine plot="exonan" lineStyle="minStyle" />
        <TradeLine plot="zeltose" lineStyle="minStyle" />
        <TradeLine plot="vaathkree" lineStyle="minStyle" />
        <TradeLine plot="shwuyexchange" lineStyle="minStyle" />
        <TradeLine plot="quellorrun" lineStyle="minStyle" />
        <TradeLine plot="giju" lineStyle="minStyle" />
        <TradeLine plot="tanhapes" lineStyle="minStyle" />
        <TradeLine plot="hapesquell" lineStyle="minStyle" />
        <TradeLine plot="hoth" lineStyle="majStyle" />
      </div>

      <div className="MicroLanes">
        <div className="micro-lanes">
          {Array.from({ length: 19 }, (_, i) => (
            <TradeLine
              key={`tapani${i + 1}`}
              plot={`tapani${i + 1}`}
              lineStyle="microStyle"
            />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <TradeLine
              plot={`hapes${i + 1}`}
              lineStyle="microStyle"
              key={`hapes-${i}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Memoize the named function component:
const MemoLanePlots = React.memo(LanePlots);

// Export the memoized version:
export default MemoLanePlots;
