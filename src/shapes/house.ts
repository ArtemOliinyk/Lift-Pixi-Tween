import {Graphics, Container} from 'pixi.js';
import {BottomPadding, FloorsNumber} from '../constants'
import Floor from "./floor";
import Lift from "./lift";
import TWEEN from "@tweenjs/tween.js";

export default class House extends Container {
    public house: Graphics;
    public static rightPadding: number = window.innerWidth - 600;

    constructor() {
        super();
        this.drawHouse();
        this.animate();
    }

    private drawHouse(): void {
        this.house = new Graphics;
        this.house.lineStyle(2, 0);
        this.house.beginFill(0xFF2B3E, 0);

        //make cascade
        this.house.moveTo(0, 5);
        this.house.lineTo(House.rightPadding, 5);
        this.house.lineTo(House.rightPadding, window.innerHeight - BottomPadding);
        this.house.lineTo(0, window.innerHeight - BottomPadding);

        let lift: Lift = new Lift();

        //make floors
        for (let i = 1; i <= FloorsNumber ; i++)
            this.house.addChild(new Floor(i, lift.width));
        this.house.endFill();
        this.house.addChild(lift);
        this.addChild(this.house);
    }

    private animate():void {
        window.requestAnimationFrame(() => this.animate());
        TWEEN.update();
    }

}
