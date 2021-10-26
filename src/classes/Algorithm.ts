import Field from "./Field";

export default class Algorithm {
    public lastMoveFields: Field[] = []
    public moveNumber: number = 1
    public finish:Field;
    public lastLoopPaths: Field[][] = []
    public fastestPath: Field[];

    constructor(public fields: Field[][], public paths: (Field)[][][]){
        this.main()
    }

    main = (): void => {
        const fields: Field[] = this.fields.flat()
        const startField = fields.find(field => field.role === 'start')
        this.paths[startField.y][startField.x].push(startField)
        this.lastMoveFields.push(startField)
        while(!this.finish){
            this.step()
        }
        console.log(this.lastLoopPaths)
        this.fastestPath?.forEach(field => field.container.style.backgroundColor = '#990000')

    }
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

    findAllNeigbors = (current_x: number, current_y: number):Field[] =>{
        const fields: Field[] = this.fields.flat()
        const neighbors = fields.filter((field) => {
            if(field.role === 0 || field.role === 'finish'){
                if(field.x === current_x){
                    if(field.y === current_y + 1 || field.y === current_y - 1){
                        return field
                    }
                }
                else if(field.y === current_y){
                    if(field.x === current_x + 1 || field.x === current_x - 1){
                        return field
                    }
                }
            }
        })

        neighbors.forEach(field => {
            if(field.role === 'finish') this.finish = field;
        })
        return neighbors
    }
    findAllFieldsOfLastMove = ():Field[] => {
        const  fields = this.fields.flat()
        return fields.filter(field => field.role === this.moveNumber)
    }
}





