window.onload = ListadoTipoEjercicios();


function ListadoTipoEjercicios() {
    $.ajax({
        url: '../../TipoEjercicios/ListadoTipoEjercicios',
        data: {},
        type: 'POST',
        dataType: 'json',

        success: function (tipoDeEjercicios) {

            $("#ModalTipoEjercicio").modal("hide");
            LimpiarModal();

            let contenidoTabla = ``;

            $.each(tipoDeEjercicios, function (index, tipoDeEjercicio) {

                contenidoTabla += `
                <tr>
                    <td>${tipoDeEjercicio.nombre}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-primary shadow" onclick="AbrirModalEditar(${tipoDeEjercicio.tipoEjercicioID})">Editar</button> 
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger shadow" onclick="EliminarEjercicio(${tipoDeEjercicio.tipoEjercicioID})">Eliminar</button>
                    </td>
                </tr>
                `;
            });

            document.getElementById("tbody-tipoejercicios").innerHTML = contenidoTabla;
        },

        error: function (xhr, status) {
            alert('Disculpe, existió un problema al cargar el listado')
        }
    });
}


function LimpiarModal() {
    document.getElementById("TipoEjercicioID").value = 0;
    document.getElementById("nombre").value = "";
}


function NuevoEjercicio() {
    $("#ModalTitulo").text("Nuevo Tipo de Ejercicio");
}


function AbrirModalEditar(tipoEjercicioID) {
    $.ajax({
        url: '../../TipoEjercicios/ListadoTipoEjercicios',
        data: { id: tipoEjercicioID },
        type: 'POST',
        dataType: 'json',

        success: function (tipoDeEjercicios) {
            let tipoDeEjercicio = tipoDeEjercicios[0];

            document.getElementById("TipoEjercicioID").value = tipoEjercicioID;
            $("#ModalTitulo").text("Editar Tipo de Ejercicio");
            document.getElementById("nombre").value = tipoDeEjercicio.nombre;
            $("#ModalTipoEjercicio").modal("show");
        },

        error: function (xhr, status) {
            alert('Disculpe, existió un problema al consultar el ejercicio para ser modificado.')
        }
    });
}

function GuardarEjercicio() {
    let tipoEjercicioID = document.getElementById("TipoEjercicioID").value;
    let nombre = document.getElementById("nombre").value;

    // Verificar si el nombre está vacío
    if (tipoEjercicioID.trim() === "" || nombre.trim() === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese el nombre del tipo de ejercicio.'
        });
        return;
    }

    $.ajax({
        url: '../../TipoEjercicios/GuardarTipoEjercicio',
        data: { tipoEjercicioID: tipoEjercicioID, nombre: nombre },
        type: 'POST',
        dataType: 'json',

        success: function (resultado) {
            if (resultado !== "") {
                // Si el resultado indica que el ejercicio ya existe, mostrar alerta de error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El ejercicio ya existe.'
                });
            } else {
                // Si el resultado es vacío, mostrar alerta de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'El ejercicio se ha guardado correctamente.'
                });
                ListadoTipoEjercicios(); // Actualizar la lista de ejercicios después de guardar
            }
        },

        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Disculpe, existió un problema al guardar el ejercicio.'
            });
        }
    });
}


function EliminarEjercicio(tipoEjercicioID) {
    console.log(tipoEjercicioID); // Corregido: console.log en lugar de console.console.log
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '../../TipoEjercicios/EliminarTipoEjercicio',
                data: { tipoEjercicioID: tipoEjercicioID },
                type: 'POST',
                dataType: 'json',

                success: function (resultado) {
                    if (typeof resultado === 'string') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: resultado
                        });
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Eliminado',
                            text: 'El ejercicio ha sido eliminado correctamente'
                        });
                        ListadoTipoEjercicios();
                    }
                },

                error: function (xhr, status) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Disculpe, existió un problema al eliminar el ejercicio'
                    });
                }
            });
        }
    });
}