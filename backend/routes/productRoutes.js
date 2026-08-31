import express from 'express';
import {
  getProducts,
  getProductById,
  getBrands,
  getSuggestions,
  uploadProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/brands', getBrands);
router.get('/suggestions', getSuggestions);
router.get('/:id', getProductById);
router.post('/upload', uploadProducts);
router.post('/upload-image', uploadProductImage);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
