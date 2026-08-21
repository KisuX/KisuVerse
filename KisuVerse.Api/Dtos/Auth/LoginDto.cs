using System.ComponentModel.DataAnnotations;

namespace KisuVerse.Api.Dtos.Auth;

public class LoginDto
{
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}


// "Token": eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ1c2VyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzg1ODYxNjczLCJpc3MiOiJLaXN1VmVyc2UuQXBpIiwiYXVkIjoiS2lzdVZlcnNlLkNsaWVudCJ9.56nAcwc_gJrKh372fjuHNbf31GBGM3V22yN_h8NL7rE

// {
//   "Email": "user@example.com",
//   "Password": "Kisu.1234"
// }


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ1c2VyMkBleGFtcGxlLmNvbSIsImV4cCI6MTc4NTg2NDcxOSwiaXNzIjoiS2lzdVZlcnNlLkFwaSIsImF1ZCI6Iktpc3VWZXJzZS5DbGllbnQifQ.IMdalwGyi0DswLaGU0pLjsSevgCxkiDsYNbX9bpV6DM