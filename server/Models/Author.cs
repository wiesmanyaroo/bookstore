using System.ComponentModel.DataAnnotations;

namespace server.Models;

public class Author
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Biography { get; set; }

    [System.Text.Json.Serialization.JsonIgnore]
    public ICollection<Book> Books { get; set; } = new List<Book>();
}