import { ROLE, } from './data'
  
  function findUserById(id, users) {
    return users.find(user => user.id == id)
  }

  function filterUserByName(name, users) {
    return users.filter(user => user.name.toLowerCase() === name.toLowerCase())
  }

  function getUsers(users) {
    return users.filter(user => user.role !== ROLE.ADMIN)
  }

  function deleteUserById(userId, users) {
    return users.splice(parseInt(userId)- 1, 1)
}
  
  module.exports = {
    findUserById,
    filterUserByName,
    getUsers,
    deleteUserById
  }