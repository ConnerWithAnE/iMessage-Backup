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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHandleTable = exports.ChatMessageTable = exports.MessageAttachmentTable = exports.AttachmentTable = exports.HandleTable = exports.ChatTable = exports.MessageTable = void 0;
var tableNames_1 = require("../constants/tableNames");
var message_1 = require("../interfaces/message");
var chat_1 = require("../interfaces/chat");
var handle_1 = require("../interfaces/handle");
var attachment_1 = require("../interfaces/attachment");
var message_attachment_1 = require("../interfaces/message_attachment");
var chat_message_1 = require("../interfaces/chat_message");
var chat_handle_1 = require("../interfaces/chat_handle");
var MessageTable = /** @class */ (function () {
    function MessageTable(db) {
        this.db = db;
    }
    MessageTable.prototype.getAllRowsAsMap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var columns = Object.keys((0, message_1.createMessageInstance)()).join(',');
                        var query = "SELECT ".concat(columns, " FROM ").concat(tableNames_1.MESSAGE);
                        _this.db.all(query, function (err, rows) {
                            if (err) {
                                reject('Error executing query: ' + err.message);
                            }
                            else {
                                var resultMap_1 = new Map();
                                rows.forEach(function (row) {
                                    resultMap_1.set(row.ROWID, row);
                                });
                                _this.messageMap = resultMap_1;
                                resolve(resultMap_1);
                            }
                        });
                    })];
            });
        });
    };
    MessageTable.prototype.getEntriesByRowId = function (rowId) {
        if (!this.messageMap) {
            throw new Error('messageMap has not been initialized. Call getAllRowsAsMap() first.');
        }
        var entries = [];
        this.messageMap.forEach(function (value, key) {
            if (key === rowId) {
                entries.push(value);
            }
        });
        return entries;
    };
    MessageTable.prototype.getRowFromMap = function (rowID) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.messageMap) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAllRowsAsMap()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        row = this.messageMap.get(rowID);
                        if (row) {
                            resolve(row);
                        }
                        else {
                            reject("Error rowID ".concat(rowID, " does not exists within the handleMap"));
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return MessageTable;
}());
exports.MessageTable = MessageTable;
var ChatTable = /** @class */ (function () {
    function ChatTable(db) {
        this.db = db;
    }
    ChatTable.prototype.getAllRowsAsMap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var columns = Object.keys((0, chat_1.createChatInstance)()).join(',');
                        var query = "SELECT ".concat(columns, " FROM ").concat(tableNames_1.CHAT);
                        _this.db.all(query, function (err, rows) {
                            if (err) {
                                reject('Error executing query: ' + err.message);
                            }
                            else {
                                var resultMap_2 = new Map();
                                rows.forEach(function (row) {
                                    resultMap_2.set(row.ROWID, row);
                                });
                                _this.chatMap = resultMap_2;
                                resolve(resultMap_2);
                            }
                        });
                    })];
            });
        });
    };
    ChatTable.prototype.getRowFromMap = function (rowID) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.chatMap) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAllRowsAsMap()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        row = this.chatMap.get(rowID);
                        if (row) {
                            resolve(row);
                        }
                        else {
                            reject("Error row_id ".concat(rowID, " does not exists within the chatMap"));
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return ChatTable;
}());
exports.ChatTable = ChatTable;
var HandleTable = /** @class */ (function () {
    function HandleTable(db) {
        this.db = db;
    }
    HandleTable.prototype.getAllRowsAsMap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var columns = Object.keys((0, handle_1.createHandleInstance)()).join(',');
                        var query = "SELECT ".concat(columns, " FROM ").concat(tableNames_1.HANDLE);
                        _this.db.all(query, function (err, rows) {
                            if (err) {
                                reject('Error executing query: ' + err.message);
                            }
                            else {
                                var resultMap_3 = new Map();
                                rows.forEach(function (row) {
                                    resultMap_3.set(row.ROWID, row);
                                });
                                _this.handleMap = resultMap_3;
                                resolve(resultMap_3);
                            }
                        });
                    })];
            });
        });
    };
    HandleTable.prototype.getRowFromMap = function (rowID) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.handleMap) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAllRowsAsMap()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        row = this.handleMap.get(rowID);
                        if (row) {
                            resolve(row);
                        }
                        else {
                            reject("Error rowID ".concat(rowID, " does not exists within the handleMap"));
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return HandleTable;
}());
exports.HandleTable = HandleTable;
var AttachmentTable = /** @class */ (function () {
    function AttachmentTable(db) {
        this.db = db;
    }
    AttachmentTable.prototype.getAllRowsAsMap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var columns = Object.keys((0, attachment_1.createAttachmentInstance)()).join(',');
                        var query = "SELECT ".concat(columns, " FROM ").concat(tableNames_1.ATTACHMENT);
                        _this.db.all(query, function (err, rows) {
                            if (err) {
                                reject('Error executing query: ' + err.message);
                            }
                            else {
                                var resultMap_4 = new Map();
                                rows.forEach(function (row) {
                                    resultMap_4.set(row.ROWID, row);
                                });
                                _this.attachmentMap = resultMap_4;
                                resolve(resultMap_4);
                            }
                        });
                    })];
            });
        });
    };
    AttachmentTable.prototype.getRowFromMap = function (rowID) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.attachmentMap) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAllRowsAsMap()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        row = this.attachmentMap.get(rowID);
                        if (row) {
                            resolve(row);
                        }
                        else {
                            reject("Error rowID ".concat(rowID, " does not exists within the attachmentMap"));
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return AttachmentTable;
}());
exports.AttachmentTable = AttachmentTable;
var MessageAttachmentTable = /** @class */ (function () {
    function MessageAttachmentTable(db) {
        this.db = db;
    }
    MessageAttachmentTable.prototype.getAllRowsAsMap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var columns = Object.keys((0, message_attachment_1.createMessageAttachmentInstance)()).join(',');
                        var query = "SELECT ".concat(columns, " FROM ").concat(tableNames_1.MESSAGE_ATTACHMENT_JOIN);
                        _this.db.all(query, function (err, rows) {
                            if (err) {
                                reject('Error executing query: ' + err.message);
                            }
                            else {
                                var resultMap_5 = new Map();
                                rows.forEach(function (row) {
                                    resultMap_5.set(row.message_id, row);
                                });
                                _this.messageAttachmentMap = resultMap_5;
                                resolve(resultMap_5);
                            }
                        });
                    })];
            });
        });
    };
    MessageAttachmentTable.prototype.getRowFromMap = function (message_id) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.messageAttachmentMap) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAllRowsAsMap()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        row = this.messageAttachmentMap.get(message_id);
                        if (row) {
                            resolve(row);
                        }
                        else {
                            reject("Error rowID ".concat(message_id, " does not exists within the messageAttachmentMap"));
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return MessageAttachmentTable;
}());
exports.MessageAttachmentTable = MessageAttachmentTable;
var ChatMessageTable = /** @class */ (function () {
    function ChatMessageTable(db) {
        this.db = db;
    }
    ChatMessageTable.prototype.getMessageIDs = function (chat_id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var columns = Object.keys((0, chat_message_1.createChatMessageInstance)()).join(',');
                        var query = "SELECT ".concat(columns, " FROM ").concat(tableNames_1.CHAT_MESSAGE_JOIN, " WHERE chat_id = ").concat(chat_id);
                        _this.db.all(query, function (err, rows) {
                            if (err) {
                                reject('Error executing query: ' + err.message);
                            }
                            else {
                                var resultMap_6 = [];
                                rows.forEach(function (row) {
                                    resultMap_6.push(row.message_id);
                                });
                                resolve(resultMap_6);
                            }
                        });
                    })];
            });
        });
    };
    ChatMessageTable.prototype.getMessagesFromIDs = function (message_ids) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var columns = Object.keys((0, message_1.createMessageInstance)()).join(',');
                        var rowIDList = message_ids.join(',');
                        var query = "SELECT ".concat(columns, " FROM ").concat(tableNames_1.MESSAGE, " WHERE ROWID IN (").concat(rowIDList, ")");
                        _this.db.all(query, function (err, rows) {
                            if (err) {
                                reject('Error executing query: ' + err.message);
                            }
                            else {
                                var resultMap_7 = [];
                                rows.forEach(function (row) {
                                    resultMap_7.push(row.text);
                                });
                                resolve(resultMap_7);
                            }
                        });
                    })];
            });
        });
    };
    ChatMessageTable.prototype.getAllRowsAsMap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var columns = Object.keys((0, chat_message_1.createChatMessageInstance)()).join(',');
                        var query = "SELECT ".concat(columns, " FROM ").concat(tableNames_1.CHAT_MESSAGE_JOIN);
                        _this.db.all(query, function (err, rows) {
                            if (err) {
                                reject('Error executing query: ' + err.message);
                            }
                            else {
                                var resultMap_8 = new Map();
                                rows.forEach(function (row) {
                                    resultMap_8.set(row.message_id, row);
                                });
                                _this.chatMessageMap = resultMap_8;
                                resolve(resultMap_8);
                            }
                        });
                    })];
            });
        });
    };
    ChatMessageTable.prototype.getEntriesByRowId = function (rowId) {
        if (!this.chatMessageMap) {
            throw new Error('messageMap has not been initialized. Call getAllRowsAsMap() first.');
        }
        var entries = [];
        this.chatMessageMap.forEach(function (value, key) {
            if (key === rowId) {
                entries.push(value);
            }
        });
        return entries;
    };
    ChatMessageTable.prototype.getRowFromMap = function (chat_id) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.chatMessageMap) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAllRowsAsMap()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        row = this.chatMessageMap.get(chat_id);
                        if (row) {
                            resolve(row);
                        }
                        else {
                            reject("Error rowID ".concat(chat_id, " does not exists within the chatMessageMap"));
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return ChatMessageTable;
}());
exports.ChatMessageTable = ChatMessageTable;
var ChatHandleTable = /** @class */ (function () {
    function ChatHandleTable(db) {
        this.db = db;
    }
    ChatHandleTable.prototype.getAllRowsAsMap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var columns = Object.keys((0, chat_handle_1.createChatHandleInstance)()).join(',');
                        var query = "SELECT ".concat(columns, " FROM ").concat(tableNames_1.CHAT_HANDLE_JOIN);
                        _this.db.all(query, function (err, rows) {
                            if (err) {
                                reject('Error executing query: ' + err.message);
                            }
                            else {
                                var resultMap_9 = new Map();
                                rows.forEach(function (row) {
                                    resultMap_9.set(row.chat_id, row);
                                });
                                _this.chatHandleMap = resultMap_9;
                                resolve(resultMap_9);
                            }
                        });
                    })];
            });
        });
    };
    ChatHandleTable.prototype.getRowFromMap = function (chat_id) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.chatHandleMap) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAllRowsAsMap()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        row = this.chatHandleMap.get(chat_id);
                        if (row) {
                            resolve(row);
                        }
                        else {
                            reject("Error rowID ".concat(chat_id, " does not exists within the chatHandleMap"));
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return ChatHandleTable;
}());
exports.ChatHandleTable = ChatHandleTable;
