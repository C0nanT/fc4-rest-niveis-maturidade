import { Router } from "express";
import { createDatabaseConnection } from "../database";

const router = Router();

router.post("/login", async (req, res) => {
  
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Email and password are required");
  }

  const { email, password } = req.body;
  const { userRepository } = await createDatabaseConnection();
  const user = await userRepository.findOne({
    where: {
      email: email as string,
      password: password as string,
    },
  });
  if (user) {
    //@ts-expect-error
    req.session.userId = user.id;
    req.session.save();
    return res.send("Logged in successfully");
  }

  res.status(401).send("Invalid email or password");
});

router.post("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.send("Logged out successfully");
  });
});

export default router;