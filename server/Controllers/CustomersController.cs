using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController(BookstoreContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers() => await context.Customers
        .Include(customer => customer.Orders)
        .AsNoTracking()
        .ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Customer>> GetCustomer(int id)
    {
        var customer = await context.Customers
            .Include(item => item.Orders)
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id);
        return customer is null ? NotFound() : customer;
    }

    [HttpPost]
    public async Task<ActionResult<Customer>> CreateCustomer(Customer customer)
    {
        context.Customers.Add(customer);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCustomer(int id, Customer customer)
    {
        if (id != customer.Id) return BadRequest("The route id must match the customer id.");
        context.Entry(customer).State = EntityState.Modified;
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        var customer = await context.Customers.FindAsync(id);
        if (customer is null) return NotFound();
        if (await context.Orders.AnyAsync(order => order.CustomerId == id))
            return Conflict("This customer has one or more orders.");
        context.Customers.Remove(customer);
        await context.SaveChangesAsync();
        return NoContent();
    }
}