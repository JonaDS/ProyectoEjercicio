using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Proyecto6.Models;
using Proyecto6.Data;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Proyecto6.Controllers;    

[Authorize]
public class EjerciciosFisicosController : Controller
{
    private ApplicationDbContext _context;
    public EjerciciosFisicosController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        // Crear una lista de SelectListItem que incluya el elemento adicional
        var selectListItems = new List<SelectListItem>
        {
            new SelectListItem { Value = "0", Text = "[SELECCIONE...]" }
        };

        // Obtener todas las opciones del enum
        var enumValues = Enum.GetValues(typeof(EstadoEmocional)).Cast<EstadoEmocional>();

        // Convertir las opciones del enum en SelectListItem
        selectListItems.AddRange(enumValues.Select(e => new SelectListItem
        {
            Value = e.GetHashCode().ToString(),
            Text = e.ToString().ToUpper()
        }));

        // Pasar la lista de opciones al modelo de la vista
        ViewBag.EstadoEmocionalInicio = selectListItems.OrderBy(t => t.Text).ToList();
        ViewBag.EstadoEmocionalFin = selectListItems.OrderBy(t => t.Text).ToList();

        var tipoEjercicios = _context.TipoEjercicios.ToList();
        tipoEjercicios.Add(new TipoEjercicio { TipoEjercicioID = 0, Nombre = "[SELECCIONE...]" });
        ViewBag.TipoEjercicioID = new SelectList(tipoEjercicios.OrderBy(c => c.Nombre), "TipoEjercicioID", "Nombre");

        return View();
    }

    public JsonResult MostrarListadoEjercicios(int? id)
    {
        List<VistaEjercicioFisico> MostrarEjercicios = new List<VistaEjercicioFisico>();

        var ejerciciosFisicos = _context.EjerciciosFisicos.ToList();
        if (id != null)
        {
            ejerciciosFisicos = ejerciciosFisicos.Where(e => e.EjercicioFisicoID == id).ToList();
        }

        var Ejercicio = _context.TipoEjercicios.ToList();

        foreach (var ejercicioFisico in ejerciciosFisicos)
        {
            var ejercicio = Ejercicio.Where(e => e.TipoEjercicioID == ejercicioFisico.TipoEjercicioID).Single();

            var mostrarEjercicios = new VistaEjercicioFisico
            {
                EjercicioFisicoID = ejercicioFisico.EjercicioFisicoID,
                TipoEjercicioID = ejercicioFisico.TipoEjercicioID,
                EjercicioNombre = ejercicio.Nombre,
                InicioString = ejercicioFisico.Inicio.ToString("dd/MM/yyyy HH:mm"),
                FinString = ejercicioFisico.Fin.ToString("dd/MM/yyyy HH:mm"),
                EstadoEmocionalInicio = Enum.GetName(typeof(EstadoEmocional), ejercicioFisico.EstadoEmocionalInicio),
                EstadoEmocionalFin = Enum.GetName(typeof(EstadoEmocional), ejercicioFisico.EstadoEmocionalFin),
                Observaciones = ejercicioFisico.Observaciones
            };
            MostrarEjercicios.Add(mostrarEjercicios);
        }

        return Json(MostrarEjercicios);
    }

public JsonResult GuardarEjerciciosFisicos(int EjercicioFisicoID, int TipoEjercicioID, DateTime Inicio, DateTime Fin, EstadoEmocional EstadoEmocionalInicio, EstadoEmocional EstadoEmocionalFin, string Observaciones)
{
    string resultado = "";

    if (Fin <= Inicio)
    {
        resultado = "El fin no debe ser posterior al inicio.";
    }
    else
    {
        if (EjercicioFisicoID == 0)
        {
            var EjercicioFisico = new EjercicioFisico
            {
                EjercicioFisicoID = EjercicioFisicoID,
                TipoEjercicioID = TipoEjercicioID,
                Inicio = Inicio,
                Fin = Fin,
                EstadoEmocionalInicio = EstadoEmocionalInicio,
                EstadoEmocionalFin = EstadoEmocionalFin,
                Observaciones = Observaciones
            };
            _context.Add(EjercicioFisico);
            _context.SaveChanges();

            resultado = "Ejercicio físico guardado correctamente";
        }
        else
        {
            var ejercicioFisicoEditar = _context.EjerciciosFisicos.Find(EjercicioFisicoID);
            if (ejercicioFisicoEditar != null)
            {
                ejercicioFisicoEditar.TipoEjercicioID = TipoEjercicioID;
                ejercicioFisicoEditar.Inicio = Inicio;
                ejercicioFisicoEditar.Fin = Fin;
                ejercicioFisicoEditar.EstadoEmocionalInicio = EstadoEmocionalInicio;
                ejercicioFisicoEditar.EstadoEmocionalFin = EstadoEmocionalFin;
                ejercicioFisicoEditar.Observaciones = Observaciones;
                _context.SaveChanges();

                resultado = "Ejercicio físico actualizado correctamente";
            }
        }
    }
    
    return Json(resultado);
}
   
    public JsonResult TraerListaEjercicios(int? EjercicioFisicoID)
    {
        var EjerciciosFisicos = _context.EjerciciosFisicos.ToList();

        if(EjercicioFisicoID != null)
        {
            EjerciciosFisicos = EjerciciosFisicos.Where(e => e.EjercicioFisicoID == EjercicioFisicoID).ToList();
        }

        return Json(EjerciciosFisicos.ToList());
    }

    public JsonResult EliminarEjerciciosFisicos( int EjercicioFisicoID){
        var EjercicioFisico = _context.EjerciciosFisicos.Find(EjercicioFisicoID);
        _context.Remove(EjercicioFisico);
        _context.SaveChanges();

        return Json(true);
    }
}
