import Coordinates from "../Interfaces/Coordinates";
import Ball from "./Ball";

export default class Field implements Coordinates {
    public container = document.createElement('div')
    public id: string
    public picked: boolean = false;
    constructor(public x: number, public y: number,public role: (string | number), public children: Ball | null = null) {
        this.id = `${this.x}-${this.y}`
        this.init()
    }
    init(): void{
        this.container.classList.add('field')
        if(this.children) {
            this.addBall()
        }
        document.querySelector<HTMLDivElement>('.fields__wrapper')!.append(this.container)
    }

    addBall = ():void => {
        this.container.append(this.children.container)
    }

    setPicked = ():boolean => {
        let result: boolean = false
        if(this.children){
            this.role = 'start'
            result = true
        }
        return result
    }

    setRole = (role: string | number ):void => {
        if(this.role === 0){
            this.role = role
        } else if(typeof this.role === 'number'){
            //Czyszczenie po ostatnim algorytmie
            this.role = 0
        }
        else if(this.role === 'finish' && role === 0) {
            this.role = role
            this.container.innerText = ''
        }
    }
}
