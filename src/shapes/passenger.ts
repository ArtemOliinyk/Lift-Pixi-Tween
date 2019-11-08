import {Graphics, Container, TextStyle, Text} from 'pixi.js';
import {Blue, DistanceBetweenFloors, Green, Padding} from '../constants'
import House from "./house";
import TWEEN from "@tweenjs/tween.js";

export default class Passenger extends Container {
    public passenger: Graphics;
    public floorLevel: number;
    public endLevel: number;
    public positionNumber: number;
    public wantedLevel: number;
    public static height: number = 40;
    public static width: number = 20;

    constructor(level: number, end: number, position: number, wantedLevel: number) {
        super();
        this.floorLevel = level;
        this.endLevel = end;
        this.positionNumber = position;
        this.wantedLevel = wantedLevel;
        this.drawPassenger();
        this.moveToQueue();
    }

    private drawPassenger(): void {
        this.passenger = new Graphics;
        this.passenger.lineStyle(2,  this.floorLevel > this.wantedLevel ? Blue : Green);
        this.passenger.beginFill(0xFF2B3E, 0);
        this.passenger.drawRect(House.rightPadding- Padding * 2, this.floorLevel * DistanceBetweenFloors - Padding * 2, Passenger.width, Passenger.height);

        this.displayFloorNumber(`${this.wantedLevel}`);

        this.passenger.endFill();
        this.addChild(this.passenger);
    }

    private moveToQueue(): void {
        const moveLeft =  new TWEEN.Tween(this.passenger)
            .to({ x:  - (this.endLevel - this.width * this.positionNumber)}, 2000);

        moveLeft.start();
        //
    }

    private moveInsideLift(): void {
        //
    }

    private moveOut(): void {
        //
    }

    private displayFloorNumber(message: string): void {
        let msgStyle = new TextStyle({
            fontFamily: "Arial",
            fontSize: 15,
        });
        let msg = new Text(message, msgStyle);
        msg.position.set(House.rightPadding- Padding * 2, this.floorLevel * DistanceBetweenFloors - Padding * 2);

        this.passenger.addChild(msg);
    }
}
