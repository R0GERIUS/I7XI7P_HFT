using AKFAC0_HFT_2021222.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;

namespace I7XI7P_SZTGUI_2022232.WpfClient.Services
{
    public class BasicResponse
    {
        public string Key { get; set; }
        public double Value { get; set; }
    }
    public class CustomRestService : RestService
    {
        HttpClient client;

        public CustomRestService(string baseurl, string pingableEndpoint = "swagger") : base(baseurl, pingableEndpoint)
        {
            bool isOk = false;
            do
            {
                isOk = Ping(baseurl + pingableEndpoint);
            } while (isOk == false);
            Init(baseurl);
        }

        private bool Ping(string url)
        {
            try
            {
                WebClient wc = new WebClient();
                wc.DownloadData(url);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private void Init(string baseurl)
        {
            client = new HttpClient();
            client.BaseAddress = new Uri(baseurl);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue
                ("application/json"));
            try
            {
                client.GetAsync("").GetAwaiter().GetResult();
            }
            catch (HttpRequestException)
            {
                throw new ArgumentException("Endpoint is not available!");
            }

        }

        public List<Armor> GetAllJobArmors(string jobId, string endpoint = "armor")
        {
            List<Armor> result = new List<Armor>();
            HttpResponseMessage response = client.GetAsync(endpoint + "/GetAllJobArmors/" + jobId).GetAwaiter().GetResult();
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsAsync<List<Armor>>().GetAwaiter().GetResult();
            }
            else
            {
                var error = response.Content.ReadAsAsync<RestExceptionInfo>().GetAwaiter().GetResult();
                throw new ArgumentException(error.Msg);
            }
            return result;
        }

        public int GetAverageDefenceByClass(string classId, string endpoint = "armor")
        {
            int result = 0;
            HttpResponseMessage response = client.GetAsync(endpoint + "/GetAverageDefenceByClass/" + classId).GetAwaiter().GetResult();
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsAsync<int>().GetAwaiter().GetResult();
            }
            else
            {
                var error = response.Content.ReadAsAsync<RestExceptionInfo>().GetAwaiter().GetResult();
                throw new ArgumentException(error.Msg);
            }
            return result;
        }

        public double GetAverageDefence(string endpoint = "armor")
        {
            List<BasicResponse> result = new List<BasicResponse>();
            HttpResponseMessage response = client.GetAsync(endpoint + "/GetAverageDefence").GetAwaiter().GetResult();
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsAsync<List<BasicResponse>>().GetAwaiter().GetResult();
            }
            else
            {
                var error = response.Content.ReadAsAsync<RestExceptionInfo>().GetAwaiter().GetResult();
                throw new ArgumentException(error.Msg);
            }
            return result[0].Value;
        }

        public List<Job> GetAllJobsByRole(string roleId, string endpoint = "job")
        {
            List<Job> result = new List<Job>();
            HttpResponseMessage response = client.GetAsync(endpoint + "/GetAllJobsByRole/" + roleId).GetAwaiter().GetResult();
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsAsync<List<Job>>().GetAwaiter().GetResult();
            }
            else
            {
                var error = response.Content.ReadAsAsync<RestExceptionInfo>().GetAwaiter().GetResult();
                throw new ArgumentException(error.Msg);
            }
            return result;
        }

        public List<Weapon> GetAllWeaponByRole(string roleId, string endpoint = "job")
        {
            List<Weapon> result = new List<Weapon>();
            HttpResponseMessage response = client.GetAsync(endpoint + "/GetAllWeaponByRole/" + roleId).GetAwaiter().GetResult();
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsAsync<List<Weapon>>().GetAwaiter().GetResult();
            }
            else
            {
                var error = response.Content.ReadAsAsync<RestExceptionInfo>().GetAwaiter().GetResult();
                throw new ArgumentException(error.Msg);
            }
            return result;
        }

        public List<Weapon> GetAllWeaponByRoleMinimumDmg(string roleId, int minDmg, string endpoint = "job")
        {
            List<Weapon> result = new List<Weapon>();
            HttpResponseMessage response = client.GetAsync(endpoint + "/GetAllWeaponByRoleMinimumDmg/" + roleId + "/" + minDmg).GetAwaiter().GetResult();
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsAsync<List<Weapon>>().GetAwaiter().GetResult();
            }
            else
            {
                var error = response.Content.ReadAsAsync<RestExceptionInfo>().GetAwaiter().GetResult();
                throw new ArgumentException(error.Msg);
            }
            return result;
        }

        public Weapon GetHighestDMGWeaponByGivenRole(string roleId, string endpoint = "job")
        {
            List<Weapon> result = new List<Weapon>();
            HttpResponseMessage response = client.GetAsync(endpoint + "/GetHighestDMGWeaponGivenRole/" + roleId).GetAwaiter().GetResult();
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsAsync<List<Weapon>>().GetAwaiter().GetResult();
            }
            else
            {
                var error = response.Content.ReadAsAsync<RestExceptionInfo>().GetAwaiter().GetResult();
                throw new ArgumentException(error.Msg);
            }
            return result[0];
        }

        public List<Weapon> GetAllJobWeapons(string jobId, string endpoint = "weapon")
        {
            List<Weapon> result = new List<Weapon>();
            HttpResponseMessage response = client.GetAsync(endpoint + "/GetAllJobWeapons/" + jobId).GetAwaiter().GetResult();
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsAsync<List<Weapon>>().GetAwaiter().GetResult();
            }
            else
            {
                var error = response.Content.ReadAsAsync<RestExceptionInfo>().GetAwaiter().GetResult();
                throw new ArgumentException(error.Msg);
            }
            return result;
        }

        public double GetAverageDamageByJob(string jobId, string endpoint = "weapon")
        {
            double result = 0;
            HttpResponseMessage response = client.GetAsync(endpoint + "/GetAverageDamageByJob/" + jobId).GetAwaiter().GetResult();
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsAsync<int>().GetAwaiter().GetResult();
            }
            else
            {
                var error = response.Content.ReadAsAsync<RestExceptionInfo>().GetAwaiter().GetResult();
                throw new ArgumentException(error.Msg);
            }
            return result;
        }

        public double GetAverageDamage(string endpoint = "weapon")
        {
            List<BasicResponse> result = new List<BasicResponse>();
            HttpResponseMessage response = client.GetAsync(endpoint + "/GetAverageDamage").GetAwaiter().GetResult();
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsAsync<List<BasicResponse>>().GetAwaiter().GetResult();
            }
            else
            {
                var error = response.Content.ReadAsAsync<RestExceptionInfo>().GetAwaiter().GetResult();
                throw new ArgumentException(error.Msg);
            }
            return result[0].Value;
        }
    }
}
