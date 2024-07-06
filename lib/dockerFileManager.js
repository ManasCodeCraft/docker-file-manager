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
var dockerode_1 = require("dockerode");
var DockerFileManager = /** @class */ (function () {
    function DockerFileManager(options) {
        this.options = options;
        this.docker = new dockerode_1.default(options);
        this.container = null;
    }
    DockerFileManager.prototype.setContainer = function (containerId) {
        this.container = this.docker.getContainer(containerId);
    };
    DockerFileManager.prototype.unsetContainer = function () {
        this.container = null;
    };
    DockerFileManager.prototype.execCommand = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var exec, stream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.container) {
                            throw new Error('Container not set. Call setContainer(containerId) first.');
                        }
                        return [4 /*yield*/, this.container.exec({
                                Cmd: ['sh', '-c', command],
                                AttachStdout: true,
                                AttachStderr: true
                            })];
                    case 1:
                        exec = _a.sent();
                        return [4 /*yield*/, exec.start()];
                    case 2:
                        stream = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var output = '';
                                stream.on('data', function (data) {
                                    output += data.toString();
                                });
                                stream.on('end', function () { return resolve(output); });
                                stream.on('error', reject);
                            })];
                }
            });
        });
    };
    DockerFileManager.prototype.detectPlatform = function () {
        return __awaiter(this, void 0, void 0, function () {
            var platform, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.execCommand('uname')];
                    case 1:
                        platform = _a.sent();
                        if (platform.trim().toLowerCase() === 'darwin') {
                            return [2 /*return*/, 'macos'];
                        }
                        else if (platform.trim().toLowerCase() === 'linux') {
                            return [2 /*return*/, 'linux'];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.error("Failed to detect platform: ".concat(err_1.message));
                        return [3 /*break*/, 3];
                    case 3: 
                    // Fallback to default behavior (assuming Linux)
                    return [2 /*return*/, 'linux'];
                }
            });
        });
    };
    DockerFileManager.prototype.writeFile = function (filePath_1) {
        return __awaiter(this, arguments, void 0, function (filePath, content) {
            var platform, command, err_2;
            if (content === void 0) { content = ''; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.detectPlatform()];
                    case 1:
                        platform = _a.sent();
                        command = '';
                        switch (platform) {
                            case 'macos':
                                command = "echo \"".concat(content, "\" > ").concat(filePath);
                                break;
                            case 'windows':
                                command = "echo ".concat(content, " > ").concat(filePath.replace(/\//g, '\\'));
                                break;
                            default: // Linux
                                command = "echo \"".concat(content, "\" > ").concat(filePath);
                                break;
                        }
                        return [4 /*yield*/, this.execCommand(command)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        err_2 = _a.sent();
                        console.error("Failed to create file ".concat(filePath, ": ").concat(err_2.message));
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DockerFileManager.prototype.renameFile = function (oldPath, newPath) {
        return __awaiter(this, void 0, void 0, function () {
            var platform, command, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.detectPlatform()];
                    case 1:
                        platform = _a.sent();
                        command = '';
                        switch (platform) {
                            case 'macos':
                            case 'linux':
                                command = "mv ".concat(oldPath, " ").concat(newPath);
                                break;
                            case 'windows':
                                command = "move ".concat(oldPath.replace(/\//g, '\\'), " ").concat(newPath.replace(/\//g, '\\'));
                                break;
                            default: // Default fallback to Linux behavior
                                command = "mv ".concat(oldPath, " ").concat(newPath);
                                break;
                        }
                        return [4 /*yield*/, this.execCommand(command)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        err_3 = _a.sent();
                        console.error("Failed to rename file ".concat(oldPath, " to ").concat(newPath, ": ").concat(err_3.message));
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DockerFileManager.prototype.deleteFile = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var platform, command, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.detectPlatform()];
                    case 1:
                        platform = _a.sent();
                        command = '';
                        switch (platform) {
                            case 'macos':
                            case 'linux':
                                command = "rm ".concat(filePath);
                                break;
                            case 'windows':
                                command = "del ".concat(filePath.replace(/\//g, '\\'));
                                break;
                            default: // Default fallback to Linux behavior
                                command = "rm ".concat(filePath);
                                break;
                        }
                        return [4 /*yield*/, this.execCommand(command)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        err_4 = _a.sent();
                        console.error("Failed to delete file ".concat(filePath, ": ").concat(err_4.message));
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DockerFileManager.prototype.createFolder = function (folderPath) {
        return __awaiter(this, void 0, void 0, function () {
            var platform, command, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.detectPlatform()];
                    case 1:
                        platform = _a.sent();
                        command = '';
                        switch (platform) {
                            case 'macos':
                            case 'linux':
                                command = "mkdir -p ".concat(folderPath);
                                break;
                            case 'windows':
                                command = "mkdir ".concat(folderPath.replace(/\//g, '\\'));
                                break;
                            default: // Default fallback to Linux behavior
                                command = "mkdir -p ".concat(folderPath);
                                break;
                        }
                        return [4 /*yield*/, this.execCommand(command)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        err_5 = _a.sent();
                        console.error("Failed to create folder ".concat(folderPath, ": ").concat(err_5.message));
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DockerFileManager.prototype.renameFolder = function (oldPath, newPath) {
        return __awaiter(this, void 0, void 0, function () {
            var platform, command, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.detectPlatform()];
                    case 1:
                        platform = _a.sent();
                        command = '';
                        switch (platform) {
                            case 'macos':
                            case 'linux':
                                command = "mv ".concat(oldPath, " ").concat(newPath);
                                break;
                            case 'windows':
                                command = "move ".concat(oldPath.replace(/\//g, '\\'), " ").concat(newPath.replace(/\//g, '\\'));
                                break;
                            default: // Default fallback to Linux behavior
                                command = "mv ".concat(oldPath, " ").concat(newPath);
                                break;
                        }
                        return [4 /*yield*/, this.execCommand(command)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        err_6 = _a.sent();
                        console.error("Failed to rename folder ".concat(oldPath, " to ").concat(newPath, ": ").concat(err_6.message));
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DockerFileManager.prototype.deleteFolder = function (folderPath) {
        return __awaiter(this, void 0, void 0, function () {
            var platform, command, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.detectPlatform()];
                    case 1:
                        platform = _a.sent();
                        command = '';
                        switch (platform) {
                            case 'macos':
                            case 'linux':
                                command = "rm -r ".concat(folderPath);
                                break;
                            case 'windows':
                                command = "rmdir /s /q ".concat(folderPath.replace(/\//g, '\\'));
                                break;
                            default: // Default fallback to Linux behavior
                                command = "rm -r ".concat(folderPath);
                                break;
                        }
                        return [4 /*yield*/, this.execCommand(command)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        err_7 = _a.sent();
                        console.error("Failed to delete folder ".concat(folderPath, ": ").concat(err_7.message));
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DockerFileManager.prototype.getFileStats = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var platform, statsCommand, stats, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.detectPlatform()];
                    case 1:
                        platform = _a.sent();
                        statsCommand = '';
                        switch (platform) {
                            case 'macos':
                                statsCommand = "stat -f '{\"mode\": \"%Sp\", \"size\": \"%z\", \"owner\": \"%Su\", \"group\": \"%Sg\", \"modified\": \"%Sm\", \"accessed\": \"%Sa\"}' ".concat(filePath);
                                break;
                            case 'windows':
                                statsCommand = "powershell -Command \"& {Get-Item -Path '".concat(filePath.replace(/\//g, '\\'), "'} | ConvertTo-Json\"");
                                break;
                            default: // Linux
                                statsCommand = "stat -c '{\"mode\": \"%a\", \"size\": \"%s\", \"owner\": \"%U\", \"group\": \"%G\", \"modified\": \"%y\", \"accessed\": \"%x\"}' ".concat(filePath);
                                break;
                        }
                        if (!statsCommand) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.execCommand(statsCommand)];
                    case 2:
                        stats = _a.sent();
                        return [2 /*return*/, JSON.parse(stats)];
                    case 3:
                        console.error("Unsupported platform for getting file stats: ".concat(platform));
                        return [2 /*return*/, null];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_8 = _a.sent();
                        console.error("Failed to get file stats for ".concat(filePath, ": ").concat(err_8.message));
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return DockerFileManager;
}());
exports.default = DockerFileManager;
