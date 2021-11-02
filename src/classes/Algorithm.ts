import Field from "./Field";
/** @module Algorithm odpowiedzialny za algorytm pathfindingu*/

export default class Algorithm {
    /** Właściwość która zapisuje pola z ostatniego ruchu algorytmu step */
    public lastMoveFields: Field[] = []
    /** Właściwość która zapisuje którą pętle wykonuje algorytm*/
    public moveNumber: number = 1
    /** Właściwość która zapisuje pole finishu*/
    public finish!:Field;
    /** Właściwosć zapisuje fola z pętli algorytmu*/
    public lastLoopPaths: Field[][] = []
    /** Właściwosć zapisuje scieżki*/
    public fastestPath!: Field[];

    constructor(public fields: Field[][], public paths: (Field)[][][]){
        this.main()
    }
    /** Metoda znajduje pole początkowe i uruchamia algorytm*/
    main = (): void => {
        const fields: Field[] = this.fields.flat()
        const startField = fields.find(field => field.role === 'start') as Field

        this.paths[startField.y][startField.x].push(startField)
        this.lastMoveFields.push(startField)
        while(!this.finish){
            this.step()
        }


    }
    /** Metoda jednego ruchu algorytmu która zapisuje w tabeli paths scieżki*/
    step = (): void => {
        const lastMoveFields: Field[] = this.lastMoveFields

        this.lastLoopPaths = []
        for(const lastMoveField of lastMoveFields){
            const {x , y} = lastMoveField as {x: number, y: number}
            const neighbors = this.findAllNeigbors(x, y)
            for(const neighbor of neighbors){
                this.paths[neighbor.y][neighbor.x] = [...this.paths[y][x], neighbor]
                this.lastLoopPaths.push(this.paths[neighbor.y][neighbor.x])
                if(neighbor.role === 'finish') {
                    this.fastestPath = this.paths[neighbor.y][neighbor.x]
                    break
                }else{
                    neighbor.setRole(this.moveNumber)
                }
            }
        }

        this.lastMoveFields = this.findAllFieldsOfLastMove()
        if(this.lastMoveFields.length <= 0) {
            this.finish = lastMoveFields[0]
        }
        this.moveNumber+=1
    }
    /** methoda odpowiedzialna za szukanie sąsiednich pól, pola którego współrzedne podamy
     * @param current_x współrzędna x pola którego sąsiadów szukamy
     * @param current_y współrzędna y pola którego sąsiadów szukamy
     * */
    findAllNeigbors = (current_x: number, current_y: number):Field[] =>{
        const fields = this.fields.flat() as Field[]
        const neighbors = fields.filter((field) => {
            if(field.role === 0 || field.role === 'finish'){
                if(field.x === current_x){
                    if(field.y === current_y + 1 || field.y === current_y - 1){
                        return field
                    }else{
                        return false
                    }
                }
                else if(field.y === current_y){
                    if(field.x === current_x + 1 || field.x === current_x - 1){
                        return field
                    }else {
                        return false
                    }
                }else{
                    return false
                }
            }else {
                return false
            }
        })

        neighbors.forEach(field => {
            if(field.role === 'finish') this.finish = field;
        })
        return neighbors
    }
    /**Metoda odpowiedzialna za szukanie  pol z ostatniego ruchu algorytmu na podstawie numeru ruchu algorytmu i roli pola */
    findAllFieldsOfLastMove = ():Field[] => {
        const  fields = this.fields.flat()
        return fields.filter(field => field.role === this.moveNumber)
    }
}





