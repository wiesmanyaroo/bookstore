using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class Book
{
    public int Id { get; set; }

    [Required, StringLength(120)]
    public string Title { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int AuthorId { get; set; }

    public Author? Author { get; set; }

    [Range(1, int.MaxValue)]
    public int CategoryId { get; set; }

    [Range(typeof(decimal), "0.01", "100000")]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    [StringLength(17)]
    public string? Isbn { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}