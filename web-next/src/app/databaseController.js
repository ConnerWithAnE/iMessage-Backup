"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeDatabase = void 0;
var sqlite3 = require("sqlite3");
var InitializeDatabase = /** @class */ (function () {
    function InitializeDatabase(dbPath) {
        var _this = this;
        this.dbPath = dbPath;
        this.db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READONLY, function (err) {
            if (err) {
                console.error('Error opening database:', err.message);
            }
            else {
                console.log("Connected to the database: ".concat(_this.dbPath));
            }
        });
    }
    InitializeDatabase.prototype.getDB = function () {
        return this.db;
    };
    return InitializeDatabase;
}());
exports.InitializeDatabase = InitializeDatabase;
