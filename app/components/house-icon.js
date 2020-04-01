import Component from '@glimmer/component';

export default class HouseIconComponent extends Component {

  baseIconPath = "assets/icons/";

  colorIcons = {
    "Brobnar": "house_brobnar.png",
    "Logos": "house_logos.png",
    "Sanctum": "house_sanctum.png",
    "Mars": "house_mars.png",
    "Dis": "house_dis.png",
    "Shadows": "house_shadows.png",
    "Untamed": "house_untamed.png",
    "StarAlliance": "house_staralliance.png",
  };

  get imgSrc() {
    let houseName = this.args.houseName;

    let iconFilename = this['colorIcons'][houseName];

    return this['baseIconPath'] + iconFilename;
  }
}