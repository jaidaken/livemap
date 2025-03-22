self.onmessage = function (e) {
  const { zoomLevel, starType, hasError } = e.data;

  const calculateMarginLeftSize = () => {
    let marginLeft;

    if (hasError) {
      marginLeft = 30;
    } else if (starType === "MajorStar") {
      marginLeft = calculateMajorMarginLeft();
    } else if (starType === "MidStar") {
      marginLeft = calculateMidMarginLeft();
    } else if (starType === "MicroStar") {
      marginLeft = calculateMicroMarginLeft();
    } else {
      marginLeft = calculateDefaultMarginLeft();
    }

    return marginLeft;
  };

  const calculateMajorMarginLeft = () => {
    if (zoomLevel <= 4) return "6px";
    if (zoomLevel === 5) return "12px";
    if (zoomLevel === 6) return "16px";
    return "24px";
  };
  const calculateMidMarginLeft = () => {
    if (zoomLevel <= 4) return "6px";
    if (zoomLevel === 5) return "10px";
    if (zoomLevel === 6) return "12px";
    if (zoomLevel === 7) return "18px";
    return "26px";
  };

  const calculateMicroMarginLeft = () => {
    if (zoomLevel <= 7) return "8px";
    return "10px";
  };

  const calculateDefaultMarginLeft = () => {
    if (zoomLevel <= 4) return "0px";
    if (zoomLevel === 5) return "4px";
    if (zoomLevel === 6) return "10px";
    if (zoomLevel === 7) return "12px";
    if (zoomLevel === 8) return "14px";
    if (zoomLevel === 9) return "18px";
    return "8px";
  };

  const marginLeft = calculateMarginLeftSize();
  self.postMessage({ marginLeft });
};
