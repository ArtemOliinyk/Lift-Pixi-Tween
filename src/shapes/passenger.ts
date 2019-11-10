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
        // this.moveForward();
        this.moveToQueue();
    }

    private drawPassenger(): void {
        this.passengerGraphic = new Graphics();

        let color = this.wantedLevel > this.floorLevel ? Blue : Green;
        this.passengerGraphic.lineStyle(2, color);

        this.passengerGraphic.drawRect(
            House.rightPadding - Padding * 2,
            window.innerHeight - (DistanceBetweenFloors * this.floorLevel) - Padding * 2,
            Passenger.width,
            Passenger.height);

        this.displayFloorNumber(`${this.wantedLevel}`);

        this.addChild(this.passengerGraphic);
    }

    // private moveForward(): void {
    //
    //     new TWEEN.Tween(this.passengerGraphic)
    //         .to({x: -(this.endLevel - this.width * this.positionNumber)}, 2000)
    //         .onComplete(() => this.canMoveInsideLift())
    //         .start();
    // }

    // private canMoveInsideLift() {
    //     // if (this.houseInstant.lift.passengers.length < LiftCapacity) {
    //         this.pickEvent = new CustomEvent(PICK_PASSENGER, {
    //             detail: {
    //                 passengerGraphic: this,
    //                 level: this.floorLevel,
    //                 wantedLevel: this.wantedLevel
    //             }
    //         });
    //         window.dispatchEvent(this.pickEvent);
    //     // }
    // }

    private moveToQueue(): void {
        const moveLeft = new TWEEN.Tween(this.passengerGraphic)
            .to({x: -(this.endLevel - this.width * this.positionNumber)}, 2000);
        moveLeft.start();
    }

    public moveInsideLift() {
        new TWEEN.Tween(this.passengerGraphic)
            .to({x: -this.endLevel}, 800)
            .start();
    }

    public moveOut(): void {
        new TWEEN.Tween(this.passengerGraphic)
            .to({x: 0}, 400)
            .onComplete(() => House.getInstance().lift.removePassenger(this.id))
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
