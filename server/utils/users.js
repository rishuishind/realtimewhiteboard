
const users = []

const userJoin = (name, userId, roomId, host, presenter) => {
    const user = { userId, name, roomId, host, presenter };
    users.push(user);
    return users;
}

const userLeave = (userId) => {
    const index = users.findIndex((user) => user.userId === userId);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUsers = (roomId) => {
    const RoomUsers = [];
    users.map((user) => {
        if (user.roomId == roomId) {
            RoomUsers.push(user);
        }
    })
    return RoomUsers;
}

module.exports = {
    userJoin,
    userLeave,
    getUsers,
}