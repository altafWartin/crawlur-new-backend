const express = require('express');
const router = express.Router();
const auditControllers = require('../controllers/auditControllers');
const { authenticate } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');



// get all products
router.get('/products', authenticate, authorize('Admin', 'Analyst'), auditControllers.getProducts);


// Approve the product
router.put('/approve/:id', authenticate, authorize('Admin', 'Analyst'), auditControllers.approveProduct);

// Edit the product
router.put('/edit/:id', authenticate, authorize('Admin', 'Analyst'), auditControllers.editProduct);

// Fix the product
router.put('/fix/:id', authenticate, authorize('Admin', 'Analyst'), auditControllers.fixProduct);

// Draft the product
router.put('/draft/:id', authenticate, authorize('Admin', 'Analyst'), auditControllers.draftProduct);

// Mark the product as duplicate
router.put('/duplicate/:id', authenticate, authorize('Admin', 'Analyst'), auditControllers.duplicateProduct);

// Delete the product
router.delete('/delete/:id', authenticate, authorize('Admin', 'Analyst'), auditControllers.deleteProduct);

module.exports = router;
