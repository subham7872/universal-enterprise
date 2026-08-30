import express from 'express';
import {
  getProducts,
  getProductById,
  getBrands,
  getSuggestions,
  uploadProducts
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/brands', getBrands);
router.get('/suggestions', getSuggestions);
router.get('/:id', getProductById);
router.post('/upload', uploadProducts);

export default router;
