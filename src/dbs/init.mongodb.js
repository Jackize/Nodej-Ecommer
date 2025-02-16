const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");

const connectString = "mongodb://localhost:27017/shopdev";

class Database {
    constructor() {
        this._connect();
    }
    
    _connect() {
        if( 1 == 1) {
            mongoose.set("debug", true);
            mongoose.set("debug", {color: true});
        }
        mongoose
        .connect(connectString)
        .then(() => {
            countConnect();
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            console.error(err);
        });
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new Database();
        }
        return this.instance;
    }
}

const instanceMongo = Database.getInstance();
module.exports = instanceMongo;