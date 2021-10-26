import Field from "./Field";
import '../style/Field.css'
import Algorithm from "./Algorithm";
import Coordinates from "../Interfaces/Coordinates";
import Ball from "./Ball";

export default class Board{
    movesAndElements: (number | string)[][] = []
    paths: Field[][][] = []
    fields: Field[][] = []
    constructor(public width: number, public height: number,) {
        this.init()
    }

    init():void {
        this.createMovesAndPathsTables()
        this.getWalls()
        this.createFields()
        this.checkStartAndFinish()
    }

    createMovesAndPathsTables():void{

        for(let y: number = 0; y < this.width; y++) {
            this.movesAndElements.push([])
            this.paths.push([])
            for (let x: number = 0; x < this.height; x++) {
                this.movesAndElements[y].push(0);
                this.paths[y].push([]);
            }
        }
    }

    createFields(): void{
        const size: string = `${this.width * 50}px`
        document.querySelector<HTMLDivElement>('.fields__wrapper')!.style.width = size
        document.querySelector<HTMLDivElement>('.fields__wrapper')!.style.height = size

        this.movesAndElements.forEach((row, y) => {
            this.fields.push([])
            row.forEach((role, x ) => {
                const children = role === 'ball' ? new Ball() : null
                const field = new Field(x,y, role, children)
                this.fields[y].push(field)
            })
        })
    }

    rollWall():Coordinates {
        const x:number = Math.floor(Math.random() * (this.width)) ;
        const y:number = Math.floor(Math.random() * (this.height)) ;
        return {x ,y}

    }

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

    checkStartAndFinish():void{
        const roles: (string | number)[] = this.movesAndElements.flat()
        const startOnBoard: Boolean = roles.includes('start')
        const finishOnBoard: Boolean = roles.includes('finish')
        const fields: Field[] = this.fields.flat()

        let role: string = '';
        if(!startOnBoard && !finishOnBoard) role = 'start'
        else role = 'finish'
        // else if(startOnBoard && !finishOnBoard) role = 'finish'
        if(role === 'start'){
            for(const field of fields){
                field.container.onclick = () => {
                    const picked: boolean = field.setPicked()
                    if(picked){
                        const {x , y}: Coordinates = field
                        this.setStartOrStart(x, y, role)
                    }
                }

            }
        }else if (role === 'finish'){
            for(const field of fields) {
                field.container.onmouseover = () => {
                    field.setRole(role)
                    const {x, y}: Coordinates = field
                    this.setStartOrStart(x, y, role)

                    new Algorithm(this.fields, this.paths)
                }
                field.container.onmouseout = () => {
                    field.setRole(0)
                    const {x, y}: Coordinates = field
                    this.setStartOrStart(x, y, 0)
                    this.fields.flat().forEach(field => {
                        field.setRole(0)
                        field.container.style.backgroundColor = 'transparent'
                    })
                }

            }
        }

    }

    setStartOrStart(x:number, y: number, role: string | number):void{
        //Sprawdzanie czy pole ma już jakąś role
        if(this.movesAndElements[y][x] === 0){
            this.movesAndElements[y][x] = role
        }
        if(role === 0){
            this.movesAndElements[y][x] = role

        }
        const fields: Field[] = this.fields.flat()
        for(const field of fields) field.container.onclick = null;

        this.checkStartAndFinish()
    }

}
