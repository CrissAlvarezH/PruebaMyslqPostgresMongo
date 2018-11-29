
function getHora() {
    let date = new Date();
    
    return date.getHours() +":"+ date.getMinutes() +":"+ date.getSeconds() + ":" + date.getMilliseconds();
}


/* [ INICIO ] SCRIPT PARA POSTGRESQL */

const { Client } = require('pg'); // requerimos postgresql

// Creamos el cliente para la conexión con Postgres
const cliente = new Client({
    user: 'prueba',
    host: 'localhost',
    database: 'prueba',
    password: 'prueba',
    port: 5432
});

let llenarTablaPruebas = async (cantidad) => {

    for ( let i = 0; i < cantidad; i++ ) {
        await cliente.query("INSERT INTO prueba (texto1, texto2, texto3, texto4, texto5) VALUES ('texto1', 'texto2', 'texto3', 'texto4', 'texto5');");
    }

}

let main = async () => {
    await cliente.connect();

    console.log( ` - Empezó inserción:  ${ getHora() } ` );
    
    await llenarTablaPruebas(10)
    
    console.log( ` - Terminó inserción: ${ getHora() } ` );

    await cliente.end();

    return ' ==== Proceso terminado ==== ';
}

main()
    .then( res => console.log(res) )
    .catch( err => console.log(` >>>>>>> Error ${err}`) );

/* [ FIN ] SCRIPT PARA POSTGRESQL */


