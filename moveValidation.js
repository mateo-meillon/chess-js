// Chess move validation logic
// Using BOARD_SIZE and alphabet from script.js

// Helper function to convert chess notation to array indices
function notationToIndices(notation) {
	const col = alphabet.indexOf(notation[0])
	const row = parseInt(notation[1]) - 1
	console.log('Converting notation:', { notation, col, row, BOARD_SIZE })
	return { row, col }
}

// Helper function to convert array indices to chess notation
function indicesToNotation(row, col) {
	const notation = `${alphabet[col]}${row + 1}`
	console.log('Converting indices:', { row, col, notation })
	return notation
}

// Helper function to check if a position is within board bounds
function isWithinBounds(row, col) {
	return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
}

// Helper function to check if a position is occupied
function isPositionOccupied(position, occupiedPositions) {
	const isOccupied = occupiedPositions.includes(position)
	console.log('Checking if position is occupied:', { position, isOccupied, occupiedPositions })
	return isOccupied
}

// Helper function to check if a position is occupied by an opponent
function isOpponentPosition(position, occupiedPositions, currentColor) {
	const field = document.getElementById(position)

	if (!field) {
		return false
	}

	if (!field.classList.contains('occupied')) {
		return false
	}

	const figure = document.querySelector(`.figure[id^="${position}"]`)
	if (!figure) {
		return false
	}

	const figureColor = figure.getAttribute('data-color')
	return figureColor !== currentColor
}

// Get valid moves for a pawn
function getPawnMoves(position, color, occupiedPositions) {
	const { row, col } = notationToIndices(position)
	console.log('Pawn position:', { position, row, col, color })

	const moves = []
	const direction = color === 'white' ? -1 : 1
	const startRow = color === 'white' ? 6 : 1
	console.log('Pawn movement:', { direction, startRow, currentRow: row })

	// Forward move
	const forwardRow = row + direction
	console.log('Checking forward move:', { forwardRow, col })

	if (isWithinBounds(forwardRow, col)) {
		const forwardPos = indicesToNotation(forwardRow, col)
		console.log('Forward position:', forwardPos)

		if (!isPositionOccupied(forwardPos, occupiedPositions)) {
			moves.push(forwardPos)
			console.log('Added forward move')

			// Double move from starting position
			if (row === startRow) {
				const doubleMoveRow = row + 2 * direction
				const doubleMovePos = indicesToNotation(doubleMoveRow, col)
				console.log('Checking double move:', { doubleMoveRow, col, doubleMovePos })

				if (!isPositionOccupied(doubleMovePos, occupiedPositions)) {
					moves.push(doubleMovePos)
					console.log('Added double move')
				}
			}
		}
	}

	// Capture moves
	;[-1, 1].forEach((offset) => {
		const captureRow = row + direction
		const captureCol = col + offset

		if (isWithinBounds(captureRow, captureCol)) {
			const capturePos = indicesToNotation(captureRow, captureCol)
			console.log('Checking capture move:', { captureRow, captureCol, capturePos })

			if (isOpponentPosition(capturePos, occupiedPositions, color)) {
				moves.push(capturePos)
				console.log('Added capture move')
			}
		}
	})

	console.log('Final pawn moves:', moves)
	return moves
}

// Get valid moves for a rook
function getRookMoves(position, color, occupiedPositions) {
	const { row, col } = notationToIndices(position)
	const moves = []
	const directions = [
		[0, 1],
		[0, -1],
		[1, 0],
		[-1, 0],
	] // right, left, down, up

	directions.forEach(([rowDir, colDir]) => {
		let currentRow = row + rowDir
		let currentCol = col + colDir

		while (isWithinBounds(currentRow, currentCol)) {
			const currentPos = indicesToNotation(currentRow, currentCol)

			if (isPositionOccupied(currentPos, occupiedPositions)) {
				if (isOpponentPosition(currentPos, occupiedPositions, color)) {
					moves.push(currentPos)
				}
				break
			}

			moves.push(currentPos)
			currentRow += rowDir
			currentCol += colDir
		}
	})

	return moves
}

// Get valid moves for a knight
function getKnightMoves(position, color, occupiedPositions) {
	const { row, col } = notationToIndices(position)
	const moves = []
	const knightMoves = [
		[-2, -1],
		[-2, 1],
		[-1, -2],
		[-1, 2],
		[1, -2],
		[1, 2],
		[2, -1],
		[2, 1],
	]

	knightMoves.forEach(([rowOffset, colOffset]) => {
		const newRow = row + rowOffset
		const newCol = col + colOffset

		if (isWithinBounds(newRow, newCol)) {
			const newPos = indicesToNotation(newRow, newCol)
			if (!isPositionOccupied(newPos, occupiedPositions) || isOpponentPosition(newPos, occupiedPositions, color)) {
				moves.push(newPos)
			}
		}
	})

	return moves
}

// Get valid moves for a bishop
function getBishopMoves(position, color, occupiedPositions) {
	const { row, col } = notationToIndices(position)
	const moves = []
	const directions = [
		[1, 1],
		[1, -1],
		[-1, 1],
		[-1, -1],
	] // diagonal directions

	directions.forEach(([rowDir, colDir]) => {
		let currentRow = row + rowDir
		let currentCol = col + colDir

		while (isWithinBounds(currentRow, currentCol)) {
			const currentPos = indicesToNotation(currentRow, currentCol)

			if (isPositionOccupied(currentPos, occupiedPositions)) {
				if (isOpponentPosition(currentPos, occupiedPositions, color)) {
					moves.push(currentPos)
				}
				break
			}

			moves.push(currentPos)
			currentRow += rowDir
			currentCol += colDir
		}
	})

	return moves
}

// Get valid moves for a queen
function getQueenMoves(position, color, occupiedPositions) {
	return [...getRookMoves(position, color, occupiedPositions), ...getBishopMoves(position, color, occupiedPositions)]
}

// Get valid moves for a king
function getKingMoves(position, color, occupiedPositions) {
	const { row, col } = notationToIndices(position)
	const moves = []
	const directions = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	]

	directions.forEach(([rowDir, colDir]) => {
		const newRow = row + rowDir
		const newCol = col + colDir

		if (isWithinBounds(newRow, newCol)) {
			const newPos = indicesToNotation(newRow, newCol)
			if (!isPositionOccupied(newPos, occupiedPositions) || isOpponentPosition(newPos, occupiedPositions, color)) {
				moves.push(newPos)
			}
		}
	})

	return moves
}

// Main function to get valid moves for any piece
function getValidMoves(position, pieceType, color, occupiedPositions) {
	switch (pieceType.toLowerCase()) {
		case 'p':
			return getPawnMoves(position, color, occupiedPositions)
		case 'r':
			return getRookMoves(position, color, occupiedPositions)
		case 'n':
			return getKnightMoves(position, color, occupiedPositions)
		case 'b':
			return getBishopMoves(position, color, occupiedPositions)
		case 'q':
			return getQueenMoves(position, color, occupiedPositions)
		case 'k':
			return getKingMoves(position, color, occupiedPositions)
		default:
			return []
	}
}

// Function to highlight valid moves on the board
function highlightValidMoves(validMoves) {
	// Remove any existing highlights
	document.querySelectorAll('.valid-move').forEach((el) => {
		el.classList.remove('valid-move')
	})

	// Add highlights to valid moves
	validMoves.forEach((move) => {
		const field = document.getElementById(move)
		if (field) {
			field.classList.add('valid-move')
		}
	})
}

// Export the functions
window.getValidMoves = getValidMoves
window.highlightValidMoves = highlightValidMoves
