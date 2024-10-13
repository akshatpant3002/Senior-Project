const express = require('express');
const router = express.Router();
const { submitIssue, removeIssue, getAllIssues } = require('../controllers/customerIssueController');

router.post('/submitIssue', submitIssue);

router.delete('/issues/:issueId', removeIssue);

router.get('/issues', getAllIssues);

module.exports = router;
