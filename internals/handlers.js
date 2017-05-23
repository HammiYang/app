var staticServer = require("./static-server");
// Cargando una librería que
// permita parsear la información
// de formularios
var querystring = require('querystring');

// Archivo que contiene todos los manejadores correspondientes
// al API de mi aplicación
var author = {
    "name": "Fannny Palacios",
    "departament": "Computer and Systems",
    "university": "TecNM - ITGAM"
};

// Declaración de manejadores
var getAuthorInfo = function (req, res) {
    // Estableciendo el mime apropiado
    // para dar a conocer al navegador
    // que enviará un json
    res.writeHead(200, {
        "Content-Type": "application/json"
    });

    // Serializar la respuesta
    var jsonResponse = JSON.stringify(author);
    res.end(jsonResponse);
}

var getServerName = function (req, res) {
    res.end('<body background="../img/server.jpg"> <h1 align="center">'+
                                '<font color="green">'+'Servidor Halcones Peregrinos'+'</font>'+
                                '</h1> </body>');
}

var getPostRoot = function(req,res){
    // Viendo el tipo de peticion
    if(req.method === "POST"){  
        // Procesar el formulario
        var postData = "";
        // Create a listener
        // event driven programming
        // Creando un listener ante
        // la llegada de datos
        req.on("data", function(dataChunk){
            postData += dataChunk;
            // Agregando seguridad al asunto
            if(postData.length > 1e6){
                // Destruyendo la conexion
                console.log("> Actividad maliciosa detectada por parte de un cliente D:<");
                req.connection.destroy();
            }
        });

        // Registrando otro listener ante un cierre de conexión
        req.on("end", function(){
            // Rescatar los datos recibidos
            // del cliente
            console.log(`> Data Received: ${postData}`.data);
            var data = querystring.parse(postData);

            // Replicar los datos recibidos
            res.writeHead(200,{
                'Content-Type':'text/html'
            });

            // Respondiendo con una replica de los 
            // datos recibidos
            res.write("<h1>Datos Recibidos</h1>");
            res.write("<h2>Datos crudos</h2>");
            res.write(`<p>Datos sin parsear: ${postData}</p>`);
            res.write("<h2>Datos como objeto</h2>");
            res.write(`<p>${JSON.stringify(data)}</p>`);
            res.write("<h2>Datos parseados</h2>");
            res.write('<ul>');
            for(var key in data){
                if(data.hasOwnProperty(key)){
                    res.write(
                        `<li>${key.toString().toUpperCase()} : ${data[key]}</li>`
                    );
                }
            }
            // Cierro la ul y la conexion
            res.end('</ul>');
        });
    }else{
        // Se sirve el index.html
        console.log("> Se solicita raiz con GET".red)
        staticServer.serve(req,res);
    }
}
 

// Obteniendo la fecha del servidor
 var getServerTime = function (req, res) {
        var d = new Date(),
            horas= d.getHours(),
            minutos= d.getMinutes(),
            segundos= d.getSeconds();
            hora=`${horas}:${minutos}:${segundos}`;
        console.log("Respondiendo Nombre del servidor...\n");
        if(horas>=0 && horas< 12){  
                                                          
                            res.end(
                                '<body background="../img/manana.jpg"> <h1 align="center">'+
                                '<font color="green">'+
                                `> ¡Hola!, la hora actual del server es: ${hora}`+'</font>'+
                                '</h1> </body>');   
                               }
        if(horas>=12 && horas< 18){
                                res.end(
                                '<body background="../img/tarde.jpg"> <h1 align="center">'+
                                '<font color="cyan">'+
                                ` ¡Hola!, la hora actual del server es: ${hora}`+'</font>'+
                                '</h1> </body>');
                               }
        if(horas>=18 && horas<24){
                                
                                res.end(
                                '<header id="main-header">'+
                                '<body background="../img/noche.jpg"> <h1 align="center">'+
                                '<font color="yellow">'+
                                ` ¡Hola!, la hora actual del server es: ${hora}`+'</font>'+
                                '</h1> </body>');
                                }
    }
// Exportando manejadores 
var handlers = {};
handlers["/"] = getPostRoot;
handlers["/getauthorinfo"] = getAuthorInfo;
handlers["/getservername"] = getServerName;
handlers["/getservertime"] = getServerTime;
module.exports = handlers;