import { Processor, Entity, Component } from 'javascript-entity-component-system';
import { RenderComponent } from '../Components/RenderComponent';
import { BoardComponent, CellValue } from '../Components/BoardComponent';
import { GameStateComponent, GameStatus, Position } from '../Components/GameStateComponent';

// Helper function to get the center of a cell
const getCellCenter = (row: number, col: number, cellSize: number): [number, number] => {
    const x = col * cellSize + cellSize / 2;
    const y = row * cellSize + cellSize / 2;
    return [x, y];
};

// Helper function to draw an X
const drawX = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    progress: number = 1
): void => {
    // Size is the percentage of the cell size to use
    const halfSize = (size / 100) * 0.5;
    const adjustedSize = progress * halfSize;

    ctx.beginPath();
    ctx.moveTo(x - adjustedSize, y - adjustedSize);
    ctx.lineTo(x + adjustedSize, y + adjustedSize);
    ctx.moveTo(x + adjustedSize, y - adjustedSize);
    ctx.lineTo(x - adjustedSize, y + adjustedSize);
    ctx.stroke();
};

// Helper function to draw an O
const drawO = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    progress: number = 1
): void => {
    // Size is the percentage of the cell size to use
    const radius = (size / 100) * 0.5 * progress;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
};

// Helper function to draw the grid lines
const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cellSize: number
): void => {
    // Draw vertical lines
    for (let i = 1; i < 3; i++) {
        const x = i * cellSize;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let i = 1; i < 3; i++) {
        const y = i * cellSize;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
};

// Helper function to draw the win line
const drawWinLine = (
    ctx: CanvasRenderingContext2D,
    winLine: Position[],
    cellSize: number,
    progress: number = 1
): void => {
    if (winLine.length !== 3) return;

    const [start, , end] = winLine;
    const [startX, startY] = getCellCenter(start.row, start.col, cellSize);
    const [endX, endY] = getCellCenter(end.row, end.col, cellSize);

    // Calculate progress-based end coordinates
    const currentEndX = startX + (endX - startX) * progress;
    const currentEndY = startY + (endY - startY) * progress;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentEndX, currentEndY);
    ctx.stroke();
};

/**
 * RenderProcessor handles rendering the game state onto a canvas
 */
export const RenderProcessor: Processor = {
    name: 'RenderProcessor',
    required: ['RenderComponent', 'BoardComponent', 'GameStateComponent'],

    update(_entity: Entity, components: Component[]): void {
        // Extract components
        const [renderComp, boardComp, gameStateComp] = components as [
            RenderComponent,
            BoardComponent,
            GameStateComponent
        ];

        // Find the canvas element
        const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        if (!canvas) return;

        // Get rendering context
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Update canvas dimensions if needed
        if (canvas.width !== renderComp.width || canvas.height !== renderComp.height) {
            canvas.width = renderComp.width;
            canvas.height = renderComp.height;
        }

        // Clear the canvas
        ctx.clearRect(0, 0, renderComp.width, renderComp.height);

        // Set background color
        ctx.fillStyle = renderComp.colors.background;
        ctx.fillRect(0, 0, renderComp.width, renderComp.height);

        // Setup for grid drawing
        ctx.strokeStyle = renderComp.colors.grid;
        ctx.lineWidth = renderComp.lineWidth;

        // Draw the grid
        drawGrid(ctx, renderComp.width, renderComp.height, renderComp.cellSize);

        // Update mark animation if needed
        const markAnimation = renderComp.getAnimation('mark');
        const markProgress = markAnimation.inProgress
            ? renderComp.updateAnimation('mark')
            : 1;

        // Draw the board marks
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cellValue = boardComp.getCell(row, col);
                if (cellValue === CellValue.Empty) continue;

                const [x, y] = getCellCenter(row, col, renderComp.cellSize);

                if (cellValue === CellValue.X) {
                    ctx.strokeStyle = renderComp.colors.xMark;
                    drawX(ctx, x, y, renderComp.markSize, markProgress);
                } else if (cellValue === CellValue.O) {
                    ctx.strokeStyle = renderComp.colors.oMark;
                    drawO(ctx, x, y, renderComp.markSize, markProgress);
                }
            }
        }

        // If game is won, draw the win line with animation
        if (gameStateComp.status === GameStatus.Win) {
            // Update win animation
            const winAnimation = renderComp.getAnimation('win');
            const winProgress = winAnimation.inProgress
                ? renderComp.updateAnimation('win')
                : 1;

            // Draw the win line
            ctx.strokeStyle = renderComp.colors.winLine;
            ctx.lineWidth = renderComp.lineWidth * 2; // Make win line thicker
            drawWinLine(ctx, gameStateComp.winLine, renderComp.cellSize, winProgress);
        }
    }
}; 