import { EntityComponentSystem } from 'javascript-entity-component-system';
import { createAndRegisterGameEntity } from './Entities/Game';
import { createAndRegisterBoardEntity } from './Entities/Board';
import { createAndRegisterPlayerEntity } from './Entities/Player';
import { createAndRegisterComputerEntity } from './Entities/Computer';

// Import all components
import { BoardComponent } from './Components/BoardComponent';
import { GameStateComponent } from './Components/GameStateComponent';
import { PlayerComponent } from './Components/PlayerComponent';
import { RenderComponent } from './Components/RenderComponent';
import { ScoreComponent } from './Components/ScoreComponent';
import { TurnComponent } from './Components/TurnComponent';

// Import all processors
import { AIProcessor } from './Processors/AIProcessor';
import { GameStateProcessor } from './Processors/GameStateProcessor';
import { InputProcessor } from './Processors/InputProcessor';
import { RenderProcessor } from './Processors/RenderProcessor';
import { TurnProcessor } from './Processors/TurnProcessor';
import { WinCheckProcessor } from './Processors/WinCheckProcessor';

// Game loop variables
let animationFrameId: number | null = null;
let lastFrameTime: number = 0;

// Create shared global space for cross-environment access
const globalSpace = (typeof window !== 'undefined' ? window : globalThis) as any;
if (!globalSpace.__gameState) {
    globalSpace.__gameState = {
        gameCanvas: null,
        lastClick: null
    };
}

/**
 * Creates and configures the Entity Component System
 * @returns Configured ECS instance
 */
export function createGameSystem(): EntityComponentSystem {
    const ecs = new EntityComponentSystem();

    // Register all components
    ecs.addComponent(new BoardComponent());
    ecs.addComponent(new GameStateComponent());
    ecs.addComponent(new PlayerComponent());
    ecs.addComponent(new RenderComponent());
    ecs.addComponent(new ScoreComponent());
    ecs.addComponent(new TurnComponent());

    // Register all processors in correct execution order
    ecs.addProcessor(GameStateProcessor);
    ecs.addProcessor(InputProcessor);
    ecs.addProcessor(TurnProcessor);
    ecs.addProcessor(AIProcessor);
    ecs.addProcessor(WinCheckProcessor);
    ecs.addProcessor(RenderProcessor);

    return ecs;
}

/**
 * Initializes the game by creating all entities
 * @param ecs The Entity Component System instance
 * @returns Object containing references to created entities
 */
export function initializeGame(ecs: EntityComponentSystem) {
    // Create all entities
    const gameEntity = createAndRegisterGameEntity(ecs);
    const boardEntity = createAndRegisterBoardEntity(ecs);
    const playerEntity = createAndRegisterPlayerEntity(ecs);
    const computerEntity = createAndRegisterComputerEntity(ecs);

    return {
        gameEntity,
        boardEntity,
        playerEntity,
        computerEntity
    };
}

/**
 * Updates the game state for a single frame
 * This is a pure function that processes one frame of game logic
 * @param ecs The Entity Component System
 * @param deltaTime Time elapsed since last frame in milliseconds
 */
export function updateGame(ecs: EntityComponentSystem, _deltaTime: number): void {
    ecs.update();
}

/**
 * Starts the game loop using requestAnimationFrame
 * @param ecs The Entity Component System instance
 * @param canvas The canvas element for rendering (passed to processors)
 */
export function startGameLoop(ecs: EntityComponentSystem, canvas: HTMLCanvasElement): void {
    // Store reference to the canvas in a place where processors can access it
    globalSpace.__gameState.gameCanvas = canvas;

    // Start the game loop
    lastFrameTime = performance.now();

    const gameLoop = (currentTime: number) => {
        // Calculate delta time
        const deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;

        // Update game logic
        updateGame(ecs, deltaTime);

        // Continue the loop
        animationFrameId = requestAnimationFrame(gameLoop);
    };

    // Start the loop
    animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * Stops the game loop
 */
export function stopGameLoop(): void {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

/**
 * Handles canvas click events by translating them to game input
 * @param ecs The Entity Component System instance
 * @param x X coordinate of the click
 * @param y Y coordinate of the click
 */
export function handleCanvasClick(_ecs: EntityComponentSystem, x: number, y: number): void {
    // Store click coordinates in a place where the InputProcessor can access them
    globalSpace.__gameState.lastClick = { x, y };
}

/**
 * Resets the game to initial state
 * @param ecs The Entity Component System instance
 */
export function resetGame(ecs: EntityComponentSystem): void {
    // Get all entities
    const gameEntity = ecs.getEntities().find(e => e.name === 'Game');
    const boardEntity = ecs.getEntities().find(e => e.name === 'Board');

    if (!gameEntity || !boardEntity) {
        throw new Error('Required entities not found');
    }

    // Get components
    const gameComponents = ecs.getEntityComponents(gameEntity, ['GameStateComponent', 'TurnComponent', 'ScoreComponent']);
    const boardComponents = ecs.getEntityComponents(boardEntity, ['BoardComponent']);

    const gameStateComponent = gameComponents.find(c => c.name === 'GameStateComponent') as GameStateComponent;
    const turnComponent = gameComponents.find(c => c.name === 'TurnComponent') as TurnComponent;
    const scoreComponent = gameComponents.find(c => c.name === 'ScoreComponent') as ScoreComponent;
    const boardComponent = boardComponents.find(c => c.name === 'BoardComponent') as BoardComponent;

    // Reset components
    if (gameStateComponent && turnComponent && scoreComponent && boardComponent) {
        gameStateComponent.reset();
        gameStateComponent.startGame();
        turnComponent.reset();
        boardComponent.reset();
    }
}

/**
 * Creates a complete game system and initializes it
 * @returns Object with ECS instance and game entities
 */
export function createAndInitializeGame() {
    const ecs = createGameSystem();
    const entities = initializeGame(ecs);

    return {
        ecs,
        ...entities
    };
} 