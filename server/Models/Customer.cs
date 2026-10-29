using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class Customer
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [StringLength(30)]
    public string? Phone { get; set; }

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}