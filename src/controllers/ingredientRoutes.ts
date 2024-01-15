import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function ingredientRoutes(app: FastifyInstance) {
  app.post('/ingredients/create', async (request, reply) => {
    const ingredientSchema = z.object({
      tipo: z.string().toLowerCase(),
      categoria: z.string().toLowerCase(),
    });

    try {
      const { tipo, categoria } = ingredientSchema.parse(request.body);

      const ingredient = await prisma.ingredient.create({
        data: {
          tipo,
          categoria,
        },
      });

      return ingredient;
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400);
        return error.issues;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code && error.code === 'P2002') {
          reply.status(400);
          return { error: 'Ingredient already registered.' };
        }
      }
    }
  });

  app.delete('/ingredients/remove/:id', async (request, reply) => {
    const bodySchema = z.object({
      id: z.string().uuid(),
    });

    try {
      const { id } = bodySchema.parse(request.params);

      const removedIngredient = await prisma.ingredient.delete({
        where: {
          id,
        },
      });

      return removedIngredient;
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400);
        return error.issues;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code && error.code === 'P2025') {
          reply.status(404);
          return { error: 'Ingredient not found.' };
        }
      }
    }
  });

  app.get('/ingredients', async (request, reply) => {
    const requestParams = z.object({
      categoria: z.string().toLowerCase().optional(),
    });

    const { categoria } = requestParams.parse(request.query);

    const ingredients = await prisma.ingredient.findMany();

    if (!categoria) {
      return ingredients;
    }

    return ingredients.filter(ingredient => ingredient.categoria === categoria);
  });
}
