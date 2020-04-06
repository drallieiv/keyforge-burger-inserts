import Component from '@glimmer/component';

export default class HouseRatioBarComponent extends Component {

  resizeHouses(element, houseData) {

    let totalSas = houseData[0].reduce((a, b) => a + b, 0);
    let ratios = houseData[0].map((sas) => Math.round(sas / totalSas * 100));

    let houseElements = element.querySelectorAll('.house');
    for(let i=0; i<houseElements.length; i++) {
      let house = houseElements[i];
      house.style.width = ratios[i] +"%";
    }
  }
}