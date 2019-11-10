export const FloorsNumber = 4;
export const LiftCapacity = 1;

export const DistanceBetweenFloors = 70;
export const DurationBetweenFloors = 1000;
export const Padding = 10;
export const BottomPadding = 40;

export const Green = 40448;
export const Blue = 145;

export const PICK_PASSENGER = 'PICK_PASSENGER';

export const getRandomFloor = (min: number, max: number, currentFloor: number) : number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    let rand = Math.floor(Math.random() * (max - min + 1)) + min;
    return rand === currentFloor ? getRandomFloor(min, max, currentFloor) : rand;
};
export const getRandomInt = (min: number, max: number) : number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};