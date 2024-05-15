using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Proyecto6.Models;

namespace Proyecto6.Models
{
    public class EjercicioFisico
    {
        [Key]
        public int EjercicioFisicoID { get; set; }
        public int TipoEjercicioID { get; set; }
        public DateTime Inicio { get; set; }
        public DateTime Fin { get; set; }
        public EstadoEmocional EstadoEmocionalInicio { get; set; }
        public EstadoEmocional EstadoEmocionalFin { get; set; }
        public string? Observaciones { get; set; }

        public virtual TipoEjercicio TipoEjercicio { get; set; }
    }

    public enum EstadoEmocional
    {
        Feliz = 1,
        Triste,
        Enojado,
        Ansioso,
        Estresado,
        Relajado,
        Aburrido,
        Emocionado,
        Agobiado,
        Confundido,
        Optimista,
        Pesimista,
        Motivado,
        Cansado,
        Eufórico,
        Agitado,
        Satisfecho,
        Desanimado
    }

    public class VistaSumaEjercicioFisico
    {
        public string? TipoEjercicioNombre { get; set; }
        public int TotalidadMinutos { get; set; }
        public int TotalidadDiasConEjercicio { get; set; }
        public int TotalidadDiasSinEjercicio { get; set; }

        public List<VistaEjercicioFisico>? DiasEjercicios { get; set; }
    }

    public class VistaEjercicioFisico
    {   
        public int EjercicioFisicoID { get; internal set; }
        public int TipoEjercicioID { get; internal set; }
        public string? EjercicioNombre { get; internal set; }
        public string InicioString { get; internal set; }
        public string FinString { get; internal set; }
        public string? EstadoEmocionalInicio { get; internal set; }
        public string? EstadoEmocionalFin { get; internal set; }
        public string? Observaciones { get; internal set; }
    }
}