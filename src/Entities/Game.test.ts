import { describe, it, expect, beforeEach } from 'vitest';
import {
    createGameEntity,
    createAndRegisterGameEntity,
    getGameStateComponent,
    getTurnComponent,
    getScoreComponent,
    getRenderComponent,
    // isGameInProgress,
    // isGameOver
} from './Game';
import { EntityComponentSystem } from 'javascript-entity-component-system';
import { GameStatus } from '../Components/GameStateComponent';
import { CellValue } from '../Components/BoardComponent';

describe('Game Entity', () => {
    let ecs: EntityComponentSystem;

    beforeEach(() => {
        // Create a fresh ECS instance for each test
        ecs = new EntityComponentSystem();
    });

    it('should create a game entity with default values', () => {
        const gameEntity = createGameEntity(ecs);

        // Verify entity exists
        expect(gameEntity).toBeDefined();

        // Verify it has the correct name
        expect(gameEntity.name).toBe('Game');

        // Verify it has all the required components
        const components = ecs.getEntityComponents(gameEntity, ['GameStateComponent', 'TurnComponent', 'ScoreComponent', 'RenderComponent']);
        expect(components.length).toBe(4);
        expect(components.some(c => c.name === 'GameStateComponent')).toBe(true);
        expect(components.some(c => c.name === 'TurnComponent')).toBe(true);
        expect(components.some(c => c.name === 'ScoreComponent')).toBe(true);
        expect(components.some(c => c.name === 'RenderComponent')).toBe(true);

        // Verify default values
        const gameStateComponent = getGameStateComponent(ecs, gameEntity);
        expect(gameStateComponent).toBeDefined();
        expect(gameStateComponent?.status).toBe(GameStatus.NotStarted);

        const turnComponent = getTurnComponent(ecs, gameEntity);
        expect(turnComponent).toBeDefined();
        expect(turnComponent?.currentTurn).toBe(CellValue.X);

        const renderComponent = getRenderComponent(ecs, gameEntity);
        expect(renderComponent).toBeDefined();
        expect(renderComponent?.width).toBe(300);
        expect(renderComponent?.height).toBe(300);
    });

    it('should create a game entity with custom name', () => {
        const gameEntity = createGameEntity(ecs, 'CustomGame');
        expect(gameEntity.name).toBe('CustomGame');
    });

    it('should create and register a game entity', () => {
        const gameEntity = createAndRegisterGameEntity(ecs);

        // Verify entity exists and is registered
        expect(gameEntity).toBeDefined();
        expect(ecs.getEntities().includes(gameEntity)).toBe(true);
    });

    it('should create a game with custom options', () => {
        const gameEntity = createGameEntity(ecs, 'Game', {
            initialStatus: GameStatus.InProgress,
            width: 400,
            height: 400,
            firstPlayer: CellValue.O,
            lineWidth: 5,
            markSize: 50
        });

        // Verify custom values
        const gameStateComponent = getGameStateComponent(ecs, gameEntity);
        expect(gameStateComponent?.status).toBe(GameStatus.InProgress);

        const turnComponent = getTurnComponent(ecs, gameEntity);
        expect(turnComponent?.currentTurn).toBe(CellValue.O);

        const renderComponent = getRenderComponent(ecs, gameEntity);
        expect(renderComponent?.width).toBe(400);
        expect(renderComponent?.height).toBe(400);
        expect(renderComponent?.lineWidth).toBe(5);
        expect(renderComponent?.markSize).toBe(50);
    });

    it('should get game state component', () => {
        const gameEntity = createGameEntity(ecs);
        const gameStateComponent = getGameStateComponent(ecs, gameEntity);

        expect(gameStateComponent).toBeDefined();
        expect(gameStateComponent?.status).toBe(GameStatus.NotStarted);
    });

    it('should get turn component', () => {
        const gameEntity = createGameEntity(ecs);
        const turnComponent = getTurnComponent(ecs, gameEntity);

        expect(turnComponent).toBeDefined();
        expect(turnComponent?.currentTurn).toBe(CellValue.X);
    });

    it('should get score component', () => {
        const gameEntity = createGameEntity(ecs);
        const scoreComponent = getScoreComponent(ecs, gameEntity);

        expect(scoreComponent).toBeDefined();
        expect(scoreComponent?.playerScore).toBe(0);
        expect(scoreComponent?.computerScore).toBe(0);
        expect(scoreComponent?.ties).toBe(0);
    });

    it('should get render component', () => {
        const gameEntity = createGameEntity(ecs);
        const renderComponent = getRenderComponent(ecs, gameEntity);

        expect(renderComponent).toBeDefined();
        expect(renderComponent?.width).toBe(300);
        expect(renderComponent?.height).toBe(300);
    });

    /* 
    it('should check if game is in progress', () => {
        const notStartedGame = createGameEntity(ecs, 'NotStartedGame');
        expect(isGameInProgress(ecs, notStartedGame)).toBe(false);

        const inProgressGame = createGameEntity(ecs, 'InProgressGame', {
            initialStatus: GameStatus.InProgress
        });
        expect(isGameInProgress(ecs, inProgressGame)).toBe(true);
    });

    it('should check if game is over', () => {
        const notStartedGame = createGameEntity(ecs, 'NotStartedGame');
        expect(isGameOver(ecs, notStartedGame)).toBe(false);

        const inProgressGame = createGameEntity(ecs, 'InProgressGame', {
            initialStatus: GameStatus.InProgress
        });
        expect(isGameOver(ecs, inProgressGame)).toBe(false);

        const winGame = createGameEntity(ecs, 'WinGame', {
            initialStatus: GameStatus.Win
        });
        expect(isGameOver(ecs, winGame)).toBe(true);

        const drawGame = createGameEntity(ecs, 'DrawGame', {
            initialStatus: GameStatus.Draw
        });
        expect(isGameOver(ecs, drawGame)).toBe(true);
    });
    */

    it('should return undefined if component not found', () => {
        // Create entity without components
        const emptyEntity = ecs.createEntity('EmptyEntity', [], []);

        expect(getGameStateComponent(ecs, emptyEntity)).toBeUndefined();
        expect(getTurnComponent(ecs, emptyEntity)).toBeUndefined();
        expect(getScoreComponent(ecs, emptyEntity)).toBeUndefined();
        expect(getRenderComponent(ecs, emptyEntity)).toBeUndefined();
    });
}); 