import Component from '@glimmer/component';

export default class HouseIconComponent extends Component {

  baseIconPath = 'assets/icons/svg/house/';
  
  colorIcons = {
    'Brobnar': 'Brobnar.svg',
    'Logos': 'Logos.svg',
    'Sanctum': 'Sanctum.svg',
    'Mars': 'Mars.svg',
    'Dis': 'Dis.svg',
    'Shadows': 'Shadows.svg',
    'Untamed': 'Untamed.svg',
    'StarAlliance': 'StarAlliance.svg',
    'Saurian': 'Saurian.svg',
    'Unfathomable': 'Unfathomable.svg',
  };

  get imgSrc() {
    let houseName = this.args.houseName;

    let iconFilename = this['colorIcons'][houseName];
    if(iconFilename === undefined){
      iconFilename = 'Default.svg';
    }
    let style = this.args.printOptions.get('houseIconsStyle') || 'full';
 
    let basePath = this.baseIconPath + style + '/';

    return basePath + iconFilename;
  }
}