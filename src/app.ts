import {
    createGameSystem,
    initializeGame,
    startGameLoop,
    stopGameLoop,
    handleCanvasClick,
    resetGame
} from './game-controller';
import { GameStatus } from './Components/GameStateComponent';
import { getGameStateComponent, getScoreComponent } from './Entities/Game';

/**
 * Interface for the app instance that manages game state and UI interactions
 */
export interface GameApp {
    startGame: () => void;
    stopGame: () => void;
    resetGame: () => void;
    handleClick: (x: number, y: number) => void;
    onScoreChange?: (playerScore: number, ties: number, computerScore: number) => void;
    onGameStateChange?: (state: string) => void;
}

/**
 * Creates a new game application instance
 * @param canvas The canvas element for rendering
 * @returns A game app instance
 */
export function createApp(canvas: HTMLCanvasElement): GameApp {
    // Create the game system
    const ecs = createGameSystem();
    const gameEntities = initializeGame(ecs);

    // Track last known state to avoid redundant updates
    let lastKnownState = '';
    let lastKnownScores = { player: 0, ties: 0, computer: 0 };

    // Set up polling for game state changes
    let stateCheckInterval: number | null = null;

    /**
     * Starts the game
     */
    function startGame(): void {
        startGameLoop(ecs, canvas);
        startStateMonitoring();
    }

    /**
     * Stops the game
     */
    function stopGame(): void {
        stopGameLoop();
        stopStateMonitoring();
    }

    /**
     * Resets the current game
     */
    function doResetGame(): void {
        resetGame(ecs);
    }

    /**
     * Handles a click on the game canvas
     * @param x X coordinate of the click
     * @param y Y coordinate of the click 
     */
    function handleClick(x: number, y: number): void {
        handleCanvasClick(ecs, x, y);
    }

    /**
     * Starts monitoring game state for changes
     */
    function startStateMonitoring(): void {
        if (stateCheckInterval !== null) {
            stopStateMonitoring();
        }

        // Check for state changes every 100ms
        stateCheckInterval = window.setInterval(() => {
            checkGameState();
            checkScoreState();
        }, 100);

        // Initial state check
        checkGameState();
        checkScoreState();
    }

    /**
     * Stops monitoring game state
     */
    function stopStateMonitoring(): void {
        if (stateCheckInterval !== null) {
            window.clearInterval(stateCheckInterval);
            stateCheckInterval = null;
        }
    }

    /**
     * Checks for game state changes and notifies listeners
     */
    function checkGameState(): void {
        if (!gameEntities || !gameEntities.gameEntity) return;

        const gameStateComponent = getGameStateComponent(ecs, gameEntities.gameEntity);
        if (!gameStateComponent) return;

        let stateText = '';

        switch (gameStateComponent.status) {
            case GameStatus.NotStarted:
                stateText = 'Game Not Started';
                break;
            case GameStatus.InProgress:
                stateText = 'Game In Progress';
                break;
            case GameStatus.Win:
                stateText = `Winner: ${gameStateComponent.winner}`;
                break;
            case GameStatus.Draw:
                stateText = 'Game Draw';
                break;
        }

        // Only notify if state has changed
        if (stateText !== lastKnownState) {
            lastKnownState = stateText;
            app.onGameStateChange?.(stateText);
        }
    }

    /**
     * Checks for score changes and notifies listeners
     */
    function checkScoreState(): void {
        if (!gameEntities || !gameEntities.gameEntity) return;

        const scoreComponent = getScoreComponent(ecs, gameEntities.gameEntity);
        if (!scoreComponent) return;

        const currentScores = {
            player: scoreComponent.playerScore,
            ties: scoreComponent.ties,
            computer: scoreComponent.computerScore
        };

        // Only notify if scores have changed
        if (
            currentScores.player !== lastKnownScores.player ||
            currentScores.ties !== lastKnownScores.ties ||
            currentScores.computer !== lastKnownScores.computer
        ) {
            lastKnownScores = { ...currentScores };
            app.onScoreChange?.(
                currentScores.player,
                currentScores.ties,
                currentScores.computer
            );
        }
    }

    // Create the app instance
    const app: GameApp = {
        startGame,
        stopGame,
        resetGame: doResetGame,
        handleClick,
        onScoreChange: undefined,
        onGameStateChange: undefined
    };

    return app;
}

/**
 * Resizes the canvas to maintain aspect ratio
 * @param canvas The canvas element to resize
 */
export function resizeCanvas(canvas: HTMLCanvasElement): void {
    const container = canvas.parentElement;
    if (!container) return;

    // Get available space
    const containerWidth = container.clientWidth;
    const maxSize = Math.min(containerWidth, 500); // Cap at 500px

    // Resize canvas
    canvas.width = maxSize;
    canvas.height = maxSize;

    // Update cell size in render component
    // This would ideally be handled by the RenderProcessor
} 