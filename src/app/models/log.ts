export enum LogLevel {
    INFO,
    WARNING,
    ERROR,
    FATAL,
    VERBOSE
};

export class LogEntry {
    date: Date = new Date();
    level: LogLevel = LogLevel.INFO;
    message: string = '';

    constructor(level: LogLevel, message: string) {
        this.date = new Date();
        this.level = level;
        this.message = message;
    }

    static info(msg: string): LogEntry {
        return new LogEntry(LogLevel.INFO, msg);
    }

    static warning(msg: string): LogEntry {
        return new LogEntry(LogLevel.WARNING, msg);
    }

    static error(msg: string): LogEntry {
        return new LogEntry(LogLevel.ERROR, msg);
    }

    static fatal(msg: string): LogEntry {
        return new LogEntry(LogLevel.FATAL, msg);
    }

    static verbose(msg: string): LogEntry {
        return new LogEntry(LogLevel.VERBOSE, msg);
    }

    toString() {
        return `${LogLevel[this.level]} ${this.date.toISOString()}: ${this.message}`
    }
}