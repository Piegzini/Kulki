import FieldInterface from "../Interfaces/Field";
import Ball from "./Ball";
/** @module Field odpowiedzialny za clase obiektu pola*/
/**  Clasa field implementuje Coordinates, czyli clasa field musi miec współrzedne inaczej nie bedzie działać, współrzędne podajemy w constructor */
export default class Field implements FieldInterface {
    /**  Cointainer to div który reprezentje field na planszy*/
    public container = document.createElement('div')
    /**  Id pola*/
    public id: string
    /**  Constructor*/
    constructor(public x: number, public y: number,public role: (string | number), public children: Ball | null = null) {
        this.id = `${this.x}-${this.y}`
        this.init()
    }
    /**  Inicjalizuje obiekt field i jego container na planszy*/
    init(): void{
        this.container.classList.add('field')
        if(this.children) {
            this.addBall()
        }
        document.querySelector<HTMLDivElement>('.fields__wrapper')!.append(this.container)
    }

    addBall = ():void => {
        this.container.append(this.children!.container)
    }
    setChildren = (children:Ball, ballIsPicked: boolean = true):void => {
        this.children = children
        this.addBall()
        if(ballIsPicked) this.children.pickBall()
    }
    removeChildren = () => {
        if(this.children){
            this.container.removeChild(this.children.container)
            this.children = null
        }
    }

    /**
     * Ustawia punkt poczatkowy dla algorytmu. Sprawdza czy pole ma w sobie kulkę.
     * @returns  Logiczną wartość, false kiedy pole nie ma kulki, true gdy pole ma kulkę
     */
    setPicked = ():boolean => {
        let result: boolean = false
        if(this.children){
            this.role = 'start'
            result = true
            this.children.pickBall()
        }
        return result
    }
    removePicked  = ():void => {
        this.role = 0
    }

    setFinish = ():void => {
        if(this.role === 0){
            this.role = 'finish'
        }
    }

    setBall = ():void => {
        this.role = 'ball'
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
