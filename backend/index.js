import dotenv from "dotenv";
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"

dotenv.config();

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"]
}))

app.use(express.json());

// Routes
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)

app.get("/", (req, res) => {
    res.send("Hello from backend")
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("Error connecting to DB", err))

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})