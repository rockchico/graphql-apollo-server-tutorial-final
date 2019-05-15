import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
  },
);

const models = {
    User: sequelize.import('./user'),
    Message: sequelize.import('./message'),
};

Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
        models[key].associate(models);
    }
});

export { sequelize };
export default models;


/*
let users = {
    1: {
        id: '1',
        username: 'José',
        lastname: 'Pereira da Silva',
        messageIds: [1],
    },
    2: {
        id: '2',
        username: 'João',
        lastname: 'Batman',
        messageIds: [2],
    },
};

let messages = {
    1: {
        id: '1',
        text: 'Hello World',
        userId: '1',
    },
    2: {
        id: '2',
        text: 'By World',
        userId: '2',
    },
    3: {
        id: '3',
        text: 'bla bla bla',
        userId: '2',
    },
    4: {
        id: '4',
        text: 'opa opa opa',
        userId: '2',
    },
    5: {
        id: '5',
        text: 'ble ble ble',
        userId: '2',
    },
};

export default {
    users,
    messages,
};
*/