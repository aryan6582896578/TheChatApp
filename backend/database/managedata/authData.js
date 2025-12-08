import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const saltCount = process.env.saltCount;

export function signJwt(userId,timestamp) {
  const createJwtToken = jwt.sign({userId: userId,lastUpdated:timestamp || 0 },process.env.privateKey);
  return createJwtToken;
}

export function verifyJwt(token,location) {
  try {
    const verifyJwtToken = jwt.verify(token, process.env.privateKey);
    return verifyJwtToken;
  } catch (error) {
    console.log("invalid jwt",token , location);
  }
}

export async function createPasswordHash(plainPassword) {
  const hashedPassword = await bcrypt.hash(plainPassword, parseInt(saltCount));
  return hashedPassword;
}

export async function checkPasswordHash(plainPassword, hashedPassword) {
  const isHashedPassword = await bcrypt.compare(plainPassword, hashedPassword);
  return isHashedPassword;
}
