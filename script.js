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

// Creates the chessboard pattern
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

// Creates the Figures on the chessboard
figures.forEach(figure => {
    createFigure(figure.startb, figure.k, 'black', 0)
    createFigure(figure.startw, figure.k, 'white', 0)
})

function createFigure(id, k, wb, theme) {
    let fig = document.createElement('div')
    fig.classList.add('figure')
    fig.id = id + k
    if (wb === 'white')
        fig.style.backgroundImage = `url(${themes[theme].white.find(t => t.fig === k).src})`
    else
        fig.style.backgroundImage = `url(${themes[theme].black.find(t => t.fig === k).src})`


    let field = document.getElementById(id)

    let prozent = 0
    let found = false
    zeilen.forEach(zahl =>  {
        if (zahl === parseInt(field.id.slice(1, 2))) {
            found = true
        } else {
            if (found === true) return
            prozent = prozent + 12.5
        }
    })
    fig.style.top = prozent + '%'

    prozent = 0
    found = false
    alphabet.forEach(alp => {
        if (alp === field.id.slice(0, 1)) {
            found = true
        } else {
            if (found === true) return
            prozent = prozent + 12.5
        }
    })

    fig.style.left = prozent + '%'

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
        // If there is already a player on the field, it will be deleted
        if (aField.classList.contains('figure')) {
            console.log("Removed:\n", aField)
            root.removeChild(aField)
            // Finds the actual field
            aField = document.elementFromPoint(x, y);
            console.log("New aField:\n", aField)
            die.play()
        } else
            move.play()
        fig.style.display = 'flex'
        fig.style.top = getProzent(zeilen, aField, 1, 2, 'number')
        fig.style.left = getProzent(alphabet, aField, 0, 1, 'string')
    })
}


// Return the top and left px to %
function getProzent(array, field, a, b, lol) {
    let prozent = 0
    let found = false
    array.forEach(zahl =>  {
        if (lol == 'number') {
            if (zahl === parseInt(field.id.slice(a, b)))
                found = true
            else {
                if (found === true) return
                prozent = prozent + 12.5
            }
        } else {
            if (zahl === field.id.slice(a, b))
                found = true
            else {
                if (found === true) return
                prozent = prozent + 12.5
            }
        }
    })
    return prozent + '%'
}

document.addEventListener('contextmenu', (event) => {
    event.preventDefault()
})
