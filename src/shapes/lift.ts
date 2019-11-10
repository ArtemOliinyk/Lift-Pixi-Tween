import {Graphics, Container} from 'pixi.js';
import TWEEN from "@tweenjs/tween.js";
import {DistanceBetweenFloors, DurationBetweenFloors, LiftCapacity, Padding, PICK_PASSENGER} from '../constants'
import Passenger from "./passenger";
import House from "./house";


export default class Lift extends Container {
    public liftGraphic: Graphics;
    private readonly _distanceBetweenPass: number = 5;
    public passengers: CustomEvent [] = [];
    public currentLevel: number;


    constructor() {
        super();

        this.drawLift();
        window.addEventListener(PICK_PASSENGER, pass => this.pickPassenger(pass));
        // this.move(3);
    }

    private drawLift() {
        this.liftGraphic = new Graphics();
        this.liftGraphic.lineStyle(3, 0xFF2B3E);
        this.liftGraphic.beginFill(0xFF2B3E, 0.2);
        let rightX = Padding + (LiftCapacity * this._distanceBetweenPass) + (LiftCapacity * Passenger.width);
        let leftX = Padding;
        let topY = window.innerHeight - (Passenger.height + Padding + DistanceBetweenFloors);
        let bottomY = window.innerHeight - (Passenger.height);

        this.liftGraphic.moveTo(rightX, window.innerHeight - DistanceBetweenFloors - 30);
        this.liftGraphic.lineTo(rightX, topY);
        this.liftGraphic.lineTo(leftX, topY);
        this.liftGraphic.lineTo(leftX, bottomY);
        this.liftGraphic.lineTo(rightX, bottomY);
        this.liftGraphic.lineTo(rightX, bottomY - Padding);
        this.liftGraphic.endFill();

        this.addChild(this.liftGraphic);
    }

    // private move(floor: number): void {
    //
    //     const moveUp = new TWEEN.Tween(this.liftGraphic)
    //         .to({y: -DistanceBetweenFloors * (floor - 1)}, DurationBetweenFloors * (floor - 1));
    //
    //     const moveDown = new TWEEN.Tween(this.liftGraphic)
    //         .to({y: 0}, DurationBetweenFloors * (floor - 1));
    //
    //     moveUp.start().chain(moveDown);
    //     moveDown.chain();
    // }

    public addPassenger(passenger: CustomEvent): void {
        this.passengers.push(passenger);
    }

    public pickPassenger(passenger: any): void {
        this.addPassenger(passenger);
        // this.passengers.forEach(pass => this.currentLevel - pass.detail.level );
        const moveToPassenger = new TWEEN.Tween(this.liftGraphic)
            .to({y: -DistanceBetweenFloors * (passenger.detail.level - 1)}, DurationBetweenFloors * (passenger.detail.level))
            .onComplete(() => {
                this.currentLevel = passenger.detail.level;
                passenger.detail.passengerGraphic.moveInsideLift();
                passenger.detail.passengerGraphic.y = DistanceBetweenFloors * (passenger.detail.level - 1);
                this.liftGraphic.addChild(passenger.detail.passengerGraphic);
            });
        const moveToFloor = new TWEEN.Tween(this.liftGraphic)
            .to({y: -DistanceBetweenFloors * (passenger.detail.wantedLevel - 1)}, DurationBetweenFloors * Math.abs(passenger.detail.level - passenger.detail.wantedLevel))
            .delay(800)
            .onComplete(() => {
                this.currentLevel = passenger.detail.wantedLevel;
                passenger.detail.passengerGraphic.moveOut();
                // this.liftGraphic.removeChild(passenger.detail.passengerGraphic);
            });

        moveToPassenger.start().chain(moveToFloor);
    }

    public removePassenger(id: string) {
        let removedPass = this.passengers.find(el => el.detail.passengerGraphic.id === id);
        if (removedPass) {
            this.liftGraphic.removeChild(removedPass.detail.passengerGraphic);
            this.passengers.shift();
        }
    }
}
