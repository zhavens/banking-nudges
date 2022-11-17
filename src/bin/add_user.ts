// $ node -r tsconfig-paths/register -r ts-node/register src/bin/add_user.ts

import { instanceToPlain, plainToInstance } from "class-transformer";
import fs from "fs";
import path from "path";
import prompt_sync from "prompt-sync";
import { sys } from "typescript";

import { TEST_ACCOUNTS, TEST_CARDS, TEST_PAYEES, TEST_PAYMENTS, TEST_PERSONALIZATION } from "@/helpers/testdata";
import { User } from "@/models/user";

const USER_DIRECTORY = "/var/log/www/banking-nudges/users"

function getUsers(): User[] {
    const userfiles = fs.readdirSync(USER_DIRECTORY);
    console.log(`Loading users: ${userfiles}`)
    let users: User[] = [];

    for (let userfile of userfiles) {
        users.push(plainToInstance(User, JSON.parse(fs.readFileSync(path.join(USER_DIRECTORY, userfile), 'utf8'))));
    }

    return users;
}

function getNextId(): number {
    const users = getUsers();

    let id = 0;
    for (let user of users) {
        id = Math.max(id, user.id + 1);
    }
    return id;
}

function getUserFromStdin(): User {
    var prompt = prompt_sync({})
    let user = new User();

    user.accounts = TEST_ACCOUNTS;
    user.cards = TEST_CARDS;
    user.payees = TEST_PAYEES;
    user.payments = TEST_PAYMENTS;
    user.personalization = TEST_PERSONALIZATION;

    user.username = prompt("Enter username: ");
    console.log("Enter pasword: ");
    user.password = prompt({ echo: "*" });
    user.firstName = prompt("Enter first name: ");
    user.lastName = prompt("Enter last name: ");
    user.personalization.oaFirstName = prompt("Enter OA's first name: ");
    user.personalization.oaLastName = prompt("Enter OA's last name: ");
    user.personalization.oaRelation = prompt("Enter OA's relation: ");
    user.personalization.level = parseInt(prompt("Enter personalization level (0-2): "));
    user.admin = prompt("Is the user an admin? (y/n): ").toLowerCase().startsWith("y");

    user.payees[1].nickname = `${user.firstName}'s Account`

    return user;
}

function writeUser(user: User): void {
    user.id = getNextId();
    console.log(`Updating user ${user.id}`);
    const userPath = path.join(USER_DIRECTORY, `${user.username}.json`);
    try {
        fs.writeFileSync(userPath, JSON.stringify(instanceToPlain(user)));
    } catch (e) {
        console.log(`Error writing user file: ${e}`);
        sys.exit(1);
    }
    console.log(`User ${user.id} written.`)
}

let user = getUserFromStdin();
writeUser(user);
