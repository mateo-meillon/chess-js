let root = document.getElementById('root')
let figures = [
    {name: 'Turm', k: 't', startb: 'a1', startw: 'a8'},
    {name: 'Pferd', k: 'p', startb: 'b1', startw: 'b8'},
    {name: 'Läufer', k: 'l', startb: 'c1', startw: 'c8'},
    {name: 'Dame', k: 'd', startb: 'd1', startw: 'd8'},
    {name: 'König', k: 'k', startb: 'e1', startw: 'e8'},
    {name: 'Läufer', k: 'l', startb: 'f1', startw: 'f8'},
    {name: 'Pferd', k: 'p', startb: 'g1', startw: 'g8'},
    {name: 'Turm', k: 't', startb: 'h1', startw: 'h8'},
    {name: 'Bauer', k: 'b', startb: 'a2', startw: 'a7'},
    {name: 'Bauer', k: 'b', startb: 'b2', startw: 'b7'},
    {name: 'Bauer', k: 'b', startb: 'c2', startw: 'c7'},
    {name: 'Bauer', k: 'b', startb: 'd2', startw: 'd7'},
    {name: 'Bauer', k: 'b', startb: 'e2', startw: 'e7'},
    {name: 'Bauer', k: 'b', startb: 'f2', startw: 'f7'},
    {name: 'Bauer', k: 'b', startb: 'g2', startw: 'g7'},
    {name: 'Bauer', k: 'b', startb: 'h2', startw: 'h7'}
]
let themes = [
    {
        name: 'Modern',
        white: [
            {fig: 't', src: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png'},
            {fig: 'p', src: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png'},
            {fig: 'l', src: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png'},
            {fig: 'd', src: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png'},
            {fig: 'k', src: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png'},
            {fig: 'b', src: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png'},
        ],
        black: [
            {fig: 't', src: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png'},
            {fig: 'p', src: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png'},
            {fig: 'l', src: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png'},
            {fig: 'd', src: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png'},
            {fig: 'k', src: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png'},
            {fig: 'b', src: 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png'},
        ]
    }
]

let move = new Audio('sounds/move.mp3');
let die = new Audio('sounds/die.mp3');

// Erstellt das Schachbrettmuster
let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
let zeilen = [1, 2, 3, 4, 5, 6, 7, 8]
zeilen.forEach(i => {
    let white = 1
    if (i === 1||i === 3||i === 5||i === 7)
        white = 2
    alphabet.forEach(b => {
        let field = document.createElement('div')
        field.id = b + i
        field.classList.add('field')
        if (white % 2 === 0) field.classList.add('white')
        root.appendChild(field)
        white++
    })
})

let mouseX
let mouseY

document.addEventListener('mousemove', (event) => {
        mouseX = event.pageX, mouseY = event.pageY
    }
)

// Generates the Figures on Brett
figures.forEach(figure => {
    createFigure(figure.startb, figure.k, 'black', 0)
    createFigure(figure.startw, figure.k, 'white', 0)
})

function createFigure(id, k, wb, theme) {
    let fig = document.createElement('div')
    fig.classList.add('figure')
    fig.id = id
    if (wb === 'white')
        fig.style.backgroundImage = `url(${themes[theme].white.find(t => t.fig === k).src})`
    else
        fig.style.backgroundImage = `url(${themes[theme].black.find(t => t.fig === k).src})`


    let field = document.getElementById(id)
    fig.style.top = field.offsetTop + 'px'
    fig.style.left = field.offsetLeft + 'px'

    root.appendChild(fig)

    fig.addEventListener('mousedown', event => {
        fig.classList.add('moving')
        myLoop()
        function myLoop() {
            setTimeout(function() {
                if (!fig.classList.contains('moving')) return;
                fig.style.top = mouseY - ((window.innerHeight * 0.1) + ((window.innerHeight * 0.8) / 8) / 2) + 'px'
                fig.style.left = mouseX - (((window.innerWidth - (window.innerHeight * 0.8)) / 2) + ((window.innerHeight * 0.8) / 8) / 2) + 'px'
                myLoop()
            }, 1)
        }
    })
    fig.addEventListener('mouseup', (event) => {
        fig.classList.remove('moving')
        fig.style.display = 'none'
        let x = event.clientX, y = event.clientY
        let aField = document.elementFromPoint(x, y);
        // Falls schon ein Spieler auf dem Feld ist, wird dieser gelöscht
        if (aField.classList.contains('figure')) {
            console.log("Removed:\n", aField)
            // Hier wird er gelöscht (Der richtige Lösch Vorgang wird beim updaten der db gemacht)
            //db.ref().child('Died').child(aField.id).set({ delete: true })
            root.removeChild(aField)
            // Findet den eigentlichen Kasten
            aField = document.elementFromPoint(x, y);
            console.log("New aField:\n", aField)
            die.play()
        } else
            move.play()
        fig.style.display = 'flex'
        fig.style.top = aField.offsetTop + 'px'
        fig.style.left = aField.offsetLeft + 'px'
    })
}
