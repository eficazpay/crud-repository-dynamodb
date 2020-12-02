import { personRepository } from "./person-repository";
import { Person } from "./person-model";

const person = new Person();
person.id = new Date().toTimeString();
person.name = 'name-1';
person.birthday = '1990-20-10';
person.active = true;

personRepository.insert(person)
  .then(createdPerson => console.log(createdPerson))
  .then(async () => personRepository.findAll())
  .then(allPersons => console.log(allPersons))
  .then(async () => personRepository.findOneById(person.id))
  .then(foundPerson => console.log(foundPerson))
  .then(async () => personRepository.delete(person))
  .then(async () => personRepository.findOneById(person.id)) // Deve retornar null.
  .then(deletedPerson => console.log(deletedPerson)) // Deve printar null.
  .catch(e => console.error(e));