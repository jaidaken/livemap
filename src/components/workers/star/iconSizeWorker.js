self.onmessage = function (e) {
  const { zoomLevel, starType, hasError } = e.data;

  const calculateIconSize = () => {
    let iconSize;

    if (hasError) {
      iconSize = [10, 10];
    } else if (starType === "MajorStar") {
      iconSize = calculateMajorIconSize();
    } else if (starType === "MidStar") {
      iconSize = calculateMidIconSize();
    } else if (starType === "MicroStar") {
      iconSize = calculateMicroIconSize();
    } else {
      iconSize = calculateMinIconSize();
    }

    return iconSize;
  };

  const calculateMajorIconSize = () => {
    if (zoomLevel <= 2) return [10, 10];
    if (zoomLevel === 3) return [16, 16];
    if (zoomLevel === 4) return [20, 20];
    if (zoomLevel === 5) return [30, 30];
    if (zoomLevel === 6) return [40, 40];
    if (zoomLevel === 7) return [40, 40];
    if (zoomLevel === 8) return [40, 40];
    if (zoomLevel === 9) return [40, 40];
    return [55, 55];
  };

  const calculateMidIconSize = () => {
    if (zoomLevel <= 3) return [10, 10];
    if (zoomLevel === 4) return [18, 18];
    if (zoomLevel === 5) return [22, 22];
    if (zoomLevel === 6) return [30, 30];
    if (zoomLevel === 7) return [40, 40];
    if (zoomLevel === 8) return [55, 55];
    if (zoomLevel === 9) return [70, 70];
    return [55, 55];
  };

  const calculateMicroIconSize = () => {
    if (zoomLevel <= 5) return [0, 0];
    if (zoomLevel === 6) return [15, 15];
    if (zoomLevel === 7) return [20, 20];
    if (zoomLevel === 8) return [22, 22];
    return [20, 20];
  };

  const calculateMinIconSize = () => {
    if (zoomLevel <= 2) return [6, 6];
    if (zoomLevel === 3) return [10, 10];
    if (zoomLevel === 4) return [10, 10];
    if (zoomLevel === 5) return [15, 15];
    if (zoomLevel === 6) return [25, 25];
    if (zoomLevel === 7) return [30, 30];
    if (zoomLevel === 8) return [35, 35];
    if (zoomLevel === 9) return [40, 40];
    return [20, 20];
  };

  const iconSize = calculateIconSize();
  self.postMessage({ iconSize });
};
