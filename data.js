const ROLE = {
  ADMIN: 'admin',
  BASIC: 'basic'
}

module.exports = {
  ROLE: ROLE,
  users: [
    { id: 1, name: 'Admin', email: 'admin@gmail.com', role: ROLE.ADMIN },
    { id: 2, name: 'Sally', email: 'sally@gmail.com', role: ROLE.BASIC },
    { id: 3, name: 'Joe', email: 'joe@gmail.com', role: ROLE.BASIC }
  ],
//   categories: [
//     { id: 1, name: "Bin's category", userId: 1 },
//     { id: 2, name: "Sally's category", userId: 2 },
//     { id: 3, name: "Joe's category", userId: 3 }
//   ]
}