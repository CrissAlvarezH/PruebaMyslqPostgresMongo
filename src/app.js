
function getHora() {
    let date = new Date();
    
    return date.getHours() +":"+ date.getMinutes() +":"+ date.getSeconds() + ":" + date.getMilliseconds();
}

let bdParam = process.argv[2];
let accion = process.argv[3];

switch (bdParam) {
    case 'postgres':

        const { Client } = require('pg'); // requerimos postgresql

        // Creamos el cliente para la conexión con Postgres
        const cliente = new Client({
            user: 'prueba',
            host: 'localhost',
            database: 'prueba',
            password: 'prueba',
            port: 5432
        });

        // Ejecutamos la acción respectiva con la base de datos Postgress
        switch (accion) {
            case 'insertar':
                let cantidad = process.argv[4];
                let forma = process.argv[5];

                switch (forma) {
                    case 'secuencial':

                        let insercionPgSecuencial = async () => {
                            await cliente.connect();
                        
                            console.log( ` - Empezó inserción:  ${ getHora() } ` );
        
                            for ( let i = 0; i < cantidad; i++ ) {
                                await cliente.query("INSERT INTO prueba (texto1, texto2, texto3, texto4, texto5) VALUES ('texto1', 'texto2', 'texto3', 'texto4', 'texto5');");
                            }
                            
                            console.log( ` - Terminó inserción: ${ getHora() } ` );
        
                            await cliente.end();
                        
                            return ' ==== Proceso secuencial terminado ==== ';
                        }
                        
                        insercionPgSecuencial()
                            .then( res => console.log(res) )
                            .catch( err => console.log(` >>>>>>> Error ${err}`) );

                        break;
                    case 'concurrente':

                        let insercionPgConcurrente = async () => {
                            let procesosTerminados = 0;
                            let procesosTerminadosMal = 0;

                            await cliente.connect();
                        
                            console.log( ` - Empezó inserción:  ${ getHora() } ` );
        
                            for ( let i = 0; i < cantidad; i++ ) {
                                cliente.query("INSERT INTO prueba (texto1, texto2, texto3, texto4, texto5) VALUES ('texto1', 'texto2', 'texto3', 'texto4', 'texto5');")
                                    .then( resBd => {
                                        procesosTerminados++;

                                        if ( procesosTerminados == cantidad ) return console.log(` - Terminó el ultimo proceso con ${procesosTerminadosMal} fallas:  ${ getHora() }`);
                                    })
                                    .catch( errBd => {
                                        procesosTerminados++;
                                        procesosTerminadosMal++;

                                        if ( procesosTerminados == cantidad ) return console.log(` - Terminó el ultimo proceso con ${procesosTerminadosMal} fallas:  ${ getHora() }`);
                                    });
                            }
                                    
                            // await cliente.end();
                        
                            return ' ==== Proceso de lanzar inserciones asincronas terminado ==== ';
                        }
                        
                        insercionPgConcurrente()
                            .then( res => console.log(res) )
                            .catch( err => console.log(` >>>>>>> Error ${err}`) );

                        break;
                    default:
                        console.log(` ERROR: parametro ${forma} no soportado `);
                }

                break;

            case 'consultar':

                break;
            case 'limpiar':

                let limpiarBdPg = async () => {
                    await cliente.connect();

                    await cliente.query('DELETE FROM prueba');

                    await cliente.end();

                    return ' ==== Limpieza terminada ==== '
                }

                limpiarBdPg()
                    .then( res => console.log(res) )
                    .catch( err => console.log(` >>>>>>> Error ${err}`) );
                break;
            default:
                console.log(` ERROR: parametro ${accion} no soportado `);        
        }

        break;
    case 'mysql':

        switch (accion) {
            case 'insertar':

                break;
            case 'consultar':

                break;
            default:
                console.log(` ERROR: parametro ${accion} no soportado `);        
        }

        break;
    default:
        console.log(` ERROR: parametro ${bdParam} no soportado `);
}



