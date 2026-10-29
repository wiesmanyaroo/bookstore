using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController(BookstoreContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks() => await context.Books
        .Include(book => book.Author)
        .AsNoTracking()
        .ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Book>> GetBook(int id)
    {
        var book = await context.Books.Include(item => item.Author).FirstOrDefaultAsync(item => item.Id == id);
        return book is null ? NotFound() : book;
    }

    [HttpPost]
    public async Task<ActionResult<Book>> CreateBook(Book book)
    {
        if (!await context.Authors.AnyAsync(author => author.Id == book.AuthorId) ||
            !await context.Categories.AnyAsync(category => category.Id == book.CategoryId))
        {
            return BadRequest("Choose an existing author and category.");
        }

        context.Books.Add(book);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateBook(int id, Book book)
    {
        if (id != book.Id) return BadRequest("The route id must match the book id.");
        if (!await context.Authors.AnyAsync(author => author.Id == book.AuthorId) ||
            !await context.Categories.AnyAsync(category => category.Id == book.CategoryId))
        {
            return BadRequest("Choose an existing author and category.");
        }

        context.Entry(book).State = EntityState.Modified;
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await context.Books.FindAsync(id);
        if (book is null) return NotFound();
        if (await context.Orders.AnyAsync(order => order.BookId == id))
            return Conflict("This book is included in one or more orders.");
        context.Books.Remove(book);
        await context.SaveChangesAsync();
        return NoContent();
    }
}