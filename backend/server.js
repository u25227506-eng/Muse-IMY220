import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/signin", (req, res) => {
    const {email, password} = req.body;
    res.json({
        message: "Sign in successful", 
        user: {
            id: 1, 
            username: "tshidi",
            email: email,
        },
    });
});

app.post("/api/signup", (req, res) => {
    const {username, email, password} = req.body;
    res.json({
        message: "Sign up successful",
        user: {
            id: 2, 
            username: username,
            email: email,
        },
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})