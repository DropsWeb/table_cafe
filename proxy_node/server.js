const http = require("http");
const WebSocket = require("ws");
const fetch_helper = require('./modules/fetch_helper');
const uhelper = require('./modules/user_helper');
const port = 8999;


const server = http.createServer();

let clients = {};

let timeouts_id = [];

let rooms = [
    {
        id: 1,
        name: 'Барнаул',
        orders: [],
        end_orders: []
    },
    {
        id: 2,
        name: 'Горный Алтай',
        orders: [],
        end_orders: []
    },
    {
        id: 3,
        name: 'Новоалтайск',
        orders: [],
        end_orders: []
    },
    {
        id: 4,
        name: 'Новоалтайск Дёнер',
        orders: [],
        end_orders: []
    },
    {
        id: 5,
        name: 'Заринск',
        orders: [],
        end_orders: []
    },
    {
        id: 6,
        name: 'Сростки',
        orders: [],
        end_orders: []
    },

];

const webSocketServer = new WebSocket.Server({ server });

webSocketServer.on('connection', ws => {
    let id = Math.random();
    clients[id] = ws;
    clients[id].id = id;
    clients[id].user_info = {};
    clients[id].user_info.status = true;

    // let result = uhelper.update_data(clients);

    const admin = {
        login: "admin",
        password: '123'
    };
    const user = {
        login: 'user',
        password: '321'
    };

    // uhelper.send_all(result, clients);

    ws.on('message', data => {
        data = JSON.parse(data.toString('utf8'));
        let type = data.type;
        switch (type) {
            case 'save_name':
                console.log(data)
                let result = {
                    type: 'auth_user',
                    authorized: '',
                    is_admin: false,
                }
                if (data.name.login == admin.login && data.name.password == admin.password) {
                    console.log('Авторизуется админ');
                    result.authorized = true;
                    result.is_admin = true;
                    ws.send(JSON.stringify(result));
                } else if (data.name.login == user.login && data.name.password == user.password) {
                    result.authorized = true;
                    ws.send(JSON.stringify(result));
                }
                // fetch_helper.api_fetch({
                //     url: 'save_user',
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json;charset=utf-8',
                //     },
                //     body: JSON.stringify(data)
                // }).then(text => {
                //     let data = JSON.parse(text);
                //     data.new_user.status = true;
                //     ws.send(JSON.stringify(data.new_user));
                //     clients[id].user_info.id = data.new_user.id;
                //     clients[id].user_info.name = data.new_user.name;

                //     let result = uhelper.update_data(clients);

                //     uhelper.send_all(result, clients);

                // })
                console.log('Пользователь хочет сохранить имя')
                break;
            case 'create_order':
                create_order(data);
                break;
            case 'get_rooms':
                let answer = {
                    type: 'get_rooms',
                    rooms: rooms
                };
                console.log(answer);
                ws.send(JSON.stringify(answer));
                break;
            case 'check_cookie':
                let check = false;
                for (key in clients) {
                    if (clients[key].id == data.id) {
                        check = true;
                    }
                }

                if (check) {
                    clients[id].user_info = clients[data.id].user_info;
                    clients[id].user_info.status = true;
                    clearTimeout(timeouts_id[data.id]);
                    delete clients[data.id];
                    let result = uhelper.update_data(clients);
                    let old_user = {
                        type: 'auth_user',
                        data: clients[id].user_info
                    };

                    ws.send(JSON.stringify(old_user));
                    uhelper.send_all(result, clients);
                }
                let data_cookie = {
                    type: 'cookie_user',
                    id: id
                };
                ws.send(JSON.stringify(data_cookie))
                break;
            case 'get_room':
                get_room(data);
                break;
            case 'create_room':
                console.log("Пользователь хочет создать комнату")
                break;
            case 'end_order':
                end_order(data);
                break;
            case 'remove_order':
                remove_order(data);
                break;
        }

        function remove_order(data) {
            let key_room = '';
            rooms.forEach((room, key) => {
                if (room.id == data.id_room) {
                    key_room = key;
                    let index = rooms[key].orders.indexOf(data.order);
                    rooms[key].end_orders.splice(index, 1);
                }
            })
            let result = {
                type: 'get_room',
                room: rooms[key_room]
            };
            uhelper.send_all(result, clients);
        }
        function end_order(data) {
            let key_room = '';
            rooms.forEach((room, key) => {
                if (room.id == data.id_room) {
                    key_room = key;
                    let index = rooms[key].orders.indexOf(data.order);
                    rooms[key].orders.splice(index, 1);
                    rooms[key].end_orders.push(data.order);
                }
            })
            let result = {
                type: 'get_room',
                room: rooms[key_room]
            }
            uhelper.send_all(result, clients);
        }

        function get_room(data) {
            let key_room = '';
            
            rooms.forEach((room, key) => {
                if (room.id == data.room) {
                    key_room = key;
                }
            })
            let result = {
                type: 'get_room',
                room: rooms[key_room],
            };
            uhelper.send_all(result, clients);
        };
        function create_order(data) {
            let key_room = '';
            rooms.forEach((room, key) => {
                if (room.id == data.id_room) {
                    key_room = key;
                    console.log('Запись заказа в эту комнату: ')
                    room.orders.push(data.order);
                }
            })
            
            let result = {
                type: 'create_order',
                room: rooms[key_room]
            };
            uhelper.send_all(result, clients);
        };

    });

    ws.on('close', () => {
        if (clients[id]) {
            if (!clients[id].user_info.id) {
                delete clients[id];
            } else {

                clients[id].user_info.status = false;

                let result = uhelper.update_data(clients);
                uhelper.send_all(result, clients);

                timeouts_id[id] = setTimeout(function() {
                    let data = {
                        type: 'delete_user',
                        id: clients[id].user_info.id,
                    }

                    // fetch_helper.api_fetch({
                    //     url: 'delete_user',
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json;charset=utf-8',
                    //     },
                    //     body: JSON.stringify(data)
                    // }).then(text => {
                    //     console.log(text);
                    // })
                    delete clients[id];
                    let result = uhelper.update_data(clients);
                    uhelper.send_all(result, clients);
                }, 1000 * 3)
            }


        }
    })



    ws.on("error", e => ws.send(e));


});

server.listen(port, () => {
    // fetch_helper.api_fetch({
    //     url: 'delete_users',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json;charset=utf-8',
    //     }
    // })
    console.log('Server starting!')
})