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
            coords={[-117.90750291375292, 141.15625]}
            text="Corellian Run"
            rotation="50deg"
            textStyle="majStyle"
          />
          <TradeNames
            coords={[-160.1875, 166.5625]}
            text="Corellian Run"
            rotation="45deg"
            textStyle="majStyle"
          />
          <TradeNames
            coords={[-201.90884324009323, 209.3329941860465]}
            text="Corellian Run"
            rotation="38deg"
            textStyle="majStyle"
          />
        </div>

        <div className="lane corellian-trade-spine">
          <TradeLine plot="corellianspine" lineStyle="majStyle" />
          <TradeNames
            coords={[-152.555, 141.487]}
            text="Corellian Trade Spine"
            rotation="-72deg"
            textStyle="majStyle"
          />
          <TradeNames
            coords={[-190.847, 120.6418]}
            text="Corellian Trade Spine"
            rotation="-71deg"
            textStyle="majStyle"
          />
          <TradeNames
            coords={[-233.1303, 117.785]}
            text="Corellian Trade Spine"
            rotation="-90deg"
            textStyle="majStyle"
          />
        </div>

        <div className="lane rimma-trade-route">
          <TradeLine plot="rimma" lineStyle="majStyle" />

          <TradeNames
            coords={[-158.2055676961927, 130.93849846390168]}
            text={`Rimma Trade Route`}
            rotation={"50deg"}
            textStyle="majStyle"
          />
          <TradeNames
            coords={[-183.97075563325564, 143.48843917710195]}
            text={`Rimma Trade Route`}
            rotation={"75deg"}
            textStyle="majStyle"
          />
          <TradeNames
            coords={[-227.82966686091686, 146.47266882826477]}
            text={`Rimma Trade Route`}
            rotation={"90deg"}
            textStyle="majStyle"
          />
        </div>

        <div className="lane hydian-way">
          <TradeLine plot="hydian" lineStyle="majStyle" />
          <TradeNames
            coords={[-39.64054001554007, 200.93844476744187]}
            text={`Hydian Way`}
            rotation={"0deg"}
            textStyle="majStyle"
          />
          <TradeNames
            coords={[-83.68949834887334, 148.53339669051877]}
            text={`Hydian Way`}
            rotation={"-30deg"}
            textStyle="majStyle"
          />
          <TradeNames
            coords={[-116.69232711732712, 142.03481663685153]}
            text={`Hydian Way`}
            rotation={"46deg"}
            textStyle="majStyle"
          />
          <TradeNames
            coords={[-176.44247037684536, 153.50500894454382]}
            text={`Hydian Way`}
            rotation={"-82deg"}
            textStyle="majStyle"
          />
          <TradeNames
            coords={[-223.66002573815075, 133.23474396243293]}
            text={`Hydian Way`}
            rotation={"-52deg"}
            textStyle="majStyle"
          />
        </div>

        <div className="lane perlemian-route">
          <TradeLine plot="perlemian" lineStyle="majStyle" />
          <TradeNames
            coords={[-109.0319, 131.0409]}
            text="Perlemian Trade Route"
            rotation="-31deg"
            textStyle="minStyle"
          />
          <TradeNames
            coords={[-74.236, 206.4574]}
            text="Perlemian Trade Route"
            rotation="-60deg"
            textStyle="minStyle"
          />
          <TradeLine plot="triellus" lineStyle="majStyle" />
          <TradeNames
            coords={[-120.46875, 234.21875]}
            text="Triellus Trade Route"
            rotation="65deg"
            textStyle="majStyle"
          />
          <TradeLine plot="dead" lineStyle="majStyle" />
          <TradeNames
            coords={[-109.21875, 218.6875]}
            text="The Dead Road"
            rotation="70deg"
            textStyle="majStyle"
          />
          <TradeNames
            coords={[-125.15625, 225.15625]}
            text="The Dead Road"
            rotation="70deg"
            textStyle="majStyle"
          />

          <TradeLine plot="bootana" lineStyle="majStyle" />
          <TradeNames
            coords={[-120.6875, 218.609375]}
            text="Bootana Hutta"
            rotation="0deg"
            textStyle="majStyle"
          />
          <TradeNames
            coords={[-133.25, 212.5625]}
            text="Pabol Hutta"
            rotation="-34deg"
            textStyle="majStyle"
          />
        </div>

        <TradeLine plot="hoth" lineStyle="majStyle" />
      </div>

      <div className="MidLanes">
        <TradeLine plot="cov" lineStyle="midStyle" />
        <TradeLine plot="manda" lineStyle="midStyle" />
        <TradeLine plot="kinyen" lineStyle="midStyle" />
        <TradeLine plot="daalang" lineStyle="midStyle" />
        <TradeLine plot="naboo" lineStyle="midStyle" />
        <TradeLine plot="skynara" lineStyle="midStyle" />
        <TradeLine plot="triton" lineStyle="midStyle" />
        <TradeLine plot="starforge" lineStyle="midStyle" />
        <TradeLine plot="senex" lineStyle="midStyle" />
        <TradeLine plot="veron" lineStyle="midStyle" />
        <TradeLine plot="endor" lineStyle="midStyle" />
        <TradeLine plot="batuu" lineStyle="midStyle" />
        <TradeLine plot="xala" lineStyle="midStyle" />

        <TradeLine plot="daelgoth" lineStyle="midStyle" />
        <TradeNames
          coords={[-194.984375, 124.90625]}
          text="D'aelgoth Trade Route"
          rotation="40deg"
          textStyle="minStyle"
        />

        <TradeLine plot="agarix" lineStyle="midStyle" />
        <TradeNames
          coords={[-205.84375, 124.75]}
          text="Agarix Trade Route"
          rotation="10deg"
          textStyle="minStyle"
        />
        <TradeLine plot="lipsec" lineStyle="midStyle" />
        <TradeNames
          coords={[-215.40625, 109.921875]}
          text="Lipsec Run"
          rotation="-15deg"
          textStyle="minStyle"
        />
        <TradeLine plot="sanrafsix" lineStyle="midStyle" />
        <TradeNames
          coords={[-223.25, 158.28125]}
          text="Sanrafsix Corridor"
          rotation="-97deg"
          textStyle="minStyle"
        />
        <TradeLine plot="nothoiin" lineStyle="midStyle" />
        <TradeNames
          coords={[-209.25, 124.984375]}
          text="Nothoiin Corridor"
          rotation="18deg"
          textStyle="minStyle"
        />
        <TradeLine plot="veils" lineStyle="midStyle" />
        <TradeNames
          coords={[-206.171875, 174.421875]}
          text="Five Veils Route"
          rotation="-12deg"
          textStyle="minStyle"
        />
        <TradeLine plot="desevran" lineStyle="midStyle" />
        <TradeNames
          coords={[-68.5703125, 218.7734375]}
          text="Desevran Trace"
          rotation="90deg"
          textStyle="minStyle"
        />
        <TradeLine plot="shaltin" lineStyle="midStyle" />
        <TradeNames
          coords={[-50.546875, 209.453125]}
          text="Shaltin Tunnels"
          rotation="-65deg"
          textStyle="minStyle"
        />
        <TradeLine plot="overic" lineStyle="midStyle" />
        <TradeNames
          coords={[-59.5546875, 220.296875]}
          text="Overic Griplink"
          rotation="40deg"
          textStyle="minStyle"
        />
        <TradeLine plot="calanon" lineStyle="midStyle" />
        <TradeNames
          coords={[-59.5, 150]}
          text="Celanon Spur"
          rotation="-12deg"
          textStyle="minStyle"
        />
        <TradeLine plot="entralla" lineStyle="midStyle" />
        <TradeNames
          coords={[-54.28125, 117.53125]}
          text="Entralla Route"
          rotation="94deg"
          textStyle="minStyle"
        />
        <TradeLine plot="veragit" lineStyle="midStyle" />
        <TradeNames
          coords={[-32.03125, 133.40625]}
          text="Veragit Run"
          rotation="-37deg"
          textStyle="minStyle"
        />
        <TradeLine plot="braxant" lineStyle="midStyle" />
        <TradeNames
          coords={[-72.2109375, 159.078125]}
          text="Braxant Run"
          rotation="0deg"
          textStyle="minStyle"
        />
        <TradeLine plot="phalanx" lineStyle="midStyle" />
        <TradeNames
          coords={[-94.2656, 72.164]}
          text="Phalanx Route"
          rotation="-12deg"
          textStyle="minStyle"
        />
        <TradeLine plot="kashyyyk" lineStyle="midStyle" />
        <TradeNames
          coords={[-119.6875, 209.28125]}
          text="Pabol Kreeta"
          rotation="-70deg"
          textStyle="minStyle"
        />
        <TradeLine plot="sleheyron" lineStyle="midStyle" />

        <TradeLine plot="llanic" lineStyle="midStyle" />
        <TradeNames
          coords={[-201.65625, 185.78125]}
          text="Llanic Spice Run"
          rotation="-45deg"
          textStyle="minStyle"
        />

        <TradeLine plot="ootmian" lineStyle="midStyle" />
        <TradeNames
          coords={[-114, 199.65625]}
          text="Pabol Sleheyron"
          rotation="-10deg"
          textStyle="majStyle"
        />
        <TradeNames
          coords={[-121.875, 178.34375]}
          text="Ootmian Pabol"
          rotation="-50deg"
          textStyle="majStyle"
        />
        <TradeNames
          coords={[-125.125, 208.5]}
          text="Ootmian Pabol"
          rotation="63deg"
          textStyle="majStyle"
        />
        <TradeLine plot="estaria" lineStyle="midStyle" />
        <TradeLine plot="arcan" lineStyle="midStyle" />
        <TradeLine plot="gadon" lineStyle="midStyle" />
        <TradeLine plot="kegan" lineStyle="midStyle" />
        <TradeLine plot="cyborrea" lineStyle="midStyle" />
        <TradeLine plot="quellorrun" lineStyle="midStyle" />
        <TradeLine plot="zeltose" lineStyle="midStyle" />
        <TradeLine plot="shag" lineStyle="midStyle" />
        <TradeLine plot="hollastin" lineStyle="midStyle" />
        <TradeLine plot="kaaga" lineStyle="midStyle" />
        <TradeLine plot="wroona" lineStyle="midStyle" />

        <TradeNames
          coords={[-144.4375, 217.6875]}
          text="Hollastin Run"
          rotation="30deg"
          textStyle="minStyle"
        />
        <TradeNames
          coords={[-151.71875, 215.359375]}
          text="Pando Spur"
          rotation="75deg"
          textStyle="minStyle"
        />
        <TradeNames
          coords={[-136.359375, 221.5]}
          text="Shag Pabol"
          rotation="-8deg"
          textStyle="minStyle"
        />
      </div>

      <div className="MinorLanes">
        <TradeLine plot="byssRun" lineStyle="minStyle" />
        <TradeNames
          coords={[-122.487, 121.25]}
          text="Byss Run"
          rotation="-35deg"
          textStyle="minStyle"
        />

        <TradeLine plot="mandalorian" lineStyle="minStyle" />
        <TradeNames
          coords={[-78.28125, 166.84375]}
          text="Mandalorian Road"
          rotation="30deg"
          textStyle="minStyle"
        />

        <TradeLine plot="schesa" lineStyle="minStyle" />
        <TradeNames
          coords={[-90.328, 70.015]}
          text="Way of Schesa"
          rotation="-20deg"
          textStyle="minStyle"
        />

        <TradeLine plot="houses" lineStyle="minStyle" />
        <TradeNames
          coords={[-99.4218, 60.429]}
          text="Path of the Houses"
          rotation="35deg"
          textStyle="minStyle"
        />

        <TradeLine plot="Vaagari" lineStyle="minStyle" />
        <TradeNames
          coords={[-99.156, 65.187]}
          text="Vaagari Corridor"
          rotation="8deg"
          textStyle="minStyle"
        />

        <TradeLine plot="cressus" lineStyle="minStyle" />
        <TradeNames
          coords={[-98.125, 50.976]}
          text="Cressus Route"
          rotation="-45deg"
          textStyle="minStyle"
        />

        <TradeLine plot="chasdemonus" lineStyle="minStyle" />
        <TradeNames
          coords={[-90.609, 54.593]}
          text="Chasdemonus Route"
          rotation="-10deg"
          textStyle="minStyle"
        />

        <TradeNames
          coords={[-71.71875, 125.59375]}
          text="Entralla Route"
          rotation="60deg"
          textStyle="minStyle"
        />

        <TradeLine plot="listehol" lineStyle="minStyle" />
        <TradeNames
          coords={[-47.875, 204.53125]}
          text="Listehol Run"
          rotation="10deg"
          textStyle="minStyle"
        />

        <TradeNames
          coords={[-93.5546875, 233.0234375]}
          text="Falko	Run"
          rotation="0deg"
          textStyle="minStyle"
        />
        <TradeLine plot="ilosian" lineStyle="minStyle" />
        <TradeNames
          coords={[-113.125, 208.125]}
          text="Ilosian Spur"
          rotation="90deg"
          textStyle="minStyle"
        />
        <TradeLine plot="koda" lineStyle="minStyle" />
        <TradeNames
          coords={[-207.34375, 107.1875]}
          text="Koda Spur"
          rotation="30deg"
          textStyle="minStyle"
        />
      </div>

      <div className="MinorLanes2">
        <TradeLine plot="ast" lineStyle="minStyle" />
        <TradeLine plot="zorbia" lineStyle="minStyle" />
        <TradeLine plot="kuna" lineStyle="minStyle" />
        <TradeLine plot="vex" lineStyle="minStyle" />
        <TradeLine plot="tibrin" lineStyle="minStyle" />
        <TradeLine plot="velga" lineStyle="minStyle" />
        <TradeLine plot="kassido" lineStyle="minStyle" />
        <TradeLine plot="junex" lineStyle="minStyle" />
        <TradeLine plot="ryloth" lineStyle="minStyle" />
        <TradeLine plot="siskeen" lineStyle="minStyle" />
        <TradeLine plot="vasch" lineStyle="minStyle" />
        <TradeLine plot="vasch2" lineStyle="minStyle" />
        <TradeLine plot="pii" lineStyle="minStyle" />
        <TradeLine plot="excarga" lineStyle="minStyle" />
        <TradeLine plot="csilla" lineStyle="minStyle" />
        <TradeLine plot="kira" lineStyle="minStyle" />
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
        <TradeLine plot="vaathkree" lineStyle="minStyle" />
        <TradeLine plot="shwuyexchange" lineStyle="minStyle" />
        <TradeLine plot="giju" lineStyle="minStyle" />
        <TradeLine plot="tanhapes" lineStyle="minStyle" />
        <TradeLine plot="hapesquell" lineStyle="minStyle" />
        <TradeLine plot="coth" lineStyle="minStyle" />
        <TradeLine plot="shili" lineStyle="minStyle" />
        <TradeLine plot="luuq" lineStyle="minStyle" />
        <TradeLine plot="dohu" lineStyle="minStyle" />
        <TradeLine plot="roxuli" lineStyle="minStyle" />
        <TradeLine plot="moro" lineStyle="minStyle" />
        <TradeLine plot="ariarch" lineStyle="minStyle" />
        <TradeLine plot="barka" lineStyle="minStyle" />
        <TradeLine plot="traval" lineStyle="minStyle" />
        <TradeLine plot="chelenor" lineStyle="minStyle" />
        <TradeLine plot="ejolus" lineStyle="minStyle" />
        <TradeLine plot="asamin" lineStyle="minStyle" />
        <TradeLine plot="kidriff" lineStyle="minStyle" />
        <TradeLine plot="hewett" lineStyle="minStyle" />
        <TradeLine plot="garqi" lineStyle="minStyle" />
        <TradeLine plot="parshoone" lineStyle="minStyle" />
        <TradeLine plot="thoden" lineStyle="minStyle" />
        <TradeLine plot="gravlex" lineStyle="minStyle" />
        <TradeLine plot="dolis" lineStyle="minStyle" />
        <TradeLine plot="muun" lineStyle="minStyle" />
        <TradeLine plot="cezith" lineStyle="minStyle" />
        <TradeLine plot="tangrene" lineStyle="minStyle" />
        <TradeLine plot="axxila" lineStyle="minStyle" />
        <TradeLine plot="tierell" lineStyle="minStyle" />
        <TradeLine plot="indosa" lineStyle="minStyle" />
        <TradeLine plot="vandyne" lineStyle="minStyle" />
        <TradeLine plot="hynah" lineStyle="minStyle" />
        <TradeLine plot="selitan" lineStyle="minStyle" />
        <TradeLine plot="arkuda" lineStyle="minStyle" />
        <TradeLine plot="denarii" lineStyle="minStyle" />
        <TradeLine plot="junction" lineStyle="minStyle" />
        <TradeLine plot="jovan" lineStyle="minStyle" />
        <TradeLine plot="lucazec" lineStyle="minStyle" />
        <TradeLine plot="troos" lineStyle="minStyle" />
        <TradeLine plot="ninn" lineStyle="minStyle" />
        <TradeLine plot="ekibo" lineStyle="minStyle" />
        <TradeLine plot="mytus" lineStyle="minStyle" />
        <TradeLine plot="kamar" lineStyle="minStyle" />
        <TradeLine plot="orron" lineStyle="minStyle" />
        <TradeLine plot="kir" lineStyle="minStyle" />
        <TradeLine plot="media" lineStyle="minStyle" />
        <TradeLine plot="deltooine" lineStyle="minStyle" />
        <TradeLine plot="reltooine" lineStyle="minStyle" />
        <TradeLine plot="lur" lineStyle="minStyle" />
        <TradeLine plot="irudiru" lineStyle="minStyle" />
        <TradeLine plot="moraband" lineStyle="minStyle" />
        <TradeLine plot="jaguada" lineStyle="minStyle" />
        <TradeLine plot="ashas" lineStyle="minStyle" />
        <TradeLine plot="ree" lineStyle="minStyle" />
        <TradeLine plot="korriz" lineStyle="minStyle" />
        <TradeLine plot="yutusk" lineStyle="minStyle" />
        <TradeLine plot="stenos" lineStyle="minStyle" />
        <TradeLine plot="tothis" lineStyle="minStyle" />
        <TradeLine plot="mossak" lineStyle="minStyle" />
        <TradeLine plot="rudrig" lineStyle="minStyle" />
        <TradeLine plot="pakuuni" lineStyle="minStyle" />
        <TradeLine plot="belderone" lineStyle="minStyle" />
        <TradeLine plot="pasmin" lineStyle="minStyle" />
        <TradeLine plot="sy" lineStyle="minStyle" />
        <TradeLine plot="balshebr" lineStyle="minStyle" />
        <TradeLine plot="astigone" lineStyle="minStyle" />
        <TradeLine plot="eridicon" lineStyle="minStyle" />
        <TradeLine plot="poseidenna" lineStyle="minStyle" />
        <TradeLine plot="starcave" lineStyle="minStyle" />
        <TradeLine plot="sulorine" lineStyle="minStyle" />
        <TradeLine plot="klatooine" lineStyle="minStyle" />
        <TradeLine plot="hutta" lineStyle="minStyle" />
        <TradeLine plot="randa" lineStyle="minStyle" />
        <TradeLine plot="moralan" lineStyle="minStyle" />
        <TradeLine plot="kessel" lineStyle="minStyle" />
        <TradeLine plot="deysum" lineStyle="minStyle" />
        <TradeLine plot="thearterra" lineStyle="minStyle" />
        <TradeLine plot="burnin" lineStyle="minStyle" />
        <TradeLine plot="kiax" lineStyle="minStyle" />
      </div>

      <div className="dashLines">
        <TradeLine plot="itani" lineStyle="dashStyle" />
        <TradeLine plot="kesselrun" lineStyle="dashStyle" />
        <TradeNames
          color="#c75d16"
          coords={[-112.86328125, 227.6796875]}
          text="Kessel Run"
          rotation="0deg"
          textStyle="minStyle"
        />
        <TradeLine plot="carbonite" lineStyle="dashStyle" />
        <TradeNames
          color="#c75d16"
          coords={[-117.36328125, 132.87109375]}
          text="Carbonite Run"
          rotation="15deg"
          textStyle="minStyle"
        />
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
          {Array.from({ length: 11 }, (_, i) => (
            <TradeLine
              plot={`hapes${i + 1}`}
              lineStyle="microStyle"
              key={`hapes-${i}`}
            />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <TradeLine
              plot={`senex${i + 1}`}
              lineStyle="microStyle"
              key={`senex-${i}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const MemoLanePlots = React.memo(LanePlots);

export default MemoLanePlots;
