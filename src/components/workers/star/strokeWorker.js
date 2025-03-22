self.onmessage = function (e) {
  const { zoomLevel, starType, hasError } = e.data;

  const calculateStrokeSize = () => {
    let strokeSize;

    if (hasError) {
      strokeSize = "0px black";
    } else if (starType === "MajorStar") {
      strokeSize = calculateMajorStroke();
    } else if (starType === "MidStar") {
      strokeSize = calculateMidStroke();
    } else if (starType === "MicroStar") {
      strokeSize = calculateMicroStroke();
    } else {
      strokeSize = calculateDefaultStroke();
    }

    return strokeSize;
  };

  const calculateMajorStroke = () => {
    if (zoomLevel <= 4) return "0.8px black";
    if (zoomLevel === 5) return "0.8px black";
    if (zoomLevel === 6) return "1px black";
    if (zoomLevel === 7) return "1.2px black";
    if (zoomLevel === 8) return "1.5px black";
    return "1px black";
  };

  const calculateMidStroke = () => {
    if (zoomLevel <= 4) return "0.6px black";
    if (zoomLevel === 5) return "0.7px black";
    if (zoomLevel === 6) return "0.8px black";
    return "1px black";
  };

  const calculateMicroStroke = () => {
    if (zoomLevel <= 7) return "0.8px black";
    return "0.8px black";
  };

  const calculateDefaultStroke = () => {
    if (zoomLevel === 5) return "0.5px black";
    if (zoomLevel === 6) return "0.8px black";
    if (zoomLevel === 7) return "1px black";
    if (zoomLevel === 8) return "1.5px black";
    return "1px black";
  };

  const strokeSize = calculateStrokeSize();
  self.postMessage({ strokeSize });
};
