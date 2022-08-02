const apiUrl = 'https://crypto.develotion.com';


async function cargando(message) {
    const loading = await loadingController.create({
        message: message,
    });
    return await loading;
}

function mostrarDatos(datos) {
    alert(datos.apikey);
    loscalStorage.setItem('token', datos.apikey);
}

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
    sessionStorage.setItem('apikey', data.apikey);
    sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
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
                .then(data => crearListadoMonedas(data))
                .catch(error => display_toast(error, 'Info', 'primary'))
                .finally(() => loading.dismiss());
        });
    }


     function crearListadoMonedas(data){
         let usuario = sessionStorage.getItem("usuario");
         usuario = JSON.parse(usuario);
         document.getElementById('listaMonedasHeader').innerHTML = `Hola <strong>${usuario}</strong>!`;
         //console.log(data);
         let lista = document.getElementById('listaMonedas');
         let item = '';
         data.forEach(function(monedas){
             item = `<ion-item href="/monedas?id=${monedas.id}" detail>
             <ion-avatar slot="start">
               <img src="${monedas.imagen}" />
             </ion-avatar>
             <ion-label>
               <h2>${monedas.nombre}</h2>
               <h3>${monedas.cotizacion}</h3>
             </ion-label>
           </ion-item>`;
           lista.innerHTML += item;
         });
     }
    
    
    //  window.onload = function mostrarListado(){
    //      let apikey = sessionStorage.getItem("apikey");
    //      const url = 'https://crypto.develotion.com/monedas.php';
    //      fetch(url, {
    //          headers:{
    //              "Content-type":"application/json",
    //              "apikey": `${apikey}` //ARREGLAR SEGUN LA API
    //          }
    //      }).then(respuesta => (respuesta.ok)?respuesta.json():respuesta.json().then(data => Promise.reject(data.mensaje)))
    //      .then(data => listarLocales(data))
    //      .catch(mensaje => alert(mensaje))
    //  }

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
