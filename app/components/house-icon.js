import Component from '@glimmer/component';

export default class HouseIconComponent extends Component {

    baseIconPath = "assets/icons/";

    colorIcons = {
        "Dis": "house_dis.png",
        "Untamed": "house_untamed.png",
        "StarAlliance": "house_staralliance.png",
    };

    get imgSrc() {
        let houseName = this.args.houseName;

        let iconFilename = this['colorIcons'][houseName];

        return this['baseIconPath'] + iconFilename;
    }
}