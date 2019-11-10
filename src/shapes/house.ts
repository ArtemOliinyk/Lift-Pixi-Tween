import {Graphics, Container} from 'pixi.js';
import {BottomPadding, FloorsNumber} from '../constants'
import Floor from "./floor";
import Lift from "./lift";
import TWEEN from "@tweenjs/tween.js";

export default class House extends Container {
    private static _instance: House;
    public houseGraphic: Graphics;
    public static rightPadding: number = window.innerWidth - 550;
    public lift: Lift;
    public floors: Floor [] = [];

    constructor() {
        super();
        if (House._instance)
            throw new Error("Instantiation failed");
        House._instance = this;
        this.initHouse();
        this.animate();
    }

    private initHouse(): void {
        this.drawCascade();
        this.lift = new Lift();
        this.houseGraphic.addChild(this.lift.liftGraphic);
        this.drawFloors();
        this.addChild(this.houseGraphic);
    }

    private drawCascade(): void {
        this.houseGraphic = new Graphics();
        this.houseGraphic.lineStyle(2, 0);
        this.houseGraphic.moveTo(0, 5);
        this.houseGraphic.lineTo(House.rightPadding, 5);
        this.houseGraphic.lineTo(House.rightPadding, window.innerHeight - BottomPadding);
        this.houseGraphic.lineTo(0, window.innerHeight - BottomPadding);
    }

    private drawFloors(): void {
        for (let i = 1; i <= FloorsNumber; i++) {
            let floor = new Floor(i, this.lift.liftGraphic.width);
            this.floors.push(floor);
            this.houseGraphic.addChild(floor.floorGraphic);
        }
    }

    private animate(): void {
        window.requestAnimationFrame(() => this.animate());
        TWEEN.update();
    }

    public static getInstance(): House {
        if (House._instance)
            return House._instance;
        return House._instance = new House();
    }
}
