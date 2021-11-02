import Coordinates from "./Coordinates";

export default interface FieldInterface extends Coordinates{
    readonly id: string,
    role: string | number
}
