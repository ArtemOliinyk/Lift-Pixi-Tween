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
        let floor = this.findFloor();
        if (floor instanceof Floor){
            this.pickPassenger(floor.passengersQueue[0]);
            setTimeout(() => this.moveToFloor(),DurationBetweenFloors * Math.abs(this.currentLevel - floor.passengersQueue[0].floorLevel) +50);
            return
        }

        setTimeout(() => this.start(), 3000);
    }

    private findFloor(): Floor | boolean {
        let neededFloors = House.getInstance().floors.filter(floor => floor.passengersQueue.length > 0);
        let currentFloor = neededFloors.find(floor => floor.level === this.currentLevel);
        if (currentFloor)
            return currentFloor;
        for (let i = 1; i <= FloorsNumber; i++) {
            let foundLevel = this.levelFind(i);
            if (foundLevel)
                return foundLevel;
        }
        return false;
    }

    public levelFind(level: number): Floor | boolean {
        let neededFloors = House.getInstance().floors.filter(floor => floor.passengersQueue.length > 0);
        let foundFloor = neededFloors.find(floor => (floor.level === this.currentLevel + level) || (floor.level === this.currentLevel - level));
        if (foundFloor)
            return foundFloor;
        return false;
    }

    public addPassenger(passenger: Passenger): void {
        this.passengers.push(passenger);
        let countToGoIn = 1;
        let floor = House.getInstance().floors[passenger.floorLevel - 1];
        for (let i = 0; i < floor.passengersQueue.length; i++) {
            let nextPass = floor.passengersQueue[i + 1];
            if (nextPass)
                if ((Math.sign(passenger.floorLevel - passenger.wantedLevel) === Math.sign(nextPass.floorLevel - nextPass.wantedLevel)) && this.isFreePlace()) {
                    this.passengers.push(nextPass);
                    countToGoIn += 1;
                }
        }
        this.passengers.forEach((pass, key) => {
            pass.moveInsideLift(key, countToGoIn);
            pass.passengerGraphic.y = DistanceBetweenFloors * (pass.floorLevel - 1);
            this.liftGraphic.addChild(pass.passengerGraphic);
            House.getInstance().floors[this.currentLevel - 1].removePassenger(pass.id)
        })
    }

    public pickPassenger(passenger: Passenger) {
        const moveToPassenger = new TWEEN.Tween(this.liftGraphic)
            .to({y: -DistanceBetweenFloors * (passenger.floorLevel - 1)}, DurationBetweenFloors * Math.abs(this.currentLevel - passenger.floorLevel))
            .onComplete(() => {
                this.currentLevel = passenger.floorLevel;
                // passenger.moveInsideLift();
                // passenger.passengerGraphic.y = DistanceBetweenFloors * (passenger.floorLevel - 1);
                this.addPassenger(passenger);
            });

        // const moveToFloor = new TWEEN.Tween(this.liftGraphic)
        //     .to({y: -DistanceBetweenFloors * (passenger.wantedLevel - 1)}, DurationBetweenFloors * Math.abs(passenger.floorLevel - passenger.wantedLevel))
        //     .onComplete(() => {
        //         this.currentLevel = passenger.wantedLevel;
        //         passenger.moveOut();
        //         setTimeout(() => this.start(), 400)
        //     })
        //     .delay(800);
        moveToPassenger.start()//.chain(moveToFloor);
    }

    public moveToFloor(): TWEEN.Tween {
        let minWanted =  Math.min(...this.passengers.map(pas => Math.abs(this.currentLevel - pas.wantedLevel)));
        let passenger: Passenger = this.passengers.find(pass => Math.abs(this.currentLevel - pass.wantedLevel) === minWanted);
        return new TWEEN.Tween(this.liftGraphic)
            .to({y: -DistanceBetweenFloors * (passenger.wantedLevel - 1)}, DurationBetweenFloors * Math.abs(passenger.floorLevel - passenger.wantedLevel))
            .onComplete(() => {
                this.currentLevel = passenger.wantedLevel;
                passenger.moveOut();
                if (this.passengers.length > 0)
                    return this.moveToFloor();
                setTimeout(() => this.start(), 400)
            })
            .delay(800)
            .start();
    }

    public removePassenger(id: string) {
        let removedPass = this.passengers.find(pass => pass.id === id);
        if (removedPass) {
            this.liftGraphic.removeChild(removedPass.passengerGraphic);
            this.passengers.shift();
        }
    }

    private isFreePlace(): boolean {
        return this.passengers.length < LiftCapacity;
    }
}
