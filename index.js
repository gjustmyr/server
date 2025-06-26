const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const campusesRoutes = require("./routes/campuses.routes");
const usersRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");
const sdgsRoutes = require("./routes/sdgs.routes");
const instrumentsRoutes = require("./routes/instruments.routes");
const recordRoutes = require("./routes/record.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const annualReportRoutes = require("./routes/annual-report.routes");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/campuses", campusesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sdgs", sdgsRoutes);
app.use("/api/instruments", instrumentsRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/annual-reports", annualReportRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
