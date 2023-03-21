using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ListaTareasPendientes.Models;
using System.Threading;
using Microsoft.IdentityModel.Tokens;

namespace ListaTareasPendientes.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TareaController : ControllerBase
    {
        private readonly DbpruebasContext _dbcontext;

        public TareaController(DbpruebasContext context)
        {
            _dbcontext= context;
        }

        [HttpGet]
        [Route("Lista")]
        public async Task<IActionResult> Lista()
        {
            List<Tarea> lista = _dbcontext.Tareas.OrderByDescending(t => t.IdTarea).ThenBy(t => t.FechaRegistro).ToList();

            return StatusCode(StatusCodes.Status200OK, lista);
        }

        [HttpPost]
        [Route("Guardar")]
        public async Task<IActionResult> Guardar([FromBody] Tarea request)
        {
            if (request.Descripcion != null && request.Descripcion != "")
            {
                await _dbcontext.Tareas.AddAsync(request);
                await _dbcontext.SaveChangesAsync();
                return StatusCode(StatusCodes.Status200OK, "Ok");
            }
            else
            {
                return StatusCode(StatusCodes.Status404NotFound, "NotFound");
            }

        }

        [HttpDelete]
        [Route("Cerrar/{id:int}")]
        public async Task<IActionResult> Cerrar(int id)
        {
            Tarea? tarea = _dbcontext.Tareas.Find(id);

            if(tarea != null)
            {
                _dbcontext.Tareas.Remove(tarea);
                await _dbcontext.SaveChangesAsync();
                return StatusCode(StatusCodes.Status200OK, "Ok");
            }
            else
            {
                return StatusCode(StatusCodes.Status404NotFound, "NotFound");
            }
        }
    }
}
