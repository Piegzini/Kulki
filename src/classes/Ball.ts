import '../style/Ball.css'
export default class Ball {
    public container: HTMLDivElement = document.createElement('div')
    private readonly _colors: string[] = ['red', 'green', 'yellow', 'blue', 'gray', 'white', 'purple']
    public readonly color: string = this._colors[Math.floor(Math.random()* this._colors.length)];
    constructor() {
        this.init()
    }

    init = ():void => {
        console.log(this.color)
        this.container.classList.add('ball')
        this.container.style.backgroundColor = this.color
    }
}
