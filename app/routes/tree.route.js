import express from 'express';
import { StatusCodes } from "http-status-codes";
import TreeController from '../controllers/tree-controller.js';
import { authenticateToken } from '../middlewares/auth-middleware.js';
import { isAdmin } from '../middlewares/isAdmin-middleware.js';


const router = express.Router();

// CRUD basique
router.get('/', TreeController.getAll);
router.get('/create', authenticateToken, isAdmin, TreeController.create);
router.post('/create', authenticateToken, isAdmin, TreeController.create);
router.get('/:id', TreeController.getById);
router.get('/:id/edit', authenticateToken, isAdmin, TreeController.update);
router.post('/:id/edit', authenticateToken, isAdmin, TreeController.update);
router.post('/:id/delete', authenticateToken, isAdmin, TreeController.delete);

// Route backend pour interroger l’API Perenual
router.get("/api/plants", async (req, res) => {
  try {

    // Récupère le paramètre "name" dans l’URL (ex: /api/plants?name=chene)
    const { name } = req.query;

    // Récupère la clé API stockée dans le fichier .env
    const token = process.env.PERENUAL_TOKEN;

    // Si aucun nom n’a été fourni dans la requête
    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Paramètre 'name' requis." });
    }

    // Appel à l’API publique de Perenual avec le nom et la clé d’API
    const response = await fetch(`https://perenual.com/api/species-list?key=${token}&q=${name}`);

    // Convertit la réponse HTTP en JSON
    const data = await response.json();

    // Renvoie les données obtenues au frontend (EJS / fetch JS)
    res.status(StatusCodes.OK).json(data);

  } catch (error) { //En cas d’erreur

    console.error("Erreur Perenual:", error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la récupération des données." });
  }
});

export default router;
