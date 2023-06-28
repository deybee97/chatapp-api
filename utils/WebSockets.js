
class WebSockets {

    connection = (client) => {

        users = []

        // event fired when the chat room is disconnected

        client.on('disconnected', ()=>{
            this.users = this.users.filter(user=>user.socketId !== client.id)
        })

        // add identity of user mapped to the socket id
        client.on("identity", userId => {

            this.users.push({
                socketId: client.id,
                userId
            })
        } )

        client.on('subscribe', (room, otherUserId = "")=>{

            this.subscribeOtherUsers(room, otherUserId)
            client.join(room)
        })

        client.on("unsubscribe", (room) => {
            client.leave(room);
          });
        }


        subscribeOtherUser = (room, otherUserId)  =>{
            const userSockets = this.users.filter(
              (user) => user.userId === otherUserId
            );
            userSockets.map((userInfo) => {
              const socketConn = global.io.sockets.connected(userInfo.socketId);
              if (socketConn) {
                socketConn.join(room);
              }
            });
          }
}


export default new WebSockets()