import {Graphics, Container} from 'pixi.js';
import TWEEN from "@tweenjs/tween.js";
import {DistanceBetweenFloors, DurationBetweenFloors, LiftCapacity, Padding} from '../constants'
import Passenger from "./passenger";


export default class Lift extends Container {
    public lift: Graphics;
    private _distanceBetweenPass: number = 5;

    constructor() {
        super();

        this.drawLift();
        this.move(8);
    }

    private drawLift() {
        this.lift = new Graphics;
        this.lift.lineStyle(3, 0xFF2B3E);
        this.lift.beginFill(0xFF2B3E, 0.2);
        let rightX = Padding + (LiftCapacity * this._distanceBetweenPass) + (LiftCapacity * Passenger.width);
        let leftX = Padding;
        let topY = window.innerHeight - (Passenger.height + Padding + DistanceBetweenFloors);
        let bottomY = window.innerHeight - (Passenger.height);

        this.lift.moveTo(rightX, window.innerHeight - DistanceBetweenFloors - 30);
        this.lift.lineTo(rightX, topY);
        this.lift.lineTo(leftX, topY);
        this.lift.lineTo(leftX, bottomY);
        this.lift.lineTo(rightX, bottomY);
        this.lift.lineTo(rightX, bottomY - Padding);
        this.lift.endFill();

        this.addChild(this.lift);
    }

    private move(floor:number):void {

        const moveUp =  new TWEEN.Tween(this.lift)
            .to({ y: - DistanceBetweenFloors * (floor - 1)}, DurationBetweenFloors * (floor - 1));

        const moveDown = new TWEEN.Tween(this.lift)
            .to({ y: 0}, DurationBetweenFloors * (floor - 1));

        // const turnBack = new TWEEN.Tween(lift)
        //     .to({ x: 700, y: 100, rotation: -180 * Math.PI / 180}, 1000)
        //     .onUpdate((obj: any) => lift.rotation = obj.rotation);
        //
        // const wayLeft =  new TWEEN.Tween(lift)
        //     .to({ x: 100}, 3000);

        moveUp.start().chain(moveDown);
        moveDown.chain();
    }
}
