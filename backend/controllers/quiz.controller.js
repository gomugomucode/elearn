const fs = require("fs").promises;
const path = require("path");

const dataFile = path.join(__dirname, "..", "..", "data", "quizzes.json");

async function readQuizzes() {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function writeQuizzes(data) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf8");
}

exports.listQuizzes = async (req, res) => {
  try {
    const quizzes = await readQuizzes();
    res.json({ quizzes });
  } catch (err) {
    console.error("listQuizzes error", err);
    res.status(500).json({ message: "Failed to load quizzes" });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quizzes = await readQuizzes();
    const { quizId } = req.params;
    const quiz = quizzes.find((q) => String(q.id) === String(quizId));
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ quiz });
  } catch (err) {
    console.error("getQuizById error", err);
    res.status(500).json({ message: "Failed to load quiz" });
  }
};