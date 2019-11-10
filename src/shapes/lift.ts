import {Graphics, Container} from 'pixi.js';
import TWEEN from "@tweenjs/tween.js";
import {
    DistanceBetweenFloors,
    DurationBetweenFloors,
    FloorsNumber,
    LiftCapacity,
    Padding,
    PICK_PASSENGER
} from '../constants'
import Passenger from "./passenger";
import House from "./house";
import Floor from "./floor";


export default class Lift extends Container {
    public liftGraphic: Graphics;
    private readonly _distanceBetweenPass: number = 5;
    public passengers: Passenger [] = [];
    public currentLevel: number = 1;

    constructor() {
        super();

        this.drawLift();
        window.addEventListener(PICK_PASSENGER, () => this.start());
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

    private start(): void {
        let neededFloor = House.getInstance().floors.find(floor => floor.passengersQueue.length > 0);
        if (neededFloor) {
             return this.pickPassenger(neededFloor.passengersQueue[0]);
        }
        setTimeout(() => {
            this.start()
        }, 3000);
    }

    public addPassenger(passenger: Passenger): void {
        this.liftGraphic.addChild(passenger.passengerGraphic);
        this.passengers.push(passenger);
        House.getInstance().floors[this.currentLevel - 1].removePassenger(passenger.id);
    }

    public pickPassenger(passenger: Passenger) {
        const moveToPassenger = new TWEEN.Tween(this.liftGraphic)
            .to({y: -DistanceBetweenFloors * (passenger.floorLevel - 1)}, DurationBetweenFloors * Math.abs(this.currentLevel -passenger.floorLevel))
            .onComplete(() => {
                this.currentLevel = passenger.floorLevel;
                passenger.moveInsideLift();
                passenger.passengerGraphic.y = DistanceBetweenFloors * (passenger.floorLevel - 1);
                this.addPassenger(passenger);
            });
        const moveToFloor = new TWEEN.Tween(this.liftGraphic)
            .to({y: -DistanceBetweenFloors * (passenger.wantedLevel - 1)}, DurationBetweenFloors * Math.abs(passenger.floorLevel - passenger.wantedLevel))
            .onComplete(() => {
                this.currentLevel = passenger.wantedLevel;
                passenger.moveOut();
                this.start()
            })
            .delay(800);
        moveToPassenger.start().chain(moveToFloor);
    }

    public removePassenger(id: string) {
        let removedPass = this.passengers.find(pass => pass.id === id);
        if (removedPass) {
            this.liftGraphic.removeChild(removedPass.passengerGraphic);
            this.passengers.shift();
        }
    }
}
