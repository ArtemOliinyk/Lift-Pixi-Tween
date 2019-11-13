import {Graphics, Container, TextStyle, Text} from 'pixi.js';
import {
    Blue,
    DistanceBetweenFloors,
    FloorsNumber,
    getRandomFloor,
    Green,
    LiftCapacity,
    Padding,
} from '../constants'
import House from "./house";
import TWEEN from "@tweenjs/tween.js";

export default class Passenger extends Container {
    public passengerGraphic: Graphics;
    public floorLevel: number;
    public endLevel: number;
    public positionNumber: number;
    public wantedLevel: number;
    public static height: number = 40;
    public static width: number = 20;
    public id: string = `p${(+new Date).toString(16)}`;

    constructor(level: number, end: number, position: number) {
        super();
        this.floorLevel = level;
        this.endLevel = end;
        this.positionNumber = position;
        this.wantedLevel = getRandomFloor(1, FloorsNumber, this.floorLevel);

        this.drawPassenger();
        this.moveToQueue();
    }

    private drawPassenger(): void {
        this.passengerGraphic = new Graphics();

        let color = this.wantedLevel > this.floorLevel ? Blue : Green;
        this.passengerGraphic.lineStyle(1, color);

        this.passengerGraphic.drawRect(
            House.rightPadding - Padding * 2,
            window.innerHeight - (DistanceBetweenFloors * this.floorLevel) - Padding * 2,
            Passenger.width,
            Passenger.height);
        this.displayFloorNumber(`${this.wantedLevel}`);
        this.addChild(this.passengerGraphic);
    }

    private moveToQueue(): void {
        const moveLeft = new TWEEN.Tween(this.passengerGraphic)
            .to({x: -(this.endLevel - this.width * this.positionNumber)}, 600);
        moveLeft.start();
    }

    public moveInsideLift(key: number, count: number) {
        new TWEEN.Tween(this.passengerGraphic)
            .to({x: -(this.endLevel + (key) * this.width)}, 800 / count)
            .onStart(() => House.getInstance().floors[this.floorLevel - 1].removePassenger(this.id))
            .start();
    }

    public moveOut(): void {
        new TWEEN.Tween(this.passengerGraphic)
            .to({x: 0}, 400)
            .onStart(() => House.getInstance().lift.removePassenger(this.id))
            .start();
    }

    private displayFloorNumber(message: string): void {
        let msgStyle = new TextStyle({
            fontFamily: "Arial",
            fontSize: 15,
        });
        let msg = new Text(message, msgStyle);
        msg.position.set(House.rightPadding - Padding * 2, window.innerHeight - (DistanceBetweenFloors * this.floorLevel) - Padding * 2);

        this.passengerGraphic.addChild(msg);
    }
}
