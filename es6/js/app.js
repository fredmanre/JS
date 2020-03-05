// template string

const nombre = "Freddy";
const trabajo = "devops";

console.log(nombre, trabajo);


const contenedorApp = document.querySelector('#app');
let html = `
    <ul>
        <li>${nombre}</li>
        <li>${trabajo}</li>
    </ul>
`;
contenedorApp.innerHTML = html;

// funcino expresion

const saludo = function (persona) {
    console.log(`Hola ${persona}`)
}
saludo('Freddy')

let user_id = "https:123.123.2.4/reuest/user/33333333";
let split = user_id.split("/");
let id = split[split.length -1];

// function
const actividad = function(name='Freddy', activity="Teach") {
    console.log(`La persona ${name}, está realizando la actividad de ${activity}`);
}
actividad();

// this only apply for a unique function
let learn = code => `Coding in ${code}`
let learning = (code, coding) => {
    return `This is a ${code} and programing in ${coding}`
}
console.log(learning('Golang', 'Python'));
console.log(learn('Golang'));

// objects

const Persona = {
    nombre: "Freddy",
    prfesion: "Engineer",
    edad: 500,
}

// another object
function Tarea(name, priority) {
    this.name = name;
    this.priority = priority;
}
// attached method to Tarea. this method is not be able to modifcate
Tarea.prototype.showInfoTarea = function() {
    return `The task ${this.name} has a priority of ${this.priority}`;
}
const tarea = new Tarea('Learn JS', 'Urgent');
console.log(tarea.showInfoTarea());

// destructuring
const aprendiendoJS = {
    version: {
        old: "ES5",
        new: "ES6",
    },
    frameworks: ['React', 'VueJS', 'Angular'],
}

let {old} = aprendiendoJS.version;
console.log(old);

// object enhacement
const band = 'Greta Van Fleet';
const gender = "Hard Rock";
const songs = ["You're The One", "Flower Power", "Change is Gonna Come"]

const gretaVanFleet = {band, gender, songs}
console.log(gretaVanFleet);