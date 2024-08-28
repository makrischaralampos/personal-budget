const bcrypt = require("bcryptjs");

let users = [];

// Create a user
const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = { id: users.length + 1, username, password: hashedPassword };
  users.push(user);
  return user;
};

// Find user by username
const findUserByUsername = (username) => {
  return users.find((user) => user.username === username);
};

// Find user by ID
const findUserById = (id) => {
  return users.find((user) => user.id === id);
};

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
};
