const Issue = require("../models/customerIssueModel");
const Team = require("../models/divisionModel");
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: "xlaNlZPeRdRFhSzQdfgc3apVGHhODVRCtaxBDJlQ",
});

const editIssue = async (req, res) => {
  try {
    const { issueId, completed, priority, issueDescription } = req.body;

    if (!issueId) {
      return res.status(400).json({ error: "Issue ID is required." });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found." });
    }

    if (completed !== undefined) {
      if (completed === "true") {
        issue.completed = true;
      } else if (completed === "false") {
        issue.completed = false;
      } else {
        return res.status(400).json({
          error: 'Invalid value for completed. Use "true" or "false".',
        });
      }
    }

    if (priority !== undefined) {
      const validPriorities = ["low", "medium", "high"];
      if (validPriorities.includes(priority.toLowerCase())) {
        issue.priority = priority.toLowerCase();
      } else {
        return res.status(400).json({
          error: `Invalid priority value. Use one of: ${validPriorities.join(
            ", "
          )}.`,
        });
      }
    }

    if (issueDescription !== undefined) {
      if (
        typeof issueDescription === "string" &&
        issueDescription.trim().length > 0
      ) {
        issue.issueDescription = issueDescription.trim();
      } else {
        return res.status(400).json({
          error: "Invalid issue description. It must be a non-empty string.",
        });
      }
    }

    await issue.save();

    res.status(200).json({ message: "Issue edited successfully.", issue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitIssue = async (req, res) => {
  const { description } = req.body;
  try {
    const classificationResponse = await cohere.classify({
      model: "92f46bf6-762d-4016-a0dd-0cd1873aea18-ft",
      inputs: [description],
      examples: [],
    });

    const assignedTeamName =
      classificationResponse.classifications[0]?.prediction;

    console.log("assigned Team name: ", assignedTeamName);

    if (!assignedTeamName) {
      return res.status(400).json({ error: "Classification failed" });
    }

    const newIssue = new Issue({
      issueDescription: description,
    });
    await newIssue.save();

    let team = await Team.findOne({ title: assignedTeamName });
    if (team) {
      team.customerIssues.push(newIssue._id);
      await team.save();
    } else {
      team = new Team({
        title: assignedTeamName,
        customerIssues: [newIssue._id],
      });
      await team.save();
    }

    res.status(201).json({
      message: "Issue successfully submitted",
      issueId: newIssue._id,
      team,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const removeIssue = async (req, res) => {
//   const { issueId } = req.body;
//   try {
//     const existingIssue = await Issue.findById(issueId);

//     if (!existingIssue) {
//       return res.status(404).json({ message: 'Issue not found' });
//     }

//     await Issue.findByIdAndRemove(issueId);

//     const team = await Team.findOne({ customerIssues: issueId });
//     if (team) {
//       team.customerIssues.pull(issueId);
//       await team.save();
//     }

//     res.status(200).json({ message: 'Issue removed successfully' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const removeIssues = async (req, res) => {
  const { issueIds } = req.body;
  if (!Array.isArray(issueIds) || issueIds.length === 0) {
    return res
      .status(400)
      .json({ message: "No issueIds provided or invalid format" });
  }

  try {
    const existingIssues = await Issue.find({ _id: { $in: issueIds } });

    const existingIssueIds = existingIssues.map((issue) =>
      issue._id.toString()
    );
    const notFoundIds = issueIds.filter((id) => !existingIssueIds.includes(id));

    if (notFoundIds.length > 0) {
      return res.status(404).json({
        message: `Issues not found for IDs: ${notFoundIds.join(", ")}`,
      });
    }

    await Issue.deleteMany({ _id: { $in: issueIds } });

    const teams = await Team.find({ customerIssues: { $in: issueIds } });

    await Promise.all(
      teams.map(async (team) => {
        team.customerIssues = team.customerIssues.filter(
          (issueId) => !issueIds.includes(issueId.toString())
        );
        await team.save();
      })
    );

    res.status(200).json({ message: "Issues removed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "submittedAt",
      order = "desc",
    } = req.query;
    const sortOrder = order === "asc" ? 1 : -1;

    const issues = await Issue.find()
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (issues.length === 0) {
      return res.status(204).json({ message: "No issues found" });
    }

    const totalIssues = await Issue.countDocuments();

    res.status(200).json({
      message: "All customer issues retrieved successfully",
      totalIssues,
      currentPage: page,
      totalPages: Math.ceil(totalIssues / limit),
      issues,
    });
  } catch (error) {
    console.error("Error retrieving customer issues:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving customer issues" });
  }
};

// More efficent algorithm
// const getAllIssues = async (req, res) => {
//   try {
//     // Parse query parameters with defaults
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const sortBy = req.query.sortBy || 'submittedAt';
//     const order = req.query.order === 'asc' ? 1 : -1;

//     // Verify that sortBy is a valid field in the Issue schema
//     const validSortKeys = ['submittedAt', 'status', 'priority']; // Example valid fields
//     if (!validSortKeys.includes(sortBy)) {
//       return res.status(400).json({ error: 'Invalid sort key' });
//     }

//     // Retrieve issues and total count concurrently
//     const [issues, totalIssues] = await Promise.all([
//       Issue.find()
//         .sort({ [sortBy]: order })
//         .skip((page - 1) * limit)
//         .limit(limit),
//       Issue.countDocuments()
//     ]);

//     // If no issues found, respond with 204 No Content
//     if (!issues.length) {
//       return res.status(204).json({ message: 'No issues found' });
//     }

//     // Respond with retrieved issues and pagination info
//     res.status(200).json({
//       message: 'All customer issues retrieved successfully',
//       totalIssues,
//       currentPage: page,
//       totalPages: Math.ceil(totalIssues / limit),
//       issues
//     });
//   } catch (error) {
//     console.error('Error retrieving customer issues:', error.message);
//     res.status(500).json({ error: 'An error occurred while retrieving customer issues' });
//   }
// };

module.exports = { submitIssue, removeIssues, getAllIssues, editIssue };
