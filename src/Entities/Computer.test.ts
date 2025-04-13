import { describe, it, expect, beforeEach } from 'vitest';
import {
    createComputerEntity,
    createAndRegisterComputerEntity,
    getComputerComponent,
    getComputerSymbol,
    isComputerPlayer
} from './Computer';
import { EntityComponentSystem } from 'javascript-entity-component-system';
import { PlayerType } from '../Components/PlayerComponent';
import { CellValue } from '../Components/BoardComponent';

describe('Computer Entity', () => {
    let ecs: EntityComponentSystem;

    beforeEach(() => {
        // Create a fresh ECS instance for each test
        ecs = new EntityComponentSystem();
    });

    it('should create a computer entity with default values', () => {
        const computerEntity = createComputerEntity(ecs);

        // Verify entity exists
        expect(computerEntity).toBeDefined();

        // Verify it has the correct name
        expect(computerEntity.name).toBe('Computer');

        // Verify it has the player component
        const components = ecs.getEntityComponents(computerEntity, ['PlayerComponent']);
        expect(components.length).toBe(1);
        expect(components[0].name).toBe('PlayerComponent');

        // Verify default values
        const playerComponent = getComputerComponent(ecs, computerEntity);
        expect(playerComponent).toBeDefined();
        expect(playerComponent?.state.playerType).toBe(PlayerType.Computer);
        expect(playerComponent?.state.symbol).toBe(CellValue.O);
    });

    it('should create a computer entity with custom name', () => {
        const computerEntity = createComputerEntity(ecs, 'AI');
        expect(computerEntity.name).toBe('AI');
    });

    it('should create and register a computer entity', () => {
        const computerEntity = createAndRegisterComputerEntity(ecs);

        // Verify entity exists and is registered
        expect(computerEntity).toBeDefined();
        expect(ecs.getEntities().includes(computerEntity)).toBe(true);
    });

    it('should store optional difficulty setting', () => {
        const computerEntity = createComputerEntity(ecs, 'Computer', { difficulty: 'hard' });
        const playerComponent = getComputerComponent(ecs, computerEntity);

        expect(playerComponent?.state.difficulty).toBe('hard');
    });

    it('should get computer component', () => {
        const computerEntity = createComputerEntity(ecs);
        const playerComponent = getComputerComponent(ecs, computerEntity);

        expect(playerComponent).toBeDefined();
        expect(playerComponent?.state.playerType).toBe(PlayerType.Computer);
    });

    it('should get computer symbol', () => {
        const computerEntity = createComputerEntity(ecs);
        const symbol = getComputerSymbol(ecs, computerEntity);

        expect(symbol).toBe(CellValue.O);
    });

    it('should correctly identify computer player component', () => {
        const computerEntity = createComputerEntity(ecs);
        const playerComponent = getComputerComponent(ecs, computerEntity);

        if (playerComponent) {
            expect(isComputerPlayer(playerComponent)).toBe(true);
        } else {
            expect.fail('Player component not found');
        }
    });

    it('should return empty cell value if component not found', () => {
        // Create entity without components
        const emptyEntity = ecs.createEntity('EmptyEntity', [], []);
        const symbol = getComputerSymbol(ecs, emptyEntity);

        expect(symbol).toBe(CellValue.Empty);
    });
}); 