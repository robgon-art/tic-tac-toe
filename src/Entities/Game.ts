import { Entity, EntityComponentSystem } from 'javascript-entity-component-system';
import { GameStateComponent, GameStatus, Position } from '../Components/GameStateComponent';
import { TurnComponent } from '../Components/TurnComponent';
import { ScoreComponent } from '../Components/ScoreComponent';
import { RenderComponent } from '../Components/RenderComponent';
import { CellValue } from '../Components/BoardComponent';

/**
 * Interface for options when creating a Game entity
 */
export interface GameOptions {
    /** Initial game status */
    initialStatus?: GameStatus;
    /** Canvas width in pixels */
    width?: number;
    /** Canvas height in pixels */
    height?: number;
    /** Player who goes first */
    firstPlayer?: CellValue;
    /** Custom line width for rendering */
    lineWidth?: number;
    /** Custom mark size for rendering (percentage of cell) */
    markSize?: number;
}

/**
 * Creates a Game entity
 * 
 * This is a pure factory function that creates a Game entity with
 * the required components. It doesn't register the entity with the ECS.
 * 
 * @param ecs The Entity Component System instance
 * @param entityName Custom name for the entity (optional)
 * @param options Custom options for the game (optional)
 * @returns A new Game entity
 */
export function createGameEntity(
    ecs: EntityComponentSystem,
    entityName: string = 'Game',
    options: GameOptions = {}
): Entity {
    // Create the entity first
    const entity = ecs.createEntity(entityName, [], []);

    // Create components with default values first
    const gameStateComponent = new GameStateComponent();

    const turnComponent = new TurnComponent(
        options.firstPlayer || CellValue.X
    );

    const scoreComponent = new ScoreComponent();

    const renderComponent = new RenderComponent(
        options.width || 300,
        options.height || 300
    );

    // Properly initialize game state using component methods
    if (options.initialStatus === GameStatus.InProgress) {
        gameStateComponent.startGame();
    } else if (options.initialStatus === GameStatus.Win) {
        // For testing, create a dummy win with the current player's symbol
        const winSymbol = turnComponent.currentTurn;
        const dummyWinLine = [
            { row: 0, col: 0 } as Position,
            { row: 0, col: 1 } as Position,
            { row: 0, col: 2 } as Position
        ];
        gameStateComponent.setWin(winSymbol, dummyWinLine);
    } else if (options.initialStatus === GameStatus.Draw) {
        gameStateComponent.setDraw();
    }

    // Customize render component if options provided
    if (options.lineWidth) {
        renderComponent.lineWidth = options.lineWidth;
    }

    if (options.markSize) {
        renderComponent.markSize = options.markSize;
    }

    // Add components to the ECS system
    ecs.addComponent(gameStateComponent);
    ecs.addComponent(turnComponent);
    ecs.addComponent(scoreComponent);
    ecs.addComponent(renderComponent);

    // Associate components with the entity
    ecs.addComponentToEntity(entity, 'GameStateComponent');
    ecs.addComponentToEntity(entity, 'TurnComponent');
    ecs.addComponentToEntity(entity, 'ScoreComponent');
    ecs.addComponentToEntity(entity, 'RenderComponent');

    return entity;
}

/**
 * Factory function that creates and registers a Game entity in the ECS
 * 
 * @param ecs The Entity Component System instance
 * @param entityName Custom name for the entity (optional)
 * @param options Custom options for the game (optional)
 * @returns The created Game entity
 */
export function createAndRegisterGameEntity(
    ecs: EntityComponentSystem,
    entityName: string = 'Game',
    options: GameOptions = {}
): Entity {
    const gameEntity = createGameEntity(ecs, entityName, options);
    ecs.addEntity(gameEntity);
    return gameEntity;
}

/**
 * Get the game state component from a game entity
 * 
 * @param ecs The Entity Component System instance
 * @param gameEntity The game entity
 * @returns The GameStateComponent or undefined if not found
 */
export function getGameStateComponent(
    ecs: EntityComponentSystem,
    gameEntity: Entity
): GameStateComponent | undefined {
    const components = ecs.getEntityComponents(gameEntity, ['GameStateComponent']);
    return components.find(c => c.name === 'GameStateComponent') as GameStateComponent | undefined;
}

/**
 * Get the turn component from a game entity
 * 
 * @param ecs The Entity Component System instance
 * @param gameEntity The game entity
 * @returns The TurnComponent or undefined if not found
 */
export function getTurnComponent(
    ecs: EntityComponentSystem,
    gameEntity: Entity
): TurnComponent | undefined {
    const components = ecs.getEntityComponents(gameEntity, ['TurnComponent']);
    return components.find(c => c.name === 'TurnComponent') as TurnComponent | undefined;
}

/**
 * Get the score component from a game entity
 * 
 * @param ecs The Entity Component System instance
 * @param gameEntity The game entity
 * @returns The ScoreComponent or undefined if not found
 */
export function getScoreComponent(
    ecs: EntityComponentSystem,
    gameEntity: Entity
): ScoreComponent | undefined {
    const components = ecs.getEntityComponents(gameEntity, ['ScoreComponent']);
    return components.find(c => c.name === 'ScoreComponent') as ScoreComponent | undefined;
}

/**
 * Get the render component from a game entity
 * 
 * @param ecs The Entity Component System instance
 * @param gameEntity The game entity
 * @returns The RenderComponent or undefined if not found
 */
export function getRenderComponent(
    ecs: EntityComponentSystem,
    gameEntity: Entity
): RenderComponent | undefined {
    const components = ecs.getEntityComponents(gameEntity, ['RenderComponent']);
    return components.find(c => c.name === 'RenderComponent') as RenderComponent | undefined;
}

/**
 * Check if a game is in progress
 * 
 * @param ecs The Entity Component System instance
 * @param gameEntity The game entity
 * @returns True if the game is in progress
 */
export function isGameInProgress(
    ecs: EntityComponentSystem,
    gameEntity: Entity
): boolean {
    const gameStateComponent = getGameStateComponent(ecs, gameEntity);
    return gameStateComponent?.isInProgress() || false;
}

/**
 * Check if a game is over (win or draw)
 * 
 * @param ecs The Entity Component System instance
 * @param gameEntity The game entity
 * @returns True if the game is over
 */
export function isGameOver(
    ecs: EntityComponentSystem,
    gameEntity: Entity
): boolean {
    const gameStateComponent = getGameStateComponent(ecs, gameEntity);
    return gameStateComponent?.isGameOver() || false;
} 