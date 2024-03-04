
const users = []

const userJoin = (name, userId, roomId, host, presenter, socketId) => {
    const user = { userId, name, roomId, host, presenter, socketId };
    users.push(user);
    return users.filter((us) => us.roomId === roomId);
}

const userLeave = (id) => {
    const index = users.findIndex((user) => user.socketId === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return users.find((user) => user.socketId === id);
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
    getUser,
    getUsers,
}