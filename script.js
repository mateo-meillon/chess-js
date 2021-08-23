let root = document.getElementById('root')
let figures = [
    {name: 'Turm', k: 't', startw: 'a1', startb: 'h1'},
    {name: 'Pferd', k: 'p', startw: 'a2', startb: 'h2'},
    {name: 'Läufer', k: 'l', startw: 'a3', startb: 'h3'},
    {name: 'Dame', k: 'd', startw: 'a4', startb: 'h4'},
    {name: 'König', k: 'k', startw: 'a5', startb: 'h5'},
    {name: 'Läufer', k: 'l', startw: 'a6', startb: 'h6'},
    {name: 'Pferd', k: 'p', startw: 'a7', startb: 'h7'},
    {name: 'Turm', k: 't', startw: 'a8', startb: 'h8'},
    {name: 'Bauer', k: 'b', startw: 'b1', startb: 'g1'},
    {name: 'Bauer', k: 'b', startw: 'b2', startb: 'g2'},
    {name: 'Bauer', k: 'b', startw: 'b3', startb: 'g3'},
    {name: 'Bauer', k: 'b', startw: 'b4', startb: 'g4'},
    {name: 'Bauer', k: 'b', startw: 'b5', startb: 'g5'},
    {name: 'Bauer', k: 'b', startw: 'b6', startb: 'g6'},
    {name: 'Bauer', k: 'b', startw: 'b7', startb: 'g7'},
    {name: 'Bauer', k: 'b', startw: 'b8', startb: 'g8'}
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

// Erstellt das Schachbrettmuster
let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
alphabet.forEach(b => {
    let white = 1
    if (b === 'a'||b === 'c'||b === 'e'||b === 'g')
        white = 2
    for (let i = 1; i < 9; i++) {
        let field = document.createElement('div')
        field.id = b + i
        field.classList.add('field')
        if (white % 2 === 0) field.classList.add('white')
        root.appendChild(field)
        white++
    }
})

let mouseX
let mouseY

document.addEventListener('mousemove', (event) => {
        mouseX = event.pageX, mouseY = event.pageY
    }
)

// Generates the Figures on Brett
figures.forEach(figure => {
    // White
    createFigure(figure.startw, figure.k, 'white', 0)
    // Black
    createFigure(figure.startb, figure.k, 'black', 0)
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
                fig.style.top = mouseY - window.innerHeight * 0.1 - (window.innerHeight / 8) * 0.5  + 'px'
                fig.style.left = mouseX - (window.innerWidth - (window.innerHeight * 0.8)) * 0.5 - (((window.innerWidth - (window.innerHeight * 0.8)) / 8) * 0.5) + 'px'
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
        }
        fig.style.display = 'flex'
        fig.style.top = aField.offsetTop + 'px'
        fig.style.left = aField.offsetLeft + 'px'
    })
}
