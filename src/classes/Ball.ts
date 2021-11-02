import '../style/Ball.css'
import Colors from "../Interfaces/Colors";

export default class Ball {
    /** Div reprezentujący kulkę*/
    public container: HTMLDivElement = document.createElement('div')
    /** Kolor kulki*/
    public color!: string;
    constructor() {
        this.init()
    }
    /**
     * Inicjalizacja clasy ball
     * @Todo Dodanie klasy do containeru oraz odanie odpowiedniego backgroundcolor dla kulki */
    init = ():void => {
        const colors: Colors = {
            values: ['red', 'green', 'yellow', 'purple', 'orange', 'pink']
        }

        this.color = colors.values[Math.floor(Math.random() * colors.values.length)];
        this.container.classList.add('ball')
        this.container.style.backgroundColor = this.color

    }

    /**
     * Zmienia wielkość kulki podczas klikania
     */
    pickBall = ():void =>{
        console.log('Zmieniam wielkość')
        this.container.classList.toggle('picked__ball')
    }

}
