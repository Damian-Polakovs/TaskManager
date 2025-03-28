"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = (yield database_1.usersCollection.find({}).toArray());
        res.status(200).json(users);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`issue with getting users ${error.message}`);
        }
        else {
            console.log(`error with ${error}`);
        }
        res.status(500).send("Failed to retrieve users");
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const user = (yield database_1.usersCollection.findOne(query));
        if (user) {
            res.status(200).send(user);
        }
        else {
            res.status(404).send(`No user found with id: ${id}`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`issue with getting user ${error.message}`);
        }
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});
exports.getUserById = getUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = req.body;
        newUser.dateJoined = new Date();
        newUser.lastUpdated = new Date();
        const result = yield database_1.usersCollection.insertOne(newUser);
        if (result) {
            res.status(201).location(`${result.insertedId}`).json({
                message: `Created a new user with id ${result.insertedId}`
            });
        }
        else {
            res.status(500).send("Failed to create a new user.");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`issue with creating user ${error.message}`);
        }
        res.status(400).send(`Unable to create new user`);
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const newData = Object.assign(Object.assign({}, req.body), { lastUpdated: new Date() });
        const result = yield database_1.usersCollection.updateOne(query, { $set: newData });
        if (result && result.matchedCount) {
            res.status(200).json({ message: `Successfully updated user with id ${id}` });
        }
        else if (!result.matchedCount) {
            res.status(404).json({ message: `No user found with id ${id}` });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`issue with updating user ${error.message}`);
        }
        res.status(400).send(error);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    try {
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield database_1.usersCollection.deleteOne(query);
        if (result && result.deletedCount) {
            res.status(202).json({ message: `Successfully removed user with id ${id}` });
        }
        else if (!result) {
            res.status(400).json({ message: `Failed to remove user with id ${id}` });
        }
        else if (!result.deletedCount) {
            res.status(404).json({ message: `No user found with id ${id}` });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`issue with deleting user ${error.message}`);
        }
        res.status(400).send(error);
    }
});
exports.deleteUser = deleteUser;
