self.onmessage = function (e) {
  const { zoomLevel, starType, hasError } = e.data;

  const calculateMarginRightSize = () => {
    let marginRight;

    if (hasError) {
      marginRight = 30;
    } else if (starType === "MajorStar") {
      marginRight = calculateMajorMarginRight();
    } else if (starType === "MidStar") {
      marginRight = calculateMidMarginRight();
    } else if (starType === "MicroStar") {
      marginRight = calculateMicroMarginRight();
    } else {
      marginRight = calculateDefaultMarginRight();
    }

    return marginRight;
  };

  const calculateMajorMarginRight = () => {
    if (zoomLevel <= 4) return "6px";
    if (zoomLevel === 5) return "12px";
    if (zoomLevel === 6) return "18px";
    return "24px";
  };

  const calculateMidMarginRight = () => {
    if (zoomLevel <= 4) return "6px";
    if (zoomLevel === 5) return "10px";
    if (zoomLevel === 6) return "12px";
    if (zoomLevel === 7) return "18px";
    return "26px";
  };

  const calculateMicroMarginRight = () => {
    if (zoomLevel <= 7) return "8px";
    return "10px";
  };

  const calculateDefaultMarginRight = () => {
    if (zoomLevel <= 4) return "0px";
    if (zoomLevel === 5) return "4px";
    if (zoomLevel === 6) return "10px";
    if (zoomLevel === 7) return "12px";
    if (zoomLevel === 8) return "14px";
    if (zoomLevel === 9) return "18px";
    return "8px";
  };

  const marginRight = calculateMarginRightSize();
  self.postMessage({ marginRight });
};
