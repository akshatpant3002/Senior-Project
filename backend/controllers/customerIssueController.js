const Issue = require('../models/customerIssueModel');
const Team = require('../models/divisionModel');
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: "xlaNlZPeRdRFhSzQdfgc3apVGHhODVRCtaxBDJlQ"
});

const submitIssue = async (req, res) => {
  const { description } = req.body;
  try {
    const classificationResponse = await cohere.classify({
      model: "92f46bf6-762d-4016-a0dd-0cd1873aea18-ft",
      inputs: [description],
      examples: []
    });

    const assignedTeamName = classificationResponse.classifications[0]?.prediction;

    if (!assignedTeamName) {
      return res.status(400).json({ error: 'Classification failed' });
    }

    const newIssue = new Issue({
      issueDescription: description
    });
    await newIssue.save();

    const team = await Team.findOne({ title: assignedTeamName });

    if (team) {
      team.customerIssues.push(newIssue._id);
      await team.save();
    }

    res.status(201).json({
      message: 'Issue successfully submitted',
      issueId: newIssue._id,
      team
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeIssue = async (req, res) => {
  const { issueId } = req.body;
  try {
    const existingIssue = await Issue.findById(issueId);

    if (!existingIssue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    await Issue.findByIdAndRemove(issueId);

    const team = await Team.findOne({ customerIssues: issueId });
    if (team) {
      team.customerIssues.pull(issueId);
      await team.save();
    }

    res.status(200).json({ message: 'Issue removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find();

    if (issues.length === 0) {
      return res.status(404).json({ message: 'No issues found' });
    }

    res.status(200).json({
      message: 'All customer issues retrieved successfully',
      issues
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = { submitIssue, removeIssue };
