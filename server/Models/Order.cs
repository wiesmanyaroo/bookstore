using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace server.Models;

public class Order
{
    public int Id { get; set; }

    [Range(1, int.MaxValue)]
    public int CustomerId { get; set; }

    [JsonIgnore]
    public Customer? Customer { get; set; }

    [Range(1, int.MaxValue)]
    public int BookId { get; set; }

    [JsonIgnore]
    public Book? Book { get; set; }

    [Range(1, 1000)]
    public int Quantity { get; set; } = 1;

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
}