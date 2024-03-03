interface UserType{
    userId:Number,
    name:String,
    roomId:Number,
    host:Boolean,
    presenter:Boolean
}


const users:UserType[]=[]

const userJoin=(userId:number,name:string,roomId:number,host:boolean,presenter:boolean)=>{
    const user:UserType={userId,name,roomId,host,presenter};
    users.push(user);
    return user;
}

const userLeave=(userId:number)=>{
    const index = users.findIndex((user)=>user.userId===userId);
    if(index!==-1){
        return users.splice(index,1)[0];
    }
}

const getUsers=(roomId:number)=>{
    const RoomUsers:UserType[]=[];
    users.map((user)=>{
        if(user.roomId == roomId){
            RoomUsers.push(user);
        }
    })
    return RoomUsers;
}

module.exports ={
    userJoin,
    userLeave,
    getUsers,
}