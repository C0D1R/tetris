export const useGameStore = defineStore("game", () => {
    const tetrominos = {
        I: {
            shape: [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            color: 'bg-cyan-500'
        },
        O: {
            shape: [
                [1, 1],
                [1, 1]
            ],
            color: 'bg-yellow-500'
        },
        L: {
            shape: [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: 'bg-orange-500'
        },
        J: {
            shape: [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: 'bg-blue-500'
        },
        S: {
            shape: [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ],
            color: 'bg-green-500'
        },
        Z: {
            shape: [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            color: 'bg-red-500'
        },
        T: {
            shape: [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: 'bg-purple-500'
        },
    }

    const gameBoard = ref(Array(22).fill().map(() => Array(10).fill(null)))

    const currentPiece = ref(null)
    const currentPiecePosition = ref({ x: 0, y: 0 })
    const nextPiece = ref(null)
    

    const generateRandomPiece = () => {
        const pieces = 'IOLJSZT'
        const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
        return {
            type: randomPiece,
            tetromino: tetrominos[randomPiece]
        }
    }

    const placeNewPiece = () => {
        currentPiece.value = nextPiece.value
        nextPiece.value = generateRandomPiece()

        const { shape } = currentPiece.value.tetromino
        const startX = Math.floor((10 - shape[0].length) / 2)
        currentPiecePosition.value = { x: startX, y: 0 }
    }

    const initializeGame = () => {
        console.log("initializeGame")
        // currentPiece.value = generateRandomPiece()
        nextPiece.value = generateRandomPiece()
        placeNewPiece()
    }

    const canMoveTo = (newX, newY) => {
        for (let y = 0; y < currentPiece.value.tetromino.shape.length; y++) {
            for (let x = 0; x < currentPiece.value.tetromino.shape[y].length; x++) {
                if (currentPiece.value.tetromino.shape[y][x]) {
                    const boardX = newX + x
                    const boardY = newY + y
                    if (
                        boardX < 0 ||
                        boardX >= 10 ||
                        boardY >= 22 ||
                        (boardY >= 0 && gameBoard.value[boardY][boardX])
                    ) {
                        return false
                    }
                }
            }
        }
        return true
    }

    const moveLeft = () => {
        if (canMoveTo(currentPiecePosition.value.x - 1, currentPiecePosition.value.y)) {
            currentPiecePosition.value.x -= 1
        }
    }

    const moveRight = () => {
        if (canMoveTo(currentPiecePosition.value.x + 1, currentPiecePosition.value.y)) {
            currentPiecePosition.value.x += 1
        }
    }

    const moveDown = () => {
        if (canMoveTo(currentPiecePosition.value.x, currentPiecePosition.value.y + 1)) {
            currentPiecePosition.value.y += 1
        } else {
            lockPiece()
        }
    }

    const rotate = () => {
        const rotatedShape = rotateMatrix(currentPiece.value.tetromino.shape)
        if (canRotate(rotatedShape)) {
            currentPiece.value.tetromino.shape = rotatedShape
        }
    }

    const canRotate = (rotatedShape) => {
        const { x, y } = currentPiecePosition.value
        for (let row = 0; row < rotatedShape.length; row++) {
            for (let col = 0; col < rotatedShape[row].length; col++) {
                if (rotatedShape[row][col]) {
                    if (!canMoveTo(x + col, y + row)) {
                        return false
                    }
                }
            }
        }
        return true
    }

    const rotateMatrix = (matrix) => {
        const N = matrix.length
        const rotated = Array.from({ length: N }, () => Array(N).fill(0))
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                rotated[j][N - 1 - i] = matrix[i][j]
            }
        }
        return rotated
    }


    const lockPiece = () => {
        for (let y = 0; y < currentPiece.value.tetromino.shape.length; y++) {
            for (let x = 0; x < currentPiece.value.tetromino.shape[y].length; x++) {
                if (currentPiece.value.tetromino.shape[y][x]) {
                    const boardY = currentPiecePosition.value.y + y
                    const boardX = currentPiecePosition.value.x + x
                    if (boardY >= 0 && boardY < 22 && boardX >= 0 && boardX < 10) {
                        gameBoard.value[boardY][boardX] = currentPiece.value.tetromino.color
                    }
                }
            }
        }
        
        clearLines()
        placeNewPiece()
    }

    const clearLines = () => {
        let linesCleared = 0
        for (let y = 21; y >= 0; y--) {
            if (gameBoard.value[y].every(cell => cell !== null)) {
                gameBoard.value.splice(y, 1)
                gameBoard.value.unshift(Array(10).fill(null))
                linesCleared++
                y++
            }
        }

        // TODO: 計分邏輯
    }


    return {
        currentPiece,
        currentPiecePosition,
        nextPiece,
        initializeGame,
        moveLeft,
        moveRight,
        moveDown,
        rotate
    }
})