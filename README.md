# Candidate Selection and Ranking System (Updated)

This is an improved Node.js project that manages candidate data, calculates total marks and ranks based on specific rules, and stores everything in a MySQL database. It uses `prompt-sync` for interactive input and `mysql` package for database operations.

---

## ✅ Updated Features

- Interactive CLI input for candidate details:
    - Student Name
    - College Name
    - Round 1, Round 2, Round 3, and Technical Round Marks
- Input validation with stricter checks:
    - Name length limits (Student Name ≤ 30 chars, College Name ≤ 50 chars).
    - Marks validated within specified ranges (Rounds 1-3: 0–10, Technical Round: 0–20).
- Result Calculation Logic:
    - Minimum Round Marks: 7.0 each
    - Minimum Technical Round Marks: 14.0
    - Minimum Total Marks: 35
    - Result is `'Selected'` or `'Rejected'` based on above criteria.
- Data Storage in MySQL:
    - Saves candidate data (including total marks and result).
- Dynamic Rank Calculation:
    - Candidates ranked by Total Marks in descending order.
    - Handles ties by giving same rank to equal total marks.
- Displays candidate data in a tabular format sorted by rank.

---

## ⚙️ Technologies Used

- Node.js
- MySQL
- prompt-sync
- console.table

---

## 📋 Usage Instructions

### 1️⃣ Prerequisites

- Install [Node.js](https://nodejs.org/)
- Install [MySQL](https://dev.mysql.com/downloads/mysql/)
- Create the `sampledb` database and `Candidates` table:

```sql
CREATE TABLE Candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    StudentName VARCHAR(30),
    CollegeName VARCHAR(50),
    Round1Marks FLOAT,
    Round2Marks FLOAT,
    Round3Marks FLOAT,
    TechnicalRoundMarks FLOAT,
    TotalMarks FLOAT,
    Result VARCHAR(10),
    Rank INT
);
