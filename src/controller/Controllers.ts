import { Request, Response } from 'express';
import GenericRepository from '../repository/GenericRepository';

class Controllers<T extends GenericRepository<any>> {
    protected repository: T;

    constructor(repository: T) {
        this.repository = repository;
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const entities = await this.repository.getAll();
            res.status(200).json(entities);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        try {
            const entity = await this.repository.getById(Number(id));

            if (entity === null || entity === undefined) {
                res.status(404).json({ message: 'not found' });
            }

            res.status(200).json(entity);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const dados = req.body;
            await this.repository.create(dados);
            res.status(200).json(dados);
        } catch (error) {
            res.status(500).json(error);
        }
    };

    update = async (req: Request, res: Response) => {
        const { id } = req.params;
        const entity = req.body;

        try {
            const updatedEntity = await this.repository.update(id, entity);

            res.status(200).json(updatedEntity);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.repository.delete(id);
        try {
            if (result.message === 'Entity not found') {
                return res.status(404).json(result);
            }
            await this.repository.delete(id);
            res.status(200).json({ message: 'Deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}

export default Controllers;
