const ROLE = {
  ADMIN: 'admin',
  BASIC: 'basic'
}

module.exports = {
  ROLE: ROLE,
  users: [
    { id: 1, name: 'Admin', email: 'admin@gmail.com', password: '$2b$10$0v9.QA3z85lMoaoTQLsRoeK.XJmoTl0dxNFMUg7nSkGIBPKCQLRHu', role: ROLE.ADMIN },
    { id: 2, name: 'Sally', email: 'sally@gmail.com', password: '$2b$10$5QG0ThM54HukGa.zxSpOCev0Vtm6h1jMkCoBN7tbvJeX2fzwvM3sC', role: ROLE.BASIC }
  ],
}