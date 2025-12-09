using Stripe;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace BackEnd_TecnoShop.Controllers
{
    public class PagosController : ApiController
    {
        public PagosController()
        {
            StripeConfiguration.ApiKey = ConfigurationManager.AppSettings["StripeSecretKey"];
        }
        // GET: api/Pagos
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Pagos/5
        public string Get(int id)
        {
            return "value";
        }

        [HttpPost]
        [Route("api/pagos/crear")]
        public IHttpActionResult CrearPago([FromBody] PagoRequest request)
        {
            try
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)(request.Monto * 100),
                    Currency = "mxn",
                    PaymentMethodTypes = new List<string> { "card" }
                };

                var service = new PaymentIntentService();
                var paymentIntent = service.Create(options);

                return Ok(new
                {
                    clientSecret = paymentIntent.ClientSecret,
                    paymentId = paymentIntent.Id
                });
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Pagos/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Pagos/5
        public void Delete(int id)
        {
        }
        public class PagoRequest
        {
            public decimal Monto { get; set; }
        }
    }
}
