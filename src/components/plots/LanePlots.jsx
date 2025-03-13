import React from "react";
import TradeLine from "../shapes/TradeLine.jsx";
import TradeNames from "../shapes/TradeNames.jsx";

function LanePlots() {
  return (
    <div className="lanes">
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
          coords={[-114.22092438811188, 127.90173021019677]}
          text={`Koros Trunk Line`}
          rotation={"-90deg"}
          textStyle="minStyle"
        />

        <TradeNames
          color="white"
          coords={[-131.96875, 234.84375]}
          text={`Triellust Run`}
          rotation={"-75deg"}
          textStyle="majStyle"
        />
        <TradeNames
          color="white"
          coords={[-114, 199.65625]}
          text={`Pabol Sleheyron`}
          rotation={"-10deg"}
          textStyle="majStyle"
        />
        <TradeNames
          color="white"
          coords={[-121.875, 178.34375]}
          text={`Ootmian Pabol`}
          rotation={"-50deg"}
          textStyle="majStyle"
        />
        <TradeLine plot="ootmian" lineStyle="majStyle" />

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
          coords={[-201.90884324009323, 209.3329941860465]}
          text={`Corellian Run`}
          rotation={"38deg"}
          textStyle="majStyle"
        />
        <TradeLine plot="corellian" lineStyle="majStyle" />

        <TradeNames
          color="white"
          coords={[-152.55505293317793, 141.48728756708408]}
          text={`Corellian Trade Spine`}
          rotation={"-72deg"}
          textStyle="majStyle"
        />
        <TradeNames
          color="white"
          coords={[-190.84697455322456, 120.64183810375671]}
          text={`Corellian Trade Spine`}
          rotation={"-71deg"}
          textStyle="majStyle"
        />
        <TradeNames
          color="white"
          coords={[-233.13032245532247, 117.78516882826476]}
          text={`Corellian Trade Spine`}
          rotation={"-90deg"}
          textStyle="majStyle"
        />
        <TradeLine plot="corellianspine" lineStyle="majStyle" />

        <TradeLine plot="mandalorian" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-78.28125, 166.84375]}
          text={`Mandalorian Road`}
          rotation={"30deg"}
          textStyle="minStyle"
        />

        <TradeLine plot="calanon" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-59.5, 150]}
          text={`Celanon Spur`}
          rotation={"-12deg"}
          textStyle="minStyle"
        />

        <TradeLine plot="phalanx" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-94.265625, 72.1640625]}
          text={`Phalanx Route`}
          rotation={"-12deg"}
          textStyle="minStyle"
        />

        <TradeLine plot="schesa" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-90.328125, 70.015625]}
          text={`Way of Schesa`}
          rotation={"-20deg"}
          textStyle="minStyle"
        />

        <TradeLine plot="houses" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-99.421875, 60.4296875]}
          text={`Path of the Houses`}
          rotation={"35deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="Vaagari" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-99.15625, 65.1875]}
          text={`Vaagari Corridor`}
          rotation={"8deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="cressus" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-98.125, 50.9765625]}
          text={`Cressus Route`}
          rotation={"-45deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="chasdemonus" lineStyle="minStyle" />
        <TradeNames
          color="white"
          coords={[-90.609375, 54.59375]}
          text={`Chasdemonus Route`}
          rotation={"-10deg"}
          textStyle="minStyle"
        />

        <TradeLine plot="csilla" lineStyle="minStyle" />
        <TradeLine plot="thearterra" lineStyle="minStyle" />
        <TradeLine plot="kinyen" lineStyle="minStyle" />
        <TradeLine plot="wroona" lineStyle="minStyle" />
        <TradeLine plot="naboo" lineStyle="minStyle" />
        <TradeLine plot="kira" lineStyle="minStyle" />
        <TradeLine plot="hoth" lineStyle="majStyle" />

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

        <TradeLine plot="hydian" lineStyle="majStyle" />

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
          coords={[-114.79731388403263, 119.77489518112701]}
          text={`Metellost Trade Route`}
          rotation={"-43deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="metellost" lineStyle="minStyle" />

        <TradeNames
          color="white"
          coords={[-117.16855150058275, 114.68415557915921]}
          text={`Widek Bypass`}
          rotation={"-45deg"}
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
          color="#CC8A46"
          coords={[-162.29373482420357, 154.171875]}
          text={`Itani Run`}
          rotation={"52deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="itani" lineStyle="dashStyle" color={"#CC8A46"} />

        <TradeNames
          color="white"
          coords={[-109.03199907731158, 131.04091010733453]}
          text={`Perlemian Trade Route`}
          rotation={"-31deg"}
          textStyle="minStyle"
        />
        <TradeNames
          color="white"
          coords={[-74.23600912975913, 206.45744074239713]}
          text={`Perlemian Trade Route`}
          rotation={"-60deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="perlemian" lineStyle="majStyle" />

        <TradeNames
          color="white"
          coords={[-113.26212303321678, 130.2159150928297]}
          text={`Agricultural Circuit`}
          rotation={"10deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="agri" lineStyle="minStyle" />

        <TradeNames
          color="white"
          coords={[-84.8291168900544, 107.15815910107335]}
          text={`Namadii Corridor`}
          rotation={"52deg"}
          textStyle="minStyle"
        />

        <TradeNames
          color="white"
          coords={[-101.51753108003108, 120.95788796958855]}
          text={`Namadii Corridor`}
          rotation={"52deg"}
          textStyle="minStyle"
        />

        <TradeNames
          color="white"
          coords={[-157.3803952991453, 148.2579203478741]}
          text={`Shipwright's Trace`}
          rotation={"5deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="shipwrights" lineStyle="minStyle" />

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

        <TradeNames
          color="white"
          coords={[-90.39262092074593, 160.513816260745]}
          text={`Vaathkree Trade Corridor`}
          rotation={"22deg"}
          textStyle="minStyle"
        />

        <TradeLine plot="shwuyexchange" lineStyle="minStyle" />

        <TradeNames
          color="white"
          coords={[-98.93816894910645, 127.7578125]}
          text={`Shwuy Exchange`}
          rotation={"10deg"}
          textStyle="minStyle"
        />

        <TradeLine plot="quellorrun" lineStyle="minStyle" />

        <TradeNames
          color="white"
          coords={[-121.5636557886558, 158.453125]}
          text={`Quellor Run`}
          rotation={"5deg"}
          textStyle="minStyle"
        />

        <TradeNames
          color="white"
          coords={[-152.3216418997669, 124.52910931498079]}
          text={`Giju Run`}
          rotation={"10deg"}
          textStyle="minStyle"
        />
        <TradeLine plot="giju" lineStyle="minStyle" />
        <TradeLine plot="tanhapes" lineStyle="minStyle" />
        <TradeLine plot="hapesquell" lineStyle="minStyle" />
      </div>

      <div className="micro-lanes">
        <TradeLine plot="tapani" lineStyle="microStyle" />
        <TradeLine plot="tapani2" lineStyle="microStyle" />
        <TradeLine plot="tapani3" lineStyle="microStyle" />
        <TradeLine plot="tapani4" lineStyle="microStyle" />
        <TradeLine plot="tapani5" lineStyle="microStyle" />
        <TradeLine plot="tapani6" lineStyle="microStyle" />
        <TradeLine plot="tapani7" lineStyle="microStyle" />
        <TradeLine plot="tapani8" lineStyle="microStyle" />
        <TradeLine plot="tapani9" lineStyle="microStyle" />
        <TradeLine plot="tapani10" lineStyle="microStyle" />
        <TradeLine plot="tapani11" lineStyle="microStyle" />
        <TradeLine plot="tapani12" lineStyle="microStyle" />
        <TradeLine plot="tapani13" lineStyle="microStyle" />
        <TradeLine plot="tapani14" lineStyle="microStyle" />
        <TradeLine plot="tapani15" lineStyle="microStyle" />
        <TradeLine plot="tapani16" lineStyle="microStyle" />
        <TradeLine plot="tapani17" lineStyle="microStyle" />
        <TradeLine plot="tapani18" lineStyle="microStyle" />
        <TradeLine plot="tapani19" lineStyle="microStyle" />

        <TradeLine plot="hapes1" lineStyle="microStyle" />
        <TradeLine plot="hapes2" lineStyle="microStyle" />
        <TradeLine plot="hapes3" lineStyle="microStyle" />
        <TradeLine plot="hapes4" lineStyle="microStyle" />
        <TradeLine plot="hapes5" lineStyle="microStyle" />
        <TradeLine plot="hapes6" lineStyle="microStyle" />
        <TradeLine plot="hapes7" lineStyle="microStyle" />
        <TradeLine plot="hapes8" lineStyle="microStyle" />
        <TradeLine plot="hapes9" lineStyle="microStyle" />
        <TradeLine plot="hapes10" lineStyle="microStyle" />
        <TradeLine plot="hapes11" lineStyle="microStyle" />
      </div>
    </div>
  );
}

// Memoize the named function component:
const MemoLanePlots = React.memo(LanePlots);

// Export the memoized version:
export default MemoLanePlots;
