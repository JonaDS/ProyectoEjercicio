window.onload = MostrarListadoEjercicios();

function MostrarListadoEjercicios() {
    $.ajax({
        url: '../../EjerciciosFisicos/MostrarListadoEjercicios',
        data: {},
        type: 'POST',
        dataType: 'json',

        success: function (Ejercicios) {
            $("#ModalEjercicioFisico").modal("hide");
            LimpiarModal()
            let contenidoTabla = ``;

            $.each(Ejercicios, function (Index, Ejercicio) {

                console.log(Ejercicio);

                contenidoTabla += `
                <tr>
                    <td class="text-center">${Ejercicio.ejercicioNombre}</td>
                    <td class="text-center">${Ejercicio.inicioString}</td>
                    <td class="text-center">${Ejercicio.finString}</td>
                    <td class="text-center">${Ejercicio.estadoEmocionalInicio}</td>
                    <td class="text-center">${Ejercicio.estadoEmocionalFin}</td>
                    <td class="text-center">${Ejercicio.observaciones}</td>
                    <td class="text-center">
                    <button type="button" class="btn btn-primary shadow" onclick="AbrirModalEditar(${Ejercicio.ejercicioFisicoID})">
                    Editar
                    </button>
                    </td>
                    <td class="text-center">
                    <button type="button" class="btn btn-danger shadow" onclick="EliminarEjercicioFisico(${Ejercicio.ejercicioFisicoID})">
                    Eliminar
                    </button>
                    </td>
                </tr>
                `;
            });
            document.getElementById("tbody-ejerciciosfisicos").innerHTML = contenidoTabla;
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al cargar el listado');
        }
    });
}

function GuardadoEjerciciosFisicos() {
    let ejercicioFisicoID = document.getElementById("EjercicioFisicoID").value;
    let tipoEjercicioID = document.getElementById("TipoEjercicioID").value;
    let inicio = document.getElementById("FechaInicio").value;
    let fin = document.getElementById("FechaFin").value;
    let estadoEmocionalInicio = document.getElementById("EstadoEmocionalInicio").value;
    let estadoEmocionalFin = document.getElementById("EstadoEmocionalFin").value;
    let observaciones = document.getElementById("Observaciones").value;

    if (!tipoEjercicioID || !inicio || !fin || !estadoEmocionalInicio || !estadoEmocionalFin || !observaciones) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todos los campos son obligatorios. Por favor, complete todos los campos.'
        });
        return;
    }

    let fechaInicio = new Date(inicio);
    let fechaFin = new Date(fin);

    // Verificar si el horario de fin es posterior al horario de inicio
    if (fechaFin <= fechaInicio) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El Fin del ejercicio no puede ser posterior al inicio del mismo'
        });
        return;
    }
    
    $.ajax({
        url: '../../EjerciciosFisicos/GuardarEjerciciosFisicos',
        data: {
            ejercicioFisicoID: ejercicioFisicoID,
            tipoEjercicioID: tipoEjercicioID,
            inicio: inicio,
            fin: fin,
            estadoEmocionalInicio: estadoEmocionalInicio,
            estadoEmocionalFin: estadoEmocionalFin,
            observaciones: observaciones
        },
        type: 'POST',
        dataType: 'json',

        success: function (resultado) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El ejercicio físico se ha guardado correctamente.'
            }).then(() => {
                MostrarListadoEjercicios();
                $("#ModalEjercicioFisico").modal("hide");
            });
        },

        error: function (xhr, status) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al guardar el registro. Por favor, intente nuevamente.'
            });
        }
    });
}

function AbrirModalEditar(ejercicioFisicoID) {
    $.ajax({
        url: '../../EjerciciosFisicos/TraerListaEjercicios',
        data: { ejercicioFisicoID: ejercicioFisicoID },
        type: 'POST',
        dataType: 'json',

        success: function (EjercicioFisico) {
            let ejercicio = EjercicioFisico[0];
            document.getElementById("EjercicioFisicoID").value = ejercicioFisicoID;
            $("#ModalTitulo").text("Editar Ejercicio Físico");
            document.getElementById("TipoEjercicioID").value = ejercicio.tipoEjercicioID;
            document.getElementById("FechaInicio").value = ejercicio.inicio;
            document.getElementById("FechaFin").value = ejercicio.fin;
            document.getElementById("EstadoEmocionalInicio").value = ejercicio.estadoEmocionalInicio;
            document.getElementById("EstadoEmocionalFin").value = ejercicio.estadoEmocionalFin;
            document.getElementById("Observaciones").value = ejercicio.observaciones;

            $("#ModalEjercicioFisico").modal("show");
        },

        error: function (xhr, status) {
            console.log('Disculpe, existió un problema al consultar el registro para ser modificado.');
        }
    });
}

function EliminarEjercicioFisico(EjercicioFisicoID) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el ejercicio físico. ¿Deseas continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#228B22',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar',
   
    }).then((result) => {
        if (result.isConfirmed) {
            
            $.ajax({
                url: '../../EjerciciosFisicos/EliminarEjerciciosFisicos',
                data: { EjercicioFisicoID: EjercicioFisicoID },
                type: 'POST',
                dataType: 'json',
                success: function (resultado) {
                    Swal.fire('¡Eliminado!', 'El ejercicio físico ha sido eliminado.', 'success').then(() => {
                        MostrarListadoEjercicios();
                    });
                },
                error: function (xhr, status) {
                    console.log('Disculpe, existió un problema al eliminar el registro.');
                    Swal.fire('Error', 'Hubo un problema al intentar eliminar el ejercicio físico.', 'error');
                }
            });
        }
    });
}

function NuevoEjercicioFisico() {
    $("#ModalTitulo").text("Nuevo Ejercicio Fisico");
}

function LimpiarModal() {
    document.getElementById("EjercicioFisicoID").value = 0;
    document.getElementById("TipoEjercicioID").value = 0;
    document.getElementById("FechaInicio").value = "";
    document.getElementById("EstadoEmocionalInicio").value = 0;
    document.getElementById("FechaFin").value =  "";
    document.getElementById("EstadoEmocionalFin").value = 0;
    document.getElementById("Observaciones").value =  "";
}


