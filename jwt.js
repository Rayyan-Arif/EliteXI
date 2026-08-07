import jwt from "jsonwebtoken";

const token = jwt.sign(
  {
    email: "nabeehazafar2007@gmail.com",
  },
  "[i)CyE$+2-WICwgOIU.g-bs/zqj3Q6wt(B)cE9zylZuyfjil9b",
  {
    expiresIn: "1h",
  }
);

console.log(token);