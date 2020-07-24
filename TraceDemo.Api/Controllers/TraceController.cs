using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RestSharp;

namespace TraceDemo.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TraceController : ControllerBase
    {
        [Route("weather")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<object>))]
        [Produces("application/json")]
        public async Task<IActionResult> Get(double lat, double lon)
        {
            // var result = await _mediator.Send(new GetAllTierCommand());
            //var client = new RestClient("https://api.openweathermap.org/data/2.5/");
            //var request = new RestRequest("onecall")
            //    .AddParameter("lat", lat)
            //    .AddParameter("lon", lon)
            //    //.AddParameter("exclude", null)
            //    .AddParameter("appid", "b001e24ecf2722223d18c77159f60bb0");
            //var response = await client.GetAsync<object>(request);

            var result = await new RestWrapper("https://api.openweathermap.org/data/2.5/")
                .Resource("onecall")
                .AddParam("lat", lat)
                .AddParam("lon", lon)
                .AddParam("appid", "b001e24ecf2722223d18c77159f60bb0")
                .GetAsync<object>();

            return Ok(result);
        }

        [Route("locate")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<object>))]
        [Produces("application/json")]
        public async Task<IActionResult> Locate(string ip)
        {
            // var result = await _mediator.Send(new GetAllTierCommand());
            // var client = new RestClient("http://api.ipstack.com/" + ip);
            //var client = new RestClient("http://ip-api.com/json/" + ip);
            //var request = new RestRequest()
            //    .AddParameter("access_key", "66a0f82b63ae8175ce47f03ab2052256");
            //var response = await client.GetAsync<object>(request);
            var result = await new RestWrapper("http://ip-api.com/json/" + ip)
                .AddParam("access_key", "66a0f82b63ae8175ce47f03ab2052256")
                .GetAsync<object>();

            return Ok(result);
        }

    }
}
