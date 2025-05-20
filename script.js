// Constants
const BOARD_SIZE = 8
const FIELD_PERCENTAGE = 100 / BOARD_SIZE
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const zeilen = Array.from({ length: BOARD_SIZE }, (_, i) => i + 1)

// Performance optimizations
const BOARD_OFFSET = {
	x: (window.innerWidth - window.innerHeight * 0.8) / 2,
	y: window.innerHeight * 0.1,
}
const PIECE_SIZE = (window.innerHeight * 0.8) / 8

// Cache DOM elements
const root = document.getElementById('root')
const moveSound = new Audio('assets/sounds/move.mp3')
const dieSound = new Audio('assets/sounds/die.mp3')

// Preload sounds
moveSound.load()
dieSound.load()

let figures = [
	{ name: 'Rook', k: 'r', startb: 'a1', startw: 'a8' },
	{ name: 'Knight', k: 'n', startb: 'b1', startw: 'b8' },
	{ name: 'Bishop', k: 'b', startb: 'c1', startw: 'c8' },
	{ name: 'Queen', k: 'q', startb: 'd1', startw: 'd8' },
	{ name: 'King', k: 'k', startb: 'e1', startw: 'e8' },
	{ name: 'Bishop', k: 'b', startb: 'f1', startw: 'f8' },
	{ name: 'Knight', k: 'n', startb: 'g1', startw: 'g8' },
	{ name: 'Rook', k: 'r', startb: 'h1', startw: 'h8' },
	{ name: 'Pawn', k: 'p', startb: 'a2', startw: 'a7' },
	{ name: 'Pawn', k: 'p', startb: 'b2', startw: 'b7' },
	{ name: 'Pawn', k: 'p', startb: 'c2', startw: 'c7' },
	{ name: 'Pawn', k: 'p', startb: 'd2', startw: 'd7' },
	{ name: 'Pawn', k: 'p', startb: 'e2', startw: 'e7' },
	{ name: 'Pawn', k: 'p', startb: 'f2', startw: 'f7' },
	{ name: 'Pawn', k: 'p', startb: 'g2', startw: 'g7' },
	{ name: 'Pawn', k: 'p', startb: 'h2', startw: 'h7' },
]

// Board creation
const createBoard = () => {
	const rows = Array.from({ length: BOARD_SIZE }, (_, i) => i + 1)

	rows.forEach((row) => {
		const isEvenRow = row % 2 === 0
		alphabet.forEach((col, colIndex) => {
			const field = document.createElement('div')
			field.id = `${col}${row}`
			field.classList.add('field')
			if ((isEvenRow && colIndex % 2 === 0) || (!isEvenRow && colIndex % 2 === 1)) {
				field.classList.add('white')
			}
			root.appendChild(field)
		})
	})
}

// Calculate position percentage
const calculatePosition = (value, array) => {
	const index = array.indexOf(value)
	return index !== -1 ? index * FIELD_PERCENTAGE : 0
}

// Initialize board
createBoard()

// Mouse tracking
let mouseX, mouseY
document.addEventListener('mousemove', (event) => {
	mouseX = event.pageX
	mouseY = event.pageY
})

// Creates the Figures on the chessboard
figures.forEach((figure) => {
	createFigure(figure.startb, figure.k, 'black', 0)
	createFigure(figure.startw, figure.k, 'white', 0)
})

function createFigure(id, k, wb) {
	const fig = document.createElement('div')
	fig.classList.add('figure')
	fig.id = `${id}${k}`
	fig.setAttribute('data-color', wb)

	const themeData = `assets/pieces/${wb.slice(0, 1).toLowerCase()}${k}.png`
	fig.style.backgroundImage = `url(${themeData})`

	const field = document.getElementById(id)
	field.classList.add('occupied')

	// Set initial position
	const row = parseInt(id.slice(1))
	const col = id.slice(0, 1)
	fig.style.top = `${calculatePosition(row, zeilen)}%`
	fig.style.left = `${calculatePosition(col, alphabet)}%`

	root.appendChild(fig)

	// Movement handling
	let isMoving = false
	let animationFrame

	const updatePosition = () => {
		if (!isMoving) return

		fig.style.top = `${mouseY - (BOARD_OFFSET.y + PIECE_SIZE / 2)}px`
		fig.style.left = `${mouseX - (BOARD_OFFSET.x + PIECE_SIZE / 2)}px`

		animationFrame = requestAnimationFrame(updatePosition)
	}

	fig.addEventListener('mousedown', (event) => {
		isMoving = true
		fig.classList.add('moving')
		fig.style.display = 'none'

		const field = document.elementFromPoint(event.clientX, event.clientY)
		field.classList.remove('occupied')

		fig.style.display = 'flex'
		updatePosition()
	})

	fig.addEventListener('mouseup', (event) => {
		isMoving = false
		fig.classList.remove('moving')
		cancelAnimationFrame(animationFrame)

		fig.style.display = 'none'
		let field = document.elementFromPoint(event.clientX, event.clientY)

		if (field.classList.contains('figure')) {
			if (field.getAttribute('data-color') === fig.getAttribute('data-color')) {
				const originalField = document.getElementById(id)
				fig.style.display = 'flex'
				fig.style.top = `${calculatePosition(parseInt(id.slice(1)), zeilen)}%`
				fig.style.left = `${calculatePosition(id.slice(0, 1), alphabet)}%`
				originalField.classList.add('occupied')
				return
			}
			root.removeChild(field)
			field = document.elementFromPoint(event.clientX, event.clientY)
			dieSound.play()
		} else {
			moveSound.play()
		}

		field.classList.add('occupied')
		fig.style.display = 'flex'

		const row = parseInt(field.id.slice(1))
		const col = field.id.slice(0, 1)
		fig.style.top = `${calculatePosition(row, zeilen)}%`
		fig.style.left = `${calculatePosition(col, alphabet)}%`
	})
}
