import { Type } from "class-transformer";
import 'reflect-metadata';

export enum LogLevel {
    INFO,
    WARNING,
    ERROR,
    FATAL,
    VERBOSE
};

export class LogEntry {
    @Type(() => Date)
    date: Date = new Date();

    constructor(public level: LogLevel = LogLevel.INFO,
        public message: string = '',
        public objects: Object[] = []) {
        this.date = new Date();
        this.level = level;
        this.message = message;
    }

    static info(msg: string, objects?: Object[]): LogEntry {
        return new LogEntry(LogLevel.INFO, msg, objects);
    }

    static warning(msg: string, objects?: Object[]): LogEntry {
        return new LogEntry(LogLevel.WARNING, msg, objects);
    }

    static error(msg: string, objects?: Object[]): LogEntry {
        return new LogEntry(LogLevel.ERROR, msg, objects);
    }

    static fatal(msg: string, objects?: Object[]): LogEntry {
        return new LogEntry(LogLevel.FATAL, msg, objects);
    }

    static verbose(msg: string, objects?: Object[]): LogEntry {
        return new LogEntry(LogLevel.VERBOSE, msg, objects);
    }

    toString() {
        return `${LogLevel[this.level]} ${this.date.toISOString()}: ${this.message} ${JSON.stringify(this.objects)}`
    }

    toShortString() {
        return `${LogLevel[this.level]} ${this.date.toISOString()}: ${this.message}`
    }
}