import Component from '@glimmer/component';

export default class HouseRatioBarComponent extends Component {

  lastOptionsJson= '';

  colorConfig= {
    colorRatioFloor:100/3 - 8,
    colorRatioCeil:100/3 + 8,
    colorHueMin:0,
    colorHueMax:105,
    colorSat:"90%",
    colorLum:"45%",
  }
 
  resizeHouses(element, options) {
    let houseData = options[0];
    let useColor = options[1];
    let colorConfig = options[2];
    if(!houseData || houseData.length == 0) {
      return;
    }
    let totalSas = houseData.reduce((a, b) => a + b, 0);
    let ratios = houseData.map((sas) => Math.round(sas / totalSas * 100));

    let houseElements = element.querySelectorAll('.house');
    for (let i=0; i<houseElements.length; i++) {
      let house = houseElements[i];
      let ratio = ratios[i];
      house.style.width = ratio +"%";
      if (useColor) {
        let hue;
        if (ratio < colorConfig.colorRatioFloor){
          hue = colorConfig.colorHueMin;
        } else if (ratio > colorConfig.colorRatioCeil){
          hue = colorConfig.colorHueMax;
        } else {
          let avgRatio = (colorConfig.colorRatioFloor + colorConfig.colorRatioCeil) / 2;
          let scaleRatio = colorConfig.colorRatioCeil - colorConfig.colorRatioFloor;
          let avgHue = (colorConfig.colorHueMin + colorConfig.colorHueMax) / 2;
          let scaleHue = colorConfig.colorHueMax - colorConfig.colorHueMin;
          hue = avgHue + ((ratio-avgRatio) / scaleRatio) * scaleHue
        }
        house.style.style.setProperty("background-color", 'hsl('+hue+','+colorConfig.colorSat+','+colorConfig.colorLum+')', "important");
      } else{
        house.style.backgroundColor = 'inherit';
      }
    }
  }
}