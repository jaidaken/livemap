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

  const iconSize = calculateIconSize();
  const fontSize = calculateFontSize();
  const strokeSize = calculateStrokeSize();
  const marginLeft = calculateMarginLeftSize();
  const marginRight = calculateMarginRightSize();

  self.postMessage({ iconSize, fontSize, strokeSize, marginLeft, marginRight });
};
