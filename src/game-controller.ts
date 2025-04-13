import { EntityComponentSystem } from 'javascript-entity-component-system';
import { createAndRegisterGameEntity } from './Entities/Game';
import { createAndRegisterBoardEntity } from './Entities/Board';
import { createAndRegisterPlayerEntity } from './Entities/Player';
import { createAndRegisterComputerEntity } from './Entities/Computer';

// Import all components
import { BoardComponent, CellValue } from './Components/BoardComponent';
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

// Simple diagnostic processor
const TestProcessor = {
    name: 'TestProcessor',
    // No required components - will run for all entities
    required: [],

    update(entity: any, _components: any[]): void {
        console.log('[DEBUG] TestProcessor called for entity:', entity.name);
    }
};

// Game loop variables
let animationFrameId: number | null = null;
let lastFrameTime: number = 0;

// Create shared global space for cross-environment access
const globalSpace = (typeof window !== 'undefined' ? window : globalThis) as any;
if (!globalSpace.__gameState) {
    globalSpace.__gameState = {
        gameCanvas: null,
        lastClick: null,
        ecs: null
    };
}

// For frame counting
let frameCount = 0;

/**
 * Creates and configures the Entity Component System
 * @returns Configured ECS instance
 */
export function createGameSystem(): EntityComponentSystem {
    const ecs = new EntityComponentSystem();

    // Register all components - create instances first
    const boardComponent = new BoardComponent();
    const gameStateComponent = new GameStateComponent();
    const playerComponent = new PlayerComponent();
    const renderComponent = new RenderComponent();
    const scoreComponent = new ScoreComponent();
    const turnComponent = new TurnComponent();

    // Log the component instances
    console.log('[DEBUG] Component instances:',
        boardComponent.name,
        gameStateComponent.name,
        playerComponent.name,
        renderComponent.name,
        scoreComponent.name,
        turnComponent.name
    );

    // Add components to ECS
    ecs.addComponent(boardComponent);
    ecs.addComponent(gameStateComponent);
    ecs.addComponent(playerComponent);
    ecs.addComponent(renderComponent);
    ecs.addComponent(scoreComponent);
    ecs.addComponent(turnComponent);

    // Debug component registration
    try {
        // Get raw component array
        const componentArray = (ecs as any)._components || [];
        console.log('[DEBUG] ECS internal component count:', componentArray.length);

        // Try a different approach to add components (maybe needed by the library)
        if (componentArray.length === 0) {
            console.log('[DEBUG] Trying alternative component registration');

            // Alternative registration approach
            (ecs as any)._components = {
                boardcomponent: boardComponent,
                gamestatecomponent: gameStateComponent,
                playercomponent: playerComponent,
                rendercomponent: renderComponent,
                scorecomponent: scoreComponent,
                turncomponent: turnComponent
            };

            console.log('[DEBUG] Alternative registration completed');
        }

        // Debug after registration
        console.log('[DEBUG] ECS components after registration:',
            Object.keys((ecs as any)._components || {}));
    } catch (e) {
        console.log('[DEBUG] Could not debug ECS components', e);
    }

    // Register all processors in correct execution order
    ecs.addProcessor(GameStateProcessor);
    ecs.addProcessor(InputProcessor);
    ecs.addProcessor(TurnProcessor);
    ecs.addProcessor(AIProcessor);
    ecs.addProcessor(WinCheckProcessor);
    ecs.addProcessor(RenderProcessor);
    ecs.addProcessor(TestProcessor); // Add test processor

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
    // Simplified logging - only log once every 1000 frames (much less frequent)
    if (frameCount % 1000 === 0) {
        console.log('[DEBUG] Frame:', frameCount);

        // Only show basic entity count
        const entities = ecs.getEntities();
        console.log('[DEBUG] Entity count:', entities.length);
    }
    frameCount++;

    // Check for force redraw flag
    if ((globalThis as any).__gameState?.forceRedraw) {
        console.log('[DEBUG] Processing forced redraw');
        (globalThis as any).__gameState.forceRedraw = false;
    }

    // Run the ECS update
    ecs.update();
}

/**
 * Starts the game loop using requestAnimationFrame
 * @param ecs The Entity Component System instance
 * @param canvas The canvas element for rendering (passed to processors)
 */
export function startGameLoop(ecs: EntityComponentSystem, canvas: HTMLCanvasElement): void {
    // Store references in global state for processors to access
    globalSpace.__gameState.gameCanvas = canvas;
    globalSpace.__gameState.ecs = ecs;

    console.log('[DEBUG] Starting game loop with canvas:', canvas.id, canvas.width, 'x', canvas.height);
    console.log('[DEBUG] ECS has processors:', ecs.getProcessors().map(p => p.name));

    // REMOVED: DIRECT RENDERING BYPASS
    // We'll let the ECS handle rendering now
    console.log('[DEBUG] Using ECS for rendering');

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
    console.log('[DEBUG] Animation frame requested with ID:', animationFrameId);
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

// Helper function to get the center of a cell
// function getCellCenter(row: number, col: number, cellSize: number): [number, number] {
//     const x = col * cellSize + cellSize / 2;
//     const y = row * cellSize + cellSize / 2;
//     return [x, y];
// }

/**
 * Handles canvas click events by translating them to game input
 * @param ecs The Entity Component System instance
 * @param x X coordinate of the click
 * @param y Y coordinate of the click
 */
export function handleCanvasClick(ecs: EntityComponentSystem, x: number, y: number): void {
    console.log('[DEBUG] Canvas clicked at:', x, y);

    // Calculate which cell was clicked (0-2, 0-2)
    const canvas = (globalThis as any).__gameState?.gameCanvas;
    if (canvas) {
        const cellSize = canvas.width / 3;
        const row = Math.floor(y / cellSize);
        const col = Math.floor(x / cellSize);
        console.log('[DEBUG] Clicked cell:', row, col);

        // Find the board entity
        const boardEntity = ecs.getEntities().find(e => e.name === 'Board');
        // Find the game entity
        const gameEntity = ecs.getEntities().find(e => e.name === 'Game');
        
        if (boardEntity && gameEntity) {
            // Get the turn component to see whose turn it is
            const turnComps = ecs.getEntityComponents(gameEntity, ['TurnComponent']);
            const turnComp = turnComps.find(c => c.name === 'TurnComponent') as TurnComponent;
            
            // Get the board component
            const boardComps = ecs.getEntityComponents(boardEntity, ['BoardComponent']);
            const boardComp = boardComps.find(c => c.name === 'BoardComponent') as BoardComponent;
            
            console.log('[DEBUG] Current board state:');
            if (boardComp?.grid) {
                for (let r = 0; r < 3; r++) {
                    console.log(`[DEBUG] Row ${r}:`, boardComp.grid[r].map((v: string) => v || '-').join(' | '));
                }
            }
            
            if (boardComp && turnComp) {
                console.log('[DEBUG] Current turn:', turnComp.currentTurn);
                
                // Only proceed if it's the player's turn (X)
                if (turnComp.currentTurn === CellValue.X) {
                    // Make the move
                    const success = boardComp.setCell(row, col, CellValue.X);
                    console.log('[DEBUG] Player move success:', success);
                    
                    if (success) {
                        // Update the turn to be the computer's turn
                        if (typeof turnComp.nextTurn === 'function') {
                            turnComp.nextTurn();
                            console.log('[DEBUG] Switching turn to computer (O)');
                            
                            // Instead of manually calling AI processor, just force another update cycle
                            console.log('[DEBUG] Forcing ECS update to process AI move');
                            setTimeout(() => {
                                // This will trigger one update cycle of the ECS, allowing all processors to run
                                // which should include the AI processor making its move
                                ecs.update();
                                console.log('[DEBUG] ECS update triggered for AI move');
                            }, 100); // Small delay to ensure UI updates first
                        } else {
                            console.log('[DEBUG] TurnComponent has no nextTurn method');
                        }
                    }
                } else {
                    console.log('[DEBUG] Not player turn - current turn is:', turnComp.currentTurn);
                }
            } else {
                console.log('[DEBUG] Required components not found');
            }
        } else {
            console.log('[DEBUG] Required entities not found');
        }
    }

    // Store click coordinates in the global state for the InputProcessor
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
        console.error('[DEBUG] Required entities not found for reset');
        return;
    }

    console.log('[DEBUG] Resetting game with entities:', gameEntity.name, boardEntity.name);

    // Get components
    const gameComponents = ecs.getEntityComponents(gameEntity, ['GameStateComponent', 'TurnComponent', 'ScoreComponent']);
    const boardComponents = ecs.getEntityComponents(boardEntity, ['BoardComponent']);

    console.log('[DEBUG] Game components found:', gameComponents.map(c => c.name));
    console.log('[DEBUG] Board components found:', boardComponents.map(c => c.name));

    // Since the components might not be properly attached, we'll create new ones if needed
    const gameStateComponent = gameComponents.find(c => c.name === 'GameStateComponent') as GameStateComponent;
    const turnComponent = gameComponents.find(c => c.name === 'TurnComponent') as TurnComponent;
    // const scoreComponent = gameComponents.find(c => c.name === 'ScoreComponent') as ScoreComponent;
    const boardComponent = boardComponents.find(c => c.name === 'BoardComponent') as BoardComponent;

    // Create a fresh board if needed
    if (!boardComponent || typeof boardComponent.reset !== 'function') {
        console.log('[DEBUG] Creating new board component for reset');

        // Using a simpler approach - recreate the entity
        ecs.removeEntity(boardEntity);
        const newBoardEntity = createAndRegisterBoardEntity(ecs);
        console.log('[DEBUG] Created new board entity:', newBoardEntity.name);
    } else {
        // Board component exists and has reset method
        boardComponent.reset();
    }

    // Reset other components if they exist
    if (gameStateComponent && typeof gameStateComponent.reset === 'function') {
        gameStateComponent.reset();
        if (typeof gameStateComponent.startGame === 'function') {
            gameStateComponent.startGame();
        }
    }

    if (turnComponent && typeof turnComponent.reset === 'function') {
        turnComponent.reset();
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