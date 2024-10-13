const express = require('express');
const router = express.Router();
const { getAllDivisions, createDivision, deleteDivision } = require('../controllers/divisionController');

// Route to get all divisions
router.get('/divisions', getAllDivisions);

// Route to create a new division
router.post('/createDivision', createDivision);

// Route to delete a division
router.delete('/divisions/:divisionId', deleteDivision);

//Route to adsiggn issue to division
router.put('/divisions/:divisionId/assignIssue', assignIssueToDivision);

module.exports = router;
