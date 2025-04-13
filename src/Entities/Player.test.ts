import { EntityComponentSystem } from 'javascript-entity-component-system';
import { describe, it, expect, beforeEach } from 'vitest';
import {
    createPlayerEntity,
    getPlayerComponent,
    createHumanPlayer,
    createComputerPlayer,
    isHumanPlayer,
    isComputerPlayer
} from './Player';
import { PlayerType } from '../Components/PlayerComponent';
import { CellValue } from '../Components/BoardComponent';

describe('Player Entity', () => {
    let ecs: EntityComponentSystem;

    beforeEach(() => {
        // Create a fresh ECS instance for each test
        ecs = new EntityComponentSystem();
    });

    it('should create a player entity with required components', () => {
        const playerEntity = createPlayerEntity(ecs);

        // Check the entity exists and has expected properties
        expect(playerEntity).toBeDefined();
        expect(playerEntity.name).toBe('Player');

        // Check if correct components are registered
        const components = ecs.getEntityComponents(playerEntity, ['PlayerComponent']);
        expect(components.some(c => c.name === 'PlayerComponent')).toBe(true);
    });

    it('should allow retrieving the player component', () => {
        const playerEntity = createPlayerEntity(ecs);
        const playerComponent = getPlayerComponent(ecs, playerEntity);

        // Check the player component exists and has the correct properties
        expect(playerComponent).toBeDefined();
        expect(playerComponent?.name).toBe('PlayerComponent');
        expect(playerComponent?.state).toBeDefined();
    });

    it('should create a human player with default values', () => {
        const humanPlayer = createHumanPlayer(ecs);
        const playerComponent = getPlayerComponent(ecs, humanPlayer);

        // Check the player is configured as human with X symbol
        expect(humanPlayer.name).toBe('HumanPlayer');
        expect(playerComponent?.state.playerType).toBe(PlayerType.Human);
        expect(playerComponent?.state.symbol).toBe(CellValue.X);
        expect(isHumanPlayer(ecs, humanPlayer)).toBe(true);
        expect(isComputerPlayer(ecs, humanPlayer)).toBe(false);
    });

    it('should create a computer player with default values', () => {
        const computerPlayer = createComputerPlayer(ecs);
        const playerComponent = getPlayerComponent(ecs, computerPlayer);

        // Check the player is configured as computer with O symbol
        expect(computerPlayer.name).toBe('ComputerPlayer');
        expect(playerComponent?.state.playerType).toBe(PlayerType.Computer);
        expect(playerComponent?.state.symbol).toBe(CellValue.O);
        expect(isHumanPlayer(ecs, computerPlayer)).toBe(false);
        expect(isComputerPlayer(ecs, computerPlayer)).toBe(true);
    });

    it('should apply custom options when creating a player entity', () => {
        const customOptions = {
            playerType: PlayerType.Computer,
            symbol: CellValue.O
        };

        const playerEntity = createPlayerEntity(ecs, 'CustomPlayer', customOptions);
        const playerComponent = getPlayerComponent(ecs, playerEntity);

        // Check custom options were applied
        expect(playerEntity.name).toBe('CustomPlayer');
        expect(playerComponent?.state.playerType).toBe(PlayerType.Computer);
        expect(playerComponent?.state.symbol).toBe(CellValue.O);
    });
}); 