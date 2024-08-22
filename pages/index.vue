<template>
    <div>
        <div class="flex justify-center items-center h-screen">
            <div
                class="game-board w-[25rem] h-[50rem] bg-gray-700 grid grid-cols-10 grid-rows-22 gap-px"
            >
                <div
                    v-for="i in 200"
                    :key="i"
                    :class="getCellClass(i % 10, Math.floor(i / 10))"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup>
const gameStore = useGameStore();
const { currentPiece, currentPiecePosition } = storeToRefs(gameStore);

onMounted(() => {
    gameStore.initializeGame();
    console.log("Current piece:", gameStore.currentPiece);
    console.log("Next piece:", gameStore.nextPiece);

    window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
});

const handleKeyDown = (event) => {
    switch (event.key) {
        case "ArrowLeft":
        case "a":
        case "A":
            gameStore.moveLeft();
            break;
        case "ArrowRight":
        case "d":
        case "D":
            gameStore.moveRight();
            break;
        case "ArrowDown":
        case "s":
        case "S":
            gameStore.moveDown();
            break;
        case "ArrowUp":
        case "w":
        case "W":
            gameStore.rotate();
            break;
    }
};

const getCellClass = (x, y) => {
    if (!currentPiece.value || !currentPiecePosition.value) {
        return "bg-gray-500";
    }

    const pieceX = x - currentPiecePosition.value.x;
    const pieceY = y - currentPiecePosition.value.y;

    if (
        pieceX >= 0 &&
        pieceX < currentPiece.value.tetromino.shape[0].length &&
        pieceY >= 0 &&
        pieceY < currentPiece.value.tetromino.shape.length &&
        currentPiece.value.tetromino.shape[pieceX][pieceY]
    ) {
        return currentPiece.value.tetromino.color;
    }

    return "bg-gray-500";
};
</script>

<style scoped>
.game-board {
    aspect-ratio: 10 / 22;
}
</style>
