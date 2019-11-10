import {Application} from 'pixi.js';
import House from "./shapes/house";

new class Main {
    app: Application;

    appOptions: Object = {
        backgroundColor: 11318975,
        antialias: true,
    };

    constructor() {
        this.app = new Application(this.appOptions);
        document.body.appendChild(this.app.view);

        let house = new House();
        this.app.stage.addChild(house.houseGraphic);
    }
};

