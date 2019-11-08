import {Graphics, Container, Text, TextStyle} from 'pixi.js';
import {BottomPadding, DistanceBetweenFloors, FloorsNumber, getRandomFloor, Padding} from '../constants'
import Passenger from "./passenger";

export default class Floor extends Container {
    public floor: Graphics;
    private readonly _level: number;
    public floorStart: number;
    private _passengersQueue: Passenger [] = [];

    constructor(level: number, floorStart: number) {
        super();
        this._level = level;
        this.floorStart = floorStart + Padding;
        this.drawFloor();
        this.makePassenger();
    }

    private drawFloor(): void {
        this.floor = new Graphics;
        let distance = DistanceBetweenFloors * this._level;
        this.floor.lineStyle(2, 0);
        this.floor.beginFill(0xFF2B3E, 0);

        this.floor.moveTo(window.innerWidth - 600, window.innerHeight - distance - BottomPadding);
        this.floor.lineTo(this.floorStart, window.innerHeight  - distance - BottomPadding);
        this.displayTextFloor(`Level ${this._level}`, distance);

        this.floor.endFill();
        this.addChild(this.floor);
    }

    private displayTextFloor(message: string, distance: number): void {
        let msgStyle = new TextStyle({
            fontFamily: "Arial",
            fontSize: 18,
        });
        let msg = new Text(message, msgStyle);
        msg.position.set(window.innerWidth - 700, window.innerHeight - distance);

        this.floor.addChild(msg);
    }

    public makePassenger(): void {
        setInterval( () => {
            let wantedLevel = getRandomFloor(1, FloorsNumber, this._level);
            let passenger = new Passenger(this._level, this.floor.width, this._passengersQueue.length + 1, wantedLevel);
            this.floor.addChild(passenger);
            this._passengersQueue.push(passenger);
        }, 4000);
    }

    private removePassenger(): void {
        this._passengersQueue.shift();
        // this.removeChild();
    }

}
