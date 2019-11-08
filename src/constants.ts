export const FloorsNumber = 8;
export const LiftCapacity = 2;

export const DistanceBetweenFloors = 70;
export const DurationBetweenFloors = 1000;
export const Padding = 10;
export const BottomPadding = 40;

export const Green = 40448;
export const Blue = 145;


export const getRandomFloor = (min: number, max: number, currentFloor: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
