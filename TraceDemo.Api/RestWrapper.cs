using RestSharp;
using System.Threading.Tasks;

namespace TraceDemo.Api
{
    public class RestWrapper
    {
        private readonly RestClient _client;
        private RestRequest _request;

        public RestWrapper(string baseUrl)
        {
            _client = new RestClient(baseUrl);
        }

        public RestWrapper Resource(string resource = "")
        {
            _request = new RestRequest(resource);
            return this;
        }

        public RestWrapper AddParam(string key, object val)
        {
            _request.AddParameter(key, val);
            return this;
        }

        public Task<T> GetAsync<T>()
        {
            return _client.GetAsync<T>(_request ?? new RestRequest());
        }
    }
}
