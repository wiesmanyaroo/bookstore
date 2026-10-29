using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController(BookstoreContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders() => await context.Orders.AsNoTracking().ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var order = await context.Orders.FindAsync(id);
        return order is null ? NotFound() : order;
    }

    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(Order order)
    {
        if (!await context.Customers.AnyAsync(customer => customer.Id == order.CustomerId) ||
            !await context.Books.AnyAsync(book => book.Id == order.BookId))
        {
            return BadRequest("Choose an existing customer and book.");
        }

        context.Orders.Add(order);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateOrder(int id, Order order)
    {
        if (id != order.Id) return BadRequest("The route id must match the order id.");
        if (!await context.Customers.AnyAsync(customer => customer.Id == order.CustomerId) ||
            !await context.Books.AnyAsync(book => book.Id == order.BookId))
        {
            return BadRequest("Choose an existing customer and book.");
        }

        context.Entry(order).State = EntityState.Modified;
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var order = await context.Orders.FindAsync(id);
        if (order is null) return NotFound();
        context.Orders.Remove(order);
        await context.SaveChangesAsync();
        return NoContent();
    }
}