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
const person_repository_1 = require("./person-repository");
const person_model_1 = require("./person-model");
const person = new person_model_1.Person();
person.id = new Date().toTimeString();
person.name = 'name-1';
person.birthday = '1990-20-10';
person.active = true;
person_repository_1.personRepository.insert(person)
    .then(createdPerson => console.log(createdPerson))
    .then(() => __awaiter(void 0, void 0, void 0, function* () { return person_repository_1.personRepository.findAll(); }))
    .then(allPersons => console.log(allPersons))
    .then(() => __awaiter(void 0, void 0, void 0, function* () { return person_repository_1.personRepository.findOneById(person.id); }))
    .then(foundPerson => console.log(foundPerson))
    .then(() => __awaiter(void 0, void 0, void 0, function* () { return person_repository_1.personRepository.delete(person); }))
    .then(() => __awaiter(void 0, void 0, void 0, function* () { return person_repository_1.personRepository.findOneById(person.id); })) // Deve retornar null.
    .then(deletedPerson => console.log(deletedPerson)) // Deve printar null.
    .catch(e => console.error(e));
//# sourceMappingURL=index.js.map