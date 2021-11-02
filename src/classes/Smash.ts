import Field from "./Field";
import Coordinates from "../Interfaces/Coordinates";
import Ball from "./Ball";

/** clasa odpowiedzialna za sprawdzanie możliwości zbicia */
export default class Smash{
    /** właściwosć która zapisuje pola które pasują i mogą być zbite */
    public fieldsToSmash: Field[] = []
    /** pola poasujące z ostatniej pętli algorytmu */
    private _lastLoopFields: Field[] = []
    constructor(public startField: Field, private _fields: Field[]) {
        this.fieldsToSmash = [this.startField]
        this._lastLoopFields = [this.startField]
        this.init()
    }
    /** metoda inicjalizująca która rozpoczyna algorytm i kończy go*/
    init():void {
        while(this._lastLoopFields.length > 0 ){
            this.step()
        }
        console.log('koniec')
    }
    /** jeden krok algorytmu odpowiedzialny za sprawdzenie czy pasującego poola nie ma już w polach do zniszczenia oraz dodaniu go do pól do zniszecznia oraz pól ostatniej pętli algorytmu  */
    step():void {
        const lastLoopFields = this._lastLoopFields
        this._lastLoopFields = []
        lastLoopFields.forEach(lastLoopField => {
            const {x, y}: Coordinates = lastLoopField
            const { children } = lastLoopField as { children: Ball }
            const matching = this.findMatchigFields(x , y, children)
            matching.forEach(match => {
                const alreadyInFieldsToSmash = this.fieldsToSmash.some(field => field.id === match.id)
                if(!alreadyInFieldsToSmash){
                    this.fieldsToSmash.push(match)
                    this._lastLoopFields.push(match)
                }
            })
        })
    }

    /** metoda odpowiedzialna za szukanie pasujących pól
     * @param x to współrzedna x pola którego pasujących sąsiadów szukamy
     * @param y to współrzedna y pola którego pasujących sąsiadów szukamy
     * @param children to kulka pola którego sąsiadów szukamu, potrzebna do sprawdzenia jej koloru
     * */
    findMatchigFields(x: number, y: number, children: Ball):Field[] {
        const matching: Field[] = this._fields.filter(field => {
            if(field.x === x + 1 || field.x === x - 1){
                if(field.y === y + 1 || field.y === y - 1 || field.y === y){
                    if(field.children?.color === children.color){
                        return field
                    }
                }
            }if(field.y === y + 1 || field.y === y - 1){
                if(field.x === x + 1 || field.x === x - 1 || field.x === x){
                    if(field.children?.color === children.color){
                        return field
                    }
                }
            }
            return false
        })
        return matching

    }

}
