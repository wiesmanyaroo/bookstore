using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthorsController(BookstoreContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Author>>> GetAuthors() => await context.Authors.AsNoTracking().ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Author>> GetAuthor(int id)
    {
        var author = await context.Authors.FindAsync(id);
        return author is null ? NotFound() : author;
    }

    [HttpPost]
    public async Task<ActionResult<Author>> CreateAuthor(Author author)
    {
        context.Authors.Add(author);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAuthor), new { id = author.Id }, author);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAuthor(int id, Author author)
    {
        if (id != author.Id) return BadRequest("The route id must match the author id.");
        context.Entry(author).State = EntityState.Modified;
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAuthor(int id)
    {
        var author = await context.Authors.FindAsync(id);
        if (author is null) return NotFound();
        if (await context.Books.AnyAsync(book => book.AuthorId == id))
            return Conflict("This author is assigned to one or more books.");
        context.Authors.Remove(author);
        await context.SaveChangesAsync();
        return NoContent();
    }
}