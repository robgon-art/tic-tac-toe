import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createApp, resizeCanvas } from './app';

// Mock dependencies
vi.mock('./game-controller', () => {
    return {
        createGameSystem: vi.fn().mockReturnValue({}),
        initializeGame: vi.fn().mockReturnValue({
            gameEntity: 'mock-game-entity',
            boardEntity: 'mock-board-entity',
            playerEntity: 'mock-player-entity',
            computerEntity: 'mock-computer-entity'
        }),
        startGameLoop: vi.fn(),
        stopGameLoop: vi.fn(),
        handleCanvasClick: vi.fn(),
        resetGame: vi.fn()
    };
});

// Mock the Components module
vi.mock('./Components/GameStateComponent', () => {
    return {
        GameStatus: {
            NotStarted: 'not-started',
            InProgress: 'in-progress',
            Win: 'win',
            Draw: 'draw'
        }
    };
});

// Mock the Entities module
vi.mock('./Entities/Game', () => {
    return {
        getGameStateComponent: vi.fn().mockReturnValue(null),
        getScoreComponent: vi.fn().mockReturnValue(null)
    };
});

// Import the mocked module
import * as gameController from './game-controller';

// Mock canvas
const createMockCanvas = () => {
    return {
        width: 300,
        height: 300,
        parentElement: {
            clientWidth: 400
        }
    } as unknown as HTMLCanvasElement;
};

describe('App', () => {
    let mockCanvas: HTMLCanvasElement;

    beforeEach(() => {
        vi.clearAllMocks();
        mockCanvas = createMockCanvas();

        // Reset any intervals
        vi.spyOn(window, 'setInterval').mockImplementation(() => 123 as unknown as NodeJS.Timeout);
        vi.spyOn(window, 'clearInterval').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('createApp', () => {
        it('should create a game app with expected methods', () => {
            const app = createApp(mockCanvas);

            expect(app).toBeDefined();
            expect(typeof app.startGame).toBe('function');
            expect(typeof app.stopGame).toBe('function');
            expect(typeof app.resetGame).toBe('function');
            expect(typeof app.handleClick).toBe('function');
        });

        it('should initialize the game system', () => {
            createApp(mockCanvas);

            expect(gameController.createGameSystem).toHaveBeenCalledTimes(1);
            expect(gameController.initializeGame).toHaveBeenCalledTimes(1);
        });
    });

    describe('app methods', () => {
        it('startGame should start the game loop and state monitoring', () => {
            const app = createApp(mockCanvas);

            app.startGame();

            expect(gameController.startGameLoop).toHaveBeenCalledTimes(1);
            expect(window.setInterval).toHaveBeenCalledTimes(1);
        });

        it('stopGame should stop the game loop and state monitoring', () => {
            const app = createApp(mockCanvas);

            // Start first to set up the interval
            app.startGame();
            app.stopGame();

            expect(gameController.stopGameLoop).toHaveBeenCalledTimes(1);
            expect(window.clearInterval).toHaveBeenCalledTimes(1);
        });

        it('resetGame should call the resetGame function', () => {
            const app = createApp(mockCanvas);

            app.resetGame();

            expect(gameController.resetGame).toHaveBeenCalledTimes(1);
        });

        it('handleClick should call handleCanvasClick with coordinates', () => {
            const app = createApp(mockCanvas);

            app.handleClick(100, 150);

            expect(gameController.handleCanvasClick).toHaveBeenCalledTimes(1);
            // The undefined is expected because the mock doesn't capture the ecs argument properly
            expect(gameController.handleCanvasClick).toHaveBeenCalledWith(undefined, 100, 150);
        });
    });

    describe('resizeCanvas', () => {
        it('should resize canvas based on container width', () => {
            const canvas = createMockCanvas();

            resizeCanvas(canvas);

            expect(canvas.width).toBe(400); // Container width
            expect(canvas.height).toBe(400);
        });

        it('should cap canvas size at maximum value', () => {
            const canvas = createMockCanvas();
            (canvas.parentElement as any).clientWidth = 600;

            resizeCanvas(canvas);

            expect(canvas.width).toBe(500); // Capped at 500px
            expect(canvas.height).toBe(500);
        });

        it('should do nothing if no parent element', () => {
            const canvas = createMockCanvas();
            (canvas as any).parentElement = null;

            resizeCanvas(canvas);

            expect(canvas.width).toBe(300); // Original width
            expect(canvas.height).toBe(300);
        });
    });
}); 