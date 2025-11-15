export enum FoodType {
    meat, vegetable, fruit, snack, junk
}

export default class Food {
    constructor(public name: string, public amount: number, public unit?: string, public type?: FoodType) {}
}