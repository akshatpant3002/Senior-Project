const express = require('express');
const router = express.Router();
const { submitIssue, removeIssues, getAllIssues } = require('../controllers/customerIssueController');

router.post('/submitIssue', submitIssue);

router.delete('/deleteIssue', removeIssues);

router.get('/issues', getAllIssues);

module.exports = router;
