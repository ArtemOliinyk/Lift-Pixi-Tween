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
        // let neededFloor = Math.min.apply(null, House.getInstance().floors.filter(floor => floor.level));

        // let neededFloors = House.getInstance().floors.filter(floor => floor.passengersQueue.length > 0);
        // let num;
        // neededFloors.forEach((floor) => {
        //     num = Math.abs(this.currentLevel - floor.level) === 0 ? floor : ;
        // });
        let floor = this.findFloor();
        if (floor)
            return this.pickPassenger(floor.passengersQueue[0]);
        // let neededFloor = House.getInstance().floors.find(floor => floor.passengersQueue.length > 0);
        // if (neededFloor)
        //     return this.pickPassenger(neededFloor.passengersQueue[0]);
        setTimeout(() => this.start(), 3000);
    }

    private findFloor(): Floor {
        let neededFloors = House.getInstance().floors.filter(floor => floor.passengersQueue.length > 0);
        // for (let i = 0; i < neededFloors.length; i++) {
        //     for (let j = 0; j < FloorsNumber; j++){
        //         if (Math.abs(this.currentLevel - neededFloors[i].level) === j)
        //             return neededFloors[i];
        //     }
        // }
        let fl = neededFloors.find(floor => floor.level === this.currentLevel);
        if (!fl) {
            for (let i = 1; i <= FloorsNumber; i++) {
                let fl2 = this.levelFind(i);
                if (fl2)
                    return fl2;
            }
        }
        return fl;
    }

    public levelFind(level: number) {
        let neededFloors = House.getInstance().floors.filter(floor => floor.passengersQueue.length > 0);
        let foundFloor = neededFloors.find(floor => floor.level === (this.currentLevel + level || this.currentLevel - level));
        if (foundFloor)
            return foundFloor;
        return 0;
    }

    public addPassenger(passenger: Passenger): void {
        this.liftGraphic.addChild(passenger.passengerGraphic);
        this.passengers.push(passenger);
        House.getInstance().floors[this.currentLevel - 1].removePassenger(passenger.id);
    }

    public pickPassenger(passenger: Passenger) {
        const moveToPassenger = new TWEEN.Tween(this.liftGraphic)
            .to({y: -DistanceBetweenFloors * (passenger.floorLevel - 1)}, DurationBetweenFloors * Math.abs(this.currentLevel - passenger.floorLevel))
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
                setTimeout(() => this.start(), 200)
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
