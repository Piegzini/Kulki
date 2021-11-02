import Field from "./Field";
import '../style/Field.css'
import Algorithm from "./Algorithm";
import Coordinates from "../Interfaces/Coordinates";
import Ball from "./Ball";
import Smash from "./Smash";

/** Klasa odpowidzialna za, plansze oraz całą mechanikę gry */
export default class Board{
    movesAndElements: (number | string)[][] = []
    /** Tabela, tabel, tabel w krórych przechowywane są pola w odpowiedniej kolejności dla scieżek*/
    private _paths: Field[][][] = []
    /** Tabela reprezentująca obekty field, czyli pola z których składa się plansza do grania*/
    private _fields: Field[][] = []
    /** Zmienna przechowująca kulki które są w preview */
    public previewBalls: Ball[] = []
    /** Liczba punktów  gracza */
    private _points: number = 0
    constructor(public width: number, public height: number,) {
        this.init()
    }
    /** Metoda inicjalizacji po kolei odpala poszcczególne metody które potrzebne sa do zbudowania planszy oraz rozpoczęcią gdy */
    init():void {
        this.createMovesAndPathsTables()
        this.getWalls()
        this.createFields()
        this.getPreviewBalls()
        this.checkStartAndFinish()
    }
    /** metoda odpowiedzialna za tworzenie sobie tablicy ze scieżkami oraz za początkowy układ kulek */
    createMovesAndPathsTables():void{
        for(let y: number = 0; y < this.width; y++) {
            this.movesAndElements.push([])
            this._paths.push([])
            for (let x: number = 0; x < this.height; x++) {
                this.movesAndElements[y].push(0);
                this._paths[y].push([]);
            }
        }
    }
    /** Metoda odpowiedzialna za czyszczenie scieżek, używana przy końcu ruchu kulki */
    clearPaths():void {
        this._paths = []
        for(let y: number = 0; y < this.width; y++) {
            this._paths.push([])
            for (let x: number = 0; x < this.height; x++) {
                this._paths[y].push([]);
            }
        }
    }
    /** Metoda odpowiedzialna za stowrzenie obiektów pól i wrzycenie ich to tabeli z polami. Nadaje polom na początkowe 4 kulki */
    createFields(): void{
        const size: string = `${this.width * 50}px`
        document.querySelector<HTMLDivElement>('.fields__wrapper')!.style.width = size
        document.querySelector<HTMLDivElement>('.fields__wrapper')!.style.height = size

        this.movesAndElements.forEach((row, y) => {
            this._fields.push([])
            row.forEach((role, x ) => {
                const children = role === 'ball' ? new Ball() : null
                const field = new Field(x,y, role, children)
                this._fields[y].push(field)
            })
        })
    }
    /** Metoda odpowiedzialna za wylosowanie pozycji początkowych kulek*/
    rollWall():Coordinates {
        const x:number = Math.floor(Math.random() * (this.width)) ;
        const y:number = Math.floor(Math.random() * (this.height)) ;
        return {x ,y}

    }
    /** Metoda odpowiedzialna za przypisanie do pola kulki i sprawdzenie czy czasami pole nie ma już przypisanej kulki */
    getWalls():void{
        const walls: Array<any> = []
        while(walls.length < 4){
            const {x, y}: Coordinates = this.rollWall()
            if(this.movesAndElements[y][x] === 0){
                this.movesAndElements[y][x] = 'ball'
                walls.push({x, y})
            }

        }
    }
    /** Metoda odpowiedzialna za czyszczenie eventów z pól */

    clearMouseEvents = ():void => {
        this._fields.flat().forEach(field => {
            field.container.onmouseup = null
            field.container.onmouseenter = null
            field.container.onmouseleave = null
        })
    }
    /** Metoda odpowiedzialna za logike działania po kolei dawania startu oraz podświetlanie scieżki oraz po ruchu czysczeniu sprawdzaniu itp itd */
    checkStartAndFinish():void{
        const fields: Field[] = this._fields.flat()
        const startOnBoard: Boolean = fields.some(field => field.role === 'start')
        const finishOnBoard: Boolean = fields.some(field => field.role === 'finish')

        console.log(startOnBoard, finishOnBoard)
        if(!startOnBoard && !finishOnBoard){
            for(const field of fields){
                field.container.onmouseup = () => {
                    const {x , y}: Coordinates = field
                    const neighbors = this._fields.flat().filter(_field => {
                        if(_field.x === x + 1 || _field.x === x -1){
                            if(_field.y == y){
                                return _field
                            }
                        }if(_field.y === y + 1 || _field.y === y -1){
                            if(_field.x == x){
                                return _field
                            }
                        }
                        return false
                    })

                    const canMove = !neighbors.every(neighbors => neighbors.children)

                    let picked: boolean = false
                    if(canMove){
                        picked = field.setPicked()
                    }
                    if(picked) {
                        this.clearMouseEvents()
                        this.checkStartAndFinish()
                    }

                }
            }
        }
        else if (startOnBoard && !finishOnBoard){
            for(const field of fields) {
                field.container.onmouseup = ():void => {
                    const startField = this._fields.flat().find(field => field.role === 'start')
                    if(field.id === startField?.id){
                        field.removePicked()
                        field.setBall()
                        field.children?.pickBall()
                        this.clearMouseEvents()
                        this.checkStartAndFinish()
                    }else{
                        field.setFinish()
                        const { fastestPath } =  new Algorithm(this._fields, this._paths)
                        if(fastestPath){
                            this.clearMouseEvents()
                            const indexOfStartField = this._fields.flat().findIndex(field => field.role === 'start')
                            const { children } = this._fields.flat()[indexOfStartField] as { children: Ball }
                            this._fields.flat()[indexOfStartField].removeChildren()
                            field.setChildren(children)
                            fastestPath?.forEach(field => field.container.style.backgroundColor = '#555')
                            this.checkStartAndFinish()

                        }
                    }

                }
                field.container.onmouseenter= ():void => {
                    field.setFinish()
                    const {fastestPath} = new Algorithm(this._fields, this._paths)
                    fastestPath?.forEach(field => field.container.style.backgroundColor = '#C2185B')
                }
                field.container.onmouseleave = ():void => {
                    field.setRole(0)
                    this._fields.flat().forEach(field => {
                        field.setRole(0)
                        field.container.style.backgroundColor = 'transparent'
                    })
                }

            }
        }else{
            const fields = this._fields.flat()
            const indexOfStartField = fields.findIndex(field => field.role === 'start')
            this._fields.flat()[indexOfStartField]?.removePicked()

            const indexOfFinishField = fields.findIndex(field => field.role === 'finish')
            this._fields.flat()[indexOfFinishField]?.removePicked()
            this._fields.flat()[indexOfFinishField]?.setBall()




            this.clearPaths()
            setTimeout(() => {
                this._fields.flat().forEach(field => {
                    field.setRole(0)
                    field.container.style.backgroundColor = 'transparent'
                })

                const smash = new Smash(this._fields.flat()[indexOfFinishField], this._fields.flat())
                console.log(smash.fieldsToSmash)
                if(smash.fieldsToSmash.length > 4){
                    smash.fieldsToSmash.forEach(fieldToSmash => {
                        this._fields.flat().forEach(field =>{
                            if(field.id === fieldToSmash.id){
                                field.removeChildren()
                                field.removePicked()
                                this._points += 1

                            }
                        })
                    })
                }

                document.getElementById('points')!.textContent = `Punkty: ${this._points}`


                this.setNewBalls()
                this.checkStartAndFinish()
            }, 1000)

        }


    }
    /** Metoda odpowiedzialna za lowowanie indexu kulki z preview na plansze*/
    getNewBallsIndexes = ():number[] => {
        const newBallsIndexes: number[] = []
        while(newBallsIndexes.length < 3) {
            const {x, y}: Coordinates = this.rollWall()
            const index:number = this._fields.flat().findIndex(field => field.x === x && field.y === y && field.role === 0)
            if(index !== -1 && !newBallsIndexes.includes(index)){
                newBallsIndexes.push(index)
            }
        }
        return newBallsIndexes
    }

    /** Metoda odpowiedzialna za wyciagnieciu kulek z prieview oraz dodanie ich do planszy */
    setNewBalls = ():void => {
        const indexes:number[] = this.getNewBallsIndexes()
        for(const index in indexes){
            const ball = this.previewBalls[index]
            const position = indexes[index]
            this._fields.flat()[position].setChildren(ball, false)
            this._fields.flat()[position].setBall()
        }
        this.getPreviewBalls()
    }
    /** Metoda odpowiedzialna za wyświetlenie widoku następnych kulek */
    getPreviewBalls = ():void => {
        this.previewBalls = []

        const wrapper = document.getElementById('ball__preview') as HTMLDivElement

        while (wrapper.firstChild) {
            wrapper.removeChild(wrapper.lastChild!);
        }

        while(this.previewBalls.length < 3) {
            const ball: Ball = new Ball()
            this.previewBalls.push(ball)
        }

        for(const ball of this.previewBalls){
            wrapper.appendChild(ball.container)
        }
    }


}
