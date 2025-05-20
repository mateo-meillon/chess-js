// Constants
const BOARD_SIZE = 8
const FIELD_PERCENTAGE = 100 / BOARD_SIZE
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const zeilen = Array.from({ length: BOARD_SIZE }, (_, i) => i + 1)

// Performance optimizations
let BOARD_OFFSET = {
	x: (window.innerWidth - window.innerHeight * 0.8) / 2,
	y: window.innerHeight * 0.1,
}
let PIECE_SIZE = (window.innerHeight * 0.8) / 8

// Update board dimensions on resize
function updateBoardDimensions() {
	BOARD_OFFSET = {
		x: (window.innerWidth - window.innerHeight * 0.8) / 2,
		y: window.innerHeight * 0.1,
	}
	PIECE_SIZE = (window.innerHeight * 0.8) / 8

	// Update all piece positions
	document.querySelectorAll('.figure').forEach((fig) => {
		const position = fig.id.slice(0, 2)
		const row = parseInt(position.slice(1))
		const col = position.slice(0, 1)
		fig.style.top = `${calculatePosition(row, zeilen)}%`
		fig.style.left = `${calculatePosition(col, alphabet)}%`
	})
}

// Add resize event listener
window.addEventListener('resize', updateBoardDimensions)

// Cache DOM elements
const root = document.getElementById('root')
const moveSound = new Audio('assets/sounds/move.mp3')
const dieSound = new Audio('assets/sounds/die.mp3')

// Preload sounds
moveSound.load()
dieSound.load()

let figures = [
	{ name: 'Rook', k: 'r', startB: 'a1', startW: 'a8' },
	{ name: 'Knight', k: 'n', startB: 'b1', startW: 'b8' },
	{ name: 'Bishop', k: 'b', startB: 'c1', startW: 'c8' },
	{ name: 'Queen', k: 'q', startB: 'd1', startW: 'd8' },
	{ name: 'King', k: 'k', startB: 'e1', startW: 'e8' },
	{ name: 'Bishop', k: 'b', startB: 'f1', startW: 'f8' },
	{ name: 'Knight', k: 'n', startB: 'g1', startW: 'g8' },
	{ name: 'Rook', k: 'r', startB: 'h1', startW: 'h8' },
	{ name: 'Pawn', k: 'p', startB: 'a2', startW: 'a7' },
	{ name: 'Pawn', k: 'p', startB: 'b2', startW: 'b7' },
	{ name: 'Pawn', k: 'p', startB: 'c2', startW: 'c7' },
	{ name: 'Pawn', k: 'p', startB: 'd2', startW: 'd7' },
	{ name: 'Pawn', k: 'p', startB: 'e2', startW: 'e7' },
	{ name: 'Pawn', k: 'p', startB: 'f2', startW: 'f7' },
	{ name: 'Pawn', k: 'p', startB: 'g2', startW: 'g7' },
	{ name: 'Pawn', k: 'p', startB: 'h2', startW: 'h7' },
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
	createFigure(figure.startB, figure.k, 'black', 0)
	createFigure(figure.startW, figure.k, 'white', 0)
})

// Get all occupied positions
function getOccupiedPositions() {
	return Array.from(document.querySelectorAll('.occupied')).map((field) => field.id)
}

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
		field.classList.add('starting-position')

		// Get valid moves for the piece using current position
		const pieceType = k
		const color = fig.getAttribute('data-color')
		const currentPosition = fig.id.slice(0, 2) // Get current position from ID
		console.log('Current piece position:', currentPosition)

		const occupiedPositions = getOccupiedPositions()
		console.log('Current occupied positions:', occupiedPositions)

		const validMoves = getValidMoves(currentPosition, pieceType, color, occupiedPositions)
		console.log('Valid moves:', validMoves)

		// Highlight valid moves
		highlightValidMoves(validMoves)

		fig.style.display = 'flex'
		updatePosition()
	})

	fig.addEventListener('mouseup', (event) => {
		isMoving = false
		fig.classList.remove('moving')
		cancelAnimationFrame(animationFrame)

		// Remove valid move highlights and starting position highlight
		document.querySelectorAll('.valid-move').forEach((el) => {
			el.classList.remove('valid-move')
		})
		document.querySelectorAll('.starting-position').forEach((el) => {
			el.classList.remove('starting-position')
		})

		fig.style.display = 'none'
		let field = document.elementFromPoint(event.clientX, event.clientY)

		// Check if the move is valid using current position
		const pieceType = k
		const color = fig.getAttribute('data-color')
		const currentPosition = fig.id.slice(0, 2) // Get current position from ID
		console.log('Validating move from position:', currentPosition)

		const occupiedPositions = getOccupiedPositions()
		const validMoves = getValidMoves(currentPosition, pieceType, color, occupiedPositions)
		console.log('Valid moves for validation:', validMoves)

		if (!validMoves.includes(field.id)) {
			console.log('Invalid move, returning to original position')
			// Invalid move, return to original position
			const originalField = document.getElementById(currentPosition)
			fig.style.display = 'flex'
			fig.style.top = `${calculatePosition(parseInt(currentPosition.slice(1)), zeilen)}%`
			fig.style.left = `${calculatePosition(currentPosition.slice(0, 1), alphabet)}%`
			originalField.classList.add('occupied')
			return
		}

		if (field.classList.contains('figure')) {
			if (field.getAttribute('data-color') === fig.getAttribute('data-color')) {
				const originalField = document.getElementById(currentPosition)
				fig.style.display = 'flex'
				fig.style.top = `${calculatePosition(parseInt(currentPosition.slice(1)), zeilen)}%`
				fig.style.left = `${calculatePosition(currentPosition.slice(0, 1), alphabet)}%`
				originalField.classList.add('occupied')
				return
			}
			root.removeChild(field)
			field = document.elementFromPoint(event.clientX, event.clientY)
			dieSound.play()
		} else {
			moveSound.play()
		}

		// Update the piece's position and ID
		const newPosition = field.id
		fig.id = `${newPosition}${k}`
		field.classList.add('occupied')
		fig.style.display = 'flex'

		const row = parseInt(newPosition.slice(1))
		const col = newPosition.slice(0, 1)
		fig.style.top = `${calculatePosition(row, zeilen)}%`
		fig.style.left = `${calculatePosition(col, alphabet)}%`

		// Update the piece's data attributes
		fig.setAttribute('data-position', newPosition)
	})
}
