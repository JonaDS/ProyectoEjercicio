using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Proyecto6.Models;
using Proyecto6.Data;
using Microsoft.AspNetCore.Authorization;

namespace Proyecto6.Controllers;

[Authorize]
public class TipoEjerciciosController : Controller
{
    private ApplicationDbContext _context;

    //Constructor
    public TipoEjerciciosController(ApplicationDbContext context)
    {
        _context = context;
    }

    public ActionResult Index()
    {
        return View();
    }

    public JsonResult ListadoTipoEjercicios(int? id)
    {
        var tipoDeEjercicios = _context.TipoEjercicios.ToList();

        if (id != null)
        {
            tipoDeEjercicios = tipoDeEjercicios.Where(t => t.TipoEjercicioID == id).ToList();
        }

        return Json(tipoDeEjercicios);
    }

    public JsonResult GuardarTipoEjercicio(int tipoEjercicioID, string nombre)
    {
        string resultado = "";

        if (!String.IsNullOrEmpty(nombre))
        {
            nombre = nombre.ToUpper();

            if (tipoEjercicioID == 0)
            {
                var existeTipoEjericio = _context.TipoEjercicios.Where(t => t.Nombre == nombre).Count();
                if (existeTipoEjericio == 0)
                {
                    var tipoEjercicio = new TipoEjercicio
                    {
                        Nombre = nombre
                    };
                    _context.Add(tipoEjercicio);
                    _context.SaveChanges();
                }
                else
                {
                    resultado = "Ya existe un ejercicio con el mismo nombre";
                }
            }
            else
            {
                var tipoEjercicioEditar = _context.TipoEjercicios.Where(t => t.TipoEjercicioID == tipoEjercicioID).SingleOrDefault();
                if (tipoEjercicioEditar != null)
                {
                    var existeTipoEjercicio = _context.TipoEjercicios.Where(t => t.Nombre == nombre && t.TipoEjercicioID != tipoEjercicioID).Count();
                    if (existeTipoEjercicio == 0)
                    {
                        tipoEjercicioEditar.Nombre = nombre;
                        _context.SaveChanges();
                    }
                    else
                    {
                        resultado = "Ya existe un ejercicio con el mismo nombre";
                    }
                }
            }
        }
        else
        {
            resultado = "DEBE INGRESAR UNA DESCRIPCIÓN.";
        }

        return Json(resultado);
    }

    public JsonResult EliminarTipoEjercicio(int tipoEjercicioID)
    {
        var tipoEjercicio = _context.TipoEjercicios.Find(tipoEjercicioID);
        
        var ejerciciosFisicosAsociados = _context.EjerciciosFisicos.Any(e => e.TipoEjercicioID == tipoEjercicioID);

        if(ejerciciosFisicosAsociados)
        {
            return Json("No se puede eliminar este tipo de ejercicio porque esta asociado a un ejercicio fisico, elimine el ejercicio asociado primero");
        }
        _context.Remove(tipoEjercicio);
        _context.SaveChanges();

        return Json(true);
    }
}

