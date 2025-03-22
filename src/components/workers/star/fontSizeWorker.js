self.onmessage = function (e) {
  const { zoomLevel, starType, hasError } = e.data;

  const calculateFontSize = () => {
    let fontSize;

    if (hasError) {
      fontSize = 30;
    } else if (starType === "MajorStar") {
      fontSize = calculateMajorFontSize();
    } else if (starType === "MidStar") {
      fontSize = calculateMidFontSize();
    } else if (starType === "MicroStar") {
      fontSize = calculateMicroFontSize();
    } else {
      fontSize = calculateDefaultFontSize();
    }

    return fontSize;
  };

  const calculateMajorFontSize = () => {
    if (zoomLevel === 3) return 30;
    if (zoomLevel === 4) return 30;
    if (zoomLevel === 5) return 35;
    if (zoomLevel === 6) return 40;
    return 55;
  };

  const calculateMidFontSize = () => {
    if (zoomLevel === 4) return 18;
    if (zoomLevel === 5) return 22;
    if (zoomLevel === 6) return 30;
    if (zoomLevel === 7) return 40;
    return 55;
  };

  const calculateMicroFontSize = () => {
    if (zoomLevel <= 6) return 0;
    if (zoomLevel === 7) return 22;
    return 30;
  };

  const calculateDefaultFontSize = () => {
    if (zoomLevel === 5) return 21;
    if (zoomLevel === 6) return 35;
    if (zoomLevel === 7) return 40;
    if (zoomLevel >= 8) return 45;
    return 30;
  };

  const fontSize = calculateFontSize();
  self.postMessage({ fontSize });
};
