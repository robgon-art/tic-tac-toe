import { EntityComponentSystem } from 'javascript-entity-component-system';
import { describe, it, expect, beforeEach } from 'vitest';
import { createBoardEntity, getBoardComponent, getRenderComponent } from './Board';

describe('Board Entity', () => {
    let ecs: EntityComponentSystem;

    beforeEach(() => {
        // Create a fresh ECS instance for each test
        ecs = new EntityComponentSystem();
    });

    it('should create a board entity with required components', () => {
        const boardEntity = createBoardEntity(ecs);

        // Check the entity exists and has expected properties
        expect(boardEntity).toBeDefined();
        expect(boardEntity.name).toBe('Board');
        
        // In the ECS system, components are stored by name
        // Check if correct components are registered
        const components = ecs.getEntityComponents(boardEntity, ['BoardComponent', 'RenderComponent']);
        expect(components.some(c => c.name === 'BoardComponent')).toBe(true);
        expect(components.some(c => c.name === 'RenderComponent')).toBe(true);
    });

    it('should allow retrieving the board component', () => {
        const boardEntity = createBoardEntity(ecs);
        const boardComponent = getBoardComponent(ecs, boardEntity);

        // Check the board component exists and has the correct properties
        expect(boardComponent).toBeDefined();
        expect(boardComponent?.name).toBe('BoardComponent');
        // Additional check to ensure we have a valid board component
        expect(boardComponent?.state).toBeDefined();
    });

    it('should allow retrieving the render component', () => {
        const boardEntity = createBoardEntity(ecs);
        const renderComponent = getRenderComponent(ecs, boardEntity);

        // Check the render component exists and has the correct properties
        expect(renderComponent).toBeDefined();
        expect(renderComponent?.name).toBe('RenderComponent');
        // Additional check to ensure we have a valid render component
        expect(renderComponent?.state).toBeDefined();
    });

    it('should apply custom options when creating a board entity', () => {
        const customOptions = {
            width: 500,
            height: 400,
            lineWidth: 5,
            markSize: 80
        };

        const boardEntity = createBoardEntity(ecs, 'CustomBoard', customOptions);
        const renderComponent = getRenderComponent(ecs, boardEntity);

        // Check custom options were applied
        expect(boardEntity.name).toBe('CustomBoard');
        expect(renderComponent?.state.width).toBe(500);
        expect(renderComponent?.state.height).toBe(400);
        expect(renderComponent?.state.lineWidth).toBe(5);
        expect(renderComponent?.state.markSize).toBe(80);
    });
}); 