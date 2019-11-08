import {Application, Graphics} from 'pixi.js';
import TWEEN from '@tweenjs/tween.js'
import House from "./shapes/house";
import Passenger from "./shapes/passenger";

new class Main {
    app: Application;

    appOptions: Object = {
        backgroundColor: 11318975,
        antialias: true,
    };

    constructor() {
        this.app = new Application(this.appOptions);
        document.body.appendChild(this.app.view);

        let house: House = new House();
        this.app.stage.addChild(house);
    }
};

