
function getHora() {
    let date = new Date();
    
    return date.getHours() +":"+ date.getMinutes() +":"+ date.getSeconds() + ":" + date.getMilliseconds();
}


let bdParam = process.argv[2];
let accion = process.argv[3];

switch (bdParam) {
    case 'postgres':

        // CONECTAMOS POSTGRES
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
                            let tiempoInicio = new Date().getTime();
        
                            for ( let i = 0; i < cantidad; i++ ) {
                                await cliente.query("INSERT INTO prueba (texto1, texto2, texto3, texto4, texto5) VALUES ('texto1', 'texto2', 'texto3', 'texto4', 'texto5');");
                            }
                            
                            let tiempoFin = new Date().getTime();
                            console.log( ` - Terminó inserción: ${ getHora() } ` );
        
                            await cliente.end();
                        
                            return ` ==== Proceso secuencial terminado ==== ${ tiempoFin - tiempoInicio } ms `;
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
                        console.log(` ERROR: parametro ${forma} no soportado. \nComandos aceptador: secuencial, concurrente. `);
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
            console.log(` ERROR: parametro ${accion} no soportado. \nComandos aceptados: insertar, consultar, limpiar. `);     
        }

        break;
    case 'mysql':
        // CONECTAMOS MYSQL
        var mysql = require('mysql');

        var conMysql = mysql.createConnection({
            host: 'localhost',
            user: 'siprem',
            password: 'brGpBBxBZH9DGzys',
            database: 'prueba'
        });

        let query = (sql) => {
            return new Promise( (resolve, reject) => {
                conMysql.query(sql, (err, res) => {
                    if( err ) return reject(err);
    
                    resolve(res);
                });
            });
        }

        switch (accion) {
            case 'insertar':
                let cantidad = process.argv[4];
                let forma = process.argv[5];

                switch (forma) {
                    case 'secuencial':
                        let insertarSecuencial = async () => {
                            conMysql.connect();

                            console.log( ` - Empezó inserción:  ${ getHora() } ` );
                            let tiempoInicio = new Date().getTime();

                            for( let i = 0; i < cantidad; i++ ){
                                await query("INSERT INTO prueba (texto1, texto2, texto3, texto4, texto5) VALUES ('texto1', 'texto2', 'texto3', 'texto4', 'texto5');");
                            }

                            let tiempoFin = new Date().getTime();
                            console.log( ` - Terminó inserción: ${ getHora() } ` );

                            conMysql.end();

                            return ` ====== Terminó proceso ===== ${ tiempoFin - tiempoInicio } ms`;
                        }

                        insertarSecuencial()
                            .then( res => console.log(res) )
                            .catch( err => console.log(' Error: ', err) );

                        break;
                    case 'concurrente':

                        break;
                    default:
                        console.log(` ERROR: parametro ${forma} no soportado. \nComandos aceptador: secuencial, concurrente. `);
                }

                break;
            case 'consultar':

                break;
            case 'limpiar':

                let limpiarBdMysql = async () => {
                    conMysql.connect();

                    await query("DELETE FROM prueba;");

                    conMysql.end();

                    return ' ==== Limpieza terminada ==== '
                }

                limpiarBdMysql()
                    .then( res => console.log(res) )
                    .catch( err => console.log(` >>>>>>> Error ${err}`) );

                break;
            default:
                console.log(` ERROR: parametro ${accion} no soportado. \nComandos aceptados: insertar, consultar, limpiar. `);        
        }

        break;
    default:
        console.log(` ERROR: parametro ${bdParam} no soportado. \nComandos aceptados: mysql, postgres. `);
}



