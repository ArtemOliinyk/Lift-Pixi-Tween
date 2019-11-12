import {Graphics, Container, Text, TextStyle} from 'pixi.js';
import {BottomPadding, DistanceBetweenFloors, FloorsNumber, getRandomFloor, getRandomInt, Padding} from '../constants'
import Passenger from "./passenger";
import TWEEN from "@tweenjs/tween.js";
import House from "./house";

export default class Floor extends Container {
    public floorGraphic: Graphics;
    public readonly level: number;
    public floorStart: number;
    public passengersQueue: Passenger [] = [];
    private _interval: number = getRandomInt(4, 20) * 1000;

    constructor(level: number, floorStart: number) {
        super();
        this.level = level;
        this.floorStart = floorStart + Padding;
        this.drawFloor();
        this.makePassenger();
    }

    private drawFloor(): void {
        this.floorGraphic = new Graphics();
        let distance = DistanceBetweenFloors * this.level;
        this.floorGraphic.lineStyle(2, 0);

        this.floorGraphic.moveTo(window.innerWidth - 550, window.innerHeight - distance - BottomPadding);
        this.floorGraphic.lineTo(this.floorStart, window.innerHeight - distance - BottomPadding);
        this.displayTextFloor(`Level ${this.level}`, distance);

        this.addChild(this.floorGraphic);
    }

    private displayTextFloor(message: string, distance: number): void {
        let msgStyle = new TextStyle({
            fontFamily: "Arial",
            fontSize: 18,
        });
        let msg = new Text(message, msgStyle);
        msg.position.set(window.innerWidth - 700, window.innerHeight - distance);

        this.floorGraphic.addChild(msg);
    }

    public makePassenger(): void {
        setInterval(() => {
            let passenger = new Passenger(this.level, this.floorGraphic.width, this.passengersQueue.length + 1);
            this.floorGraphic.addChild(passenger);
            this.passengersQueue.push(passenger);
        }, this._interval);
    }

    public removePassenger(id: string): void {
        let removedPass = this.passengersQueue.find(pass => pass.id === id);
        if (removedPass) {
            this.floorGraphic.removeChild(removedPass.passengerGraphic);
            this.passengersQueue.shift();
            this.updateQueue();
        }
    }

    public updateQueue(): void {
        this.passengersQueue.forEach((passenger, key) => {
            passenger.positionNumber = key + 1;
            new TWEEN.Tween(passenger.passengerGraphic)
                .to({x: -(this.floorGraphic.width - Passenger.width * passenger.positionNumber)}, 500)
                .start();
        })
    }
}
