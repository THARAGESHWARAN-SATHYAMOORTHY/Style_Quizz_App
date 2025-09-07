import { Buffer } from "buffer";

const fakeUsers = [
  {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  },
];

const generateMockToken = (email) => {
  const header = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
  const payload = Buffer.from(
    JSON.stringify({ email, iat: Date.now() }),
  ).toString("base64");
  const signature = "mockSignature";
  return `${header}.${payload}.${signature}`;
};

export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = fakeUsers.find(
        (u) => u.email === email && u.password === password,
      );
      if (user) {
        const token = generateMockToken(email);
        resolve({ token, user: { name: user.name, email: user.email } });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1000);
  });
};

export const signup = async (name, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fakeUsers.some((u) => u.email === email)) {
        reject(new Error("User with this email already exists"));
      } else {
        const newUser = { name, email, password };
        fakeUsers.push(newUser);
        const token = generateMockToken(email);
        resolve({ token, user: { name: newUser.name, email: newUser.email } });
      }
    }, 1000);
  });
};
