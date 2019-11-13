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
    private _passengers: Passenger [] = [];
    private _currentLevel: number = 1;

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
        let passenger = this.pickPassengers();
        if (passenger instanceof Passenger) {
            this.pickPassenger(passenger);
            // setTimeout(() => this.moveToFloor(), DurationBetweenFloors * Math.abs((this._currentLevel - passenger.floorLevel)) + 100);
            return
        }
        setTimeout(() => this.start(), 3000);
    }

    private findFloor(): Floor | boolean {
        let neededFloors = House.getInstance().floors.filter(floor => floor.passengersQueue.length > 0);
        let currentFloor = neededFloors.find(floor => floor.level === this._currentLevel);
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
        let foundFloor = neededFloors.find(floor => (floor.level === this._currentLevel + level) || (floor.level === this._currentLevel - level));
        if (foundFloor)
            return foundFloor;
        return false;
    }

    public addCurrentLinePassengers(): void {
        let countToGoIn = 1;
        let passenger = this._passengers[0];
        let floor = House.getInstance().floors[passenger.floorLevel - 1];

        for (let i = 0; i < floor.passengersQueue.length; i++) {
            let nextPass = floor.passengersQueue[i + 1];
            if (nextPass)
                if ((Math.sign(passenger.floorLevel - passenger.wantedLevel) === Math.sign(nextPass.floorLevel - nextPass.wantedLevel)) && this.isFreePlace() ) {
                    this._passengers.push(nextPass);
                    countToGoIn += 1;
                }
        }
        this._passengers.forEach((pass, key) => {
            pass.moveInsideLift(key, countToGoIn);
            pass.passengerGraphic.y = DistanceBetweenFloors * (pass.floorLevel - 1);
            this.liftGraphic.addChild(pass.passengerGraphic);
        })
    }

    public pickPassenger(passenger: Passenger) {
        new TWEEN.Tween(this.liftGraphic)
            .to({y: -DistanceBetweenFloors * (passenger.floorLevel - 1)}, DurationBetweenFloors * Math.abs((this._currentLevel - passenger.floorLevel)))
            .onComplete(() => {
                this._currentLevel = passenger.floorLevel;
                this._passengers.push(passenger);
                if (this._passengers.length)
                    this.pickPassengers(true);
                this.moveToFloor();
            })
            .start();
    }

    public moveToFloor(): TWEEN.Tween {
        this._passengers.sort((first, second) => (Math.abs(first.floorLevel - first.wantedLevel)) - (Math.abs(second.floorLevel - second.wantedLevel)));
        let nextPassenger = this._passengers[0];
        console.log(11, nextPassenger.wantedLevel)
        return new TWEEN.Tween(this.liftGraphic)
            .to({y: -DistanceBetweenFloors * (nextPassenger.wantedLevel - 1)}, DurationBetweenFloors * Math.abs((nextPassenger.floorLevel - nextPassenger.wantedLevel)))
            .onComplete(() => {
                this._currentLevel = nextPassenger.wantedLevel;
                nextPassenger.moveOut();
                if (this._passengers.length) {
                    this.pickPassengers(true);
                    return this.moveToFloor();
                }
                this.start()
            })
            .delay(800)
            .start();
    }

    public removePassenger(id: string) {
        let removedPass = this._passengers.find(pass => pass.id === id);
        if (removedPass) {
            this.liftGraphic.removeChild(removedPass.passengerGraphic);
            this._passengers.shift();
        }
    }

    private isFreePlace(): boolean {
        return this._passengers.length < LiftCapacity;
    }

    private pickPassengers(onCurrentFloor: boolean = false): Passenger | boolean {
        if (onCurrentFloor) {
            this.addCurrentLinePassengers();
        } else {
            let floor = this.findFloor();
            if (floor instanceof Floor)
                return floor.passengersQueue[0];
        }
        return false
    }
}
