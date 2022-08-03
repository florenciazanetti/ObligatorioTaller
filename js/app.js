const apiUrl = 'https://crypto.develotion.com';


async function cargando(message) {
    const loading = await loadingController.create({
        message: message,
    });
    return await loading;
}

async function presentAlert(header, sub_header, message) {
    const alert = document.createElement('ion-alert');
    alert.header = header;
    alert.subHeader = sub_header;
    alert.message = message;
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    await alert.present();
}
function getParam(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function mostrarDatos(datos) {
    alert(datos.apikey);
    loscalStorage.setItem('apikey', datos.apikey);
}
// function mostrarDatos2 (){
//     const url = apiUrl + '/monedas.php';
//     fetch(url, {
//         headers: {
//             "apikey": `${datos.apikey}`,
//             "Content-type": "application/json"
//         }
//     })
//     .then(respuesta => (respuesta.ok)?respuesta.json():respuesta.json().then(data => Promise.reject(data.error)))
//     .then(data => listarMonedas(data))
//     .catch(mensaje => display_toast(mensaje, 'Info', 'primary'))
// }
function display_toast(mensaje, header, color) {
    const toast = document.createElement('ion-toast');
    toast.header = header;
    (toast.icon = 'information-circle'), (toast.position = 'top');
    toast.message = mensaje;
    toast.duration = 3000;
    toast.color = color;
    document.body.appendChild(toast);
    toast.present();
}


function login(data, router) {

    sessionStorage.setItem('apikey', data.apiKey);
    sessionStorage.setItem('usuario', JSON.stringify(data.id));
    router.push('/monedas');
}

document.addEventListener('DOMContentLoaded', function () {
    let router = document.querySelector('ion-router');
    router.addEventListener('ionRouteDidChange', function (e) {
        let nav = e.detail;
        let paginas = document.getElementsByTagName('ion-page');
        for (let i = 0; i < paginas.length; i++) {
            paginas[i].style.visibility = 'hidden';
        }
        let ion_route = document.querySelectorAll(`[url="${nav.to}"]`);
        let id_pagina = ion_route[0].getAttribute('component');
        let pagina = document.getElementById(id_pagina);
        pagina.style.visibility = 'visible';

        if (nav.to == '/monedas') {
            listarMonedas();
        }
        if (nav.to == '/moneda') {
            crearListadoMonedas();
        }
        if (nav.to == '/usuarios') {
            listar_usuarios();
        }
        if (nav.to == '/usuario') {
            info_usuario();
        }
        if (nav.to == '/transferir') {
            moneda();
        }
        if (nav.to == '/transacciones') {
            listarTransacciones();
        }
    });

    function listarMonedas() {
        cargando('Cargando monedas...').then((loading) => {
            loading.present();
            let apikey = sessionStorage.getItem("apikey");
            const url = apiUrl + '/monedas.php';
            fetch(url, {
                headers: {
                    "apikey": `${apikey}`,
                    "Content-type": "application/json"
                }
            }).then(respuesta => respuesta.json())
                .then(data => crearListadoMonedas(data.monedas))
                .catch(error => display_toast(error, 'Info', 'primary'))
                .finally(() => loading.dismiss());
        });
    }


    function crearListadoMonedas(monedas) {

        let lista = document.getElementById('listaMonedas'); //es de tipo html element
        let item = '';                                       // es un string 
        for (let i = 0; i < monedas.length; i++) {           //monedas array dentro de data
            let moneda = monedas[i];
            item = `<ion-item href="/monedas?id=${moneda._id}" detail>
             <ion-avatar slot="start">
               <img src="https://crypto.develotion.com/imgs/${moneda.imagen}" />
             </ion-avatar>
             <ion-label>
               <h2>${moneda.nombre}</h2>
               <h3>${moneda.cotizacion}</h3>
             </ion-label>
           </ion-item>`;
            lista.innerHTML += item;
        }

    }

    //---------------------------------- TRANSFERIR --------------------------------------------------------------// 


    function moneda() { //mi idea aca era que cuando clikeas la moneda, te lleve a querer hacer la transferencia. 
        //por eso luego supuse una funcion "transferir" lo cual no se como continuar.

        const monedaId = getParam('id');
        const url = `https://crypto.develotion.com/monedas.php${monedaId}`;
        let apikey = sessionStorage.getItem("apikey");
        fetch(url, {
            headers: {
                "apikey": `${apikey}`,
                "Content-type": "application/json"
            }
        }).then(respuesta => respuesta.json())
            .then(id => tansferir(id))
    }


    document.getElementById('btnTransferir').onclick = function transferir() {


        const cantidadUnidades = document.getElementById('txtCantidadUnidades').value;

    }

    //--------------------------------------------------------------------------------------------------------------//



    //----------------------------------- TRANSACCIONES -----------------------------------------------------------//


    function listarTransacciones() {
        cargando('Cargando transacciones...').then((loading) => {
            loading.present();
            const idUsuario = getParam('idUsuario');
            const url = `https://crypto.develotion.com/transacciones.php?=${idUsuario}`;
            let apikey = sessionStorage.getItem("apikey");
            fetch(url, {
                headers: {
                    "apikey": `${apikey}`,
                    "Content-type": "application/json"
                }
            }).then(respuesta => respuesta.json())
                .then(data => crearListadoTransacciones(data.monedas))
                .catch(error => display_toast(error, 'Info', 'primary'))
                .finally(() => loading.dismiss());
        });
    }


    function crearListadoTransacciones(transacciones) {

        let lista = document.getElementById('listaTransacciones'); 
        let item = '';                                      
        for (let i = 0; i < transacciones.length; i++) {          
            let transaccion = transacciones[i];
            item = `<ion-item href="/transacciones?id=${transaccion._id}" detail>
             <ion-avatar slot="start">
               <img src="https://crypto.develotion.com/imgs/${transaccion.imagen}" />
             </ion-avatar>
             <ion-label>                      
               <h2>${transaccion.moneda}</h2>  
               <h3>${transaccion.tipo}</h3>
               <h3>${transaccion.cantidad}</h3>
               <h3>${transaccion.valor}</h3>
             </ion-label>
           </ion-item>`;
            lista.innerHTML += item;
        }                           

    }
    
    //--------------------------------------------------------------------------------------------------------------//



    //   window.onload = function mostrarListado(){
    //     const apikey = sessionStorage.getItem("apiKey");
    //       const url = 'https://crypto.develotion.com/monedas.php';
    //       fetch(url, {
    //           headers:{
    //              "Content-type":"application/json",
    //              "apikey": `${apikey}` //ARREGLAR SEGUN LA API
    //           }

    //       }).then(respuesta => (respuesta.ok)?respuesta.json():respuesta.json().then(data => Promise.reject(data.mensaje)))
    //       .then(data => listarMonedas(data))
    //       .catch(mensaje => alert(mensaje))
    //   }


    document.getElementById('btnRegistro').onclick = function () {
        try {
            const usuario = document.getElementById('txtUsuario2').value;
            const password = document.getElementById('txtPassword2').value;
            const departamento = document.getElementById('txtDepartamento').value;
            const ciudad = document.getElementById('txtCiudad').value;

            if (!usuario) {
                throw 'Usuario requerido para continuar';
            }
            if (!password) {
                throw 'Contraseña requerida para continuar';
            }
            if (!departamento) {
                throw 'Departamento requerido para continuar';
            }
            if (!ciudad) {
                throw 'Ciudad requerida para continuar';
            }

            const url = apiUrl + '/usuarios.php';
            const datos = {
                usuario: usuario,
                password: password,
                departamento: departamento,
                ciudad: ciudad,
            };
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(datos),
                headers: {
                    'Content-type': 'application/json',
                },
            })
                .then((respuesta) =>
                    respuesta.ok
                        ? respuesta.json()
                        : respuesta.json().then((data) => Promise.reject(data.error))
                )
                .then((data) => router.push('/'))
                .catch((mensaje) => display_toast(mensaje, 'Info', 'primary'));
        } catch (e) {
            display_toast(e, 'Info', 'primary');
        }
    };

    document.getElementById('btnLogin').onclick = function () {
        const usuario = document.getElementById('txtUsuario').value;
        const password = document.getElementById('txtPassword').value;
        try {
            if (!usuario) {
                throw 'Usuario requerido';
            }
            if (!password) {
                throw 'Contraseña requerida';
            }
            const url = apiUrl + '/login.php';
            const datos = {
                usuario: usuario,
                password: password,
            };
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(datos),
                headers: {
                    'Content-type': 'application/json',
                },
            })
                .then((respuesta) =>
                    respuesta.ok
                        ? respuesta.json()
                        : respuesta.json().then((data) => Promise.reject(data.error))
                )
                .then((data) => login(data, router))
                .catch((mensaje) => display_toast(mensaje, 'Info', 'primary'));
        } catch (e) {
            display_toast(e, 'Info', 'primary');
        }
    };


});
