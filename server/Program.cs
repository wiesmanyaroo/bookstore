using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Bookstore") ?? "Data Source=bookstore.db"));
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var database = scope.ServiceProvider.GetRequiredService<BookstoreContext>();
    database.Database.EnsureCreated();
    database.Database.ExecuteSqlRaw("""
        CREATE TABLE IF NOT EXISTS "Orders" (
            "Id" INTEGER NOT NULL CONSTRAINT "PK_Orders" PRIMARY KEY AUTOINCREMENT,
            "CustomerId" INTEGER NOT NULL,
            "BookId" INTEGER NOT NULL,
            "Quantity" INTEGER NOT NULL,
            "OrderDate" TEXT NOT NULL,
            CONSTRAINT "FK_Orders_Customers_CustomerId" FOREIGN KEY ("CustomerId") REFERENCES "Customers" ("Id") ON DELETE RESTRICT,
            CONSTRAINT "FK_Orders_Books_BookId" FOREIGN KEY ("BookId") REFERENCES "Books" ("Id") ON DELETE RESTRICT
        );
        CREATE INDEX IF NOT EXISTS "IX_Orders_CustomerId" ON "Orders" ("CustomerId");
        CREATE INDEX IF NOT EXISTS "IX_Orders_BookId" ON "Orders" ("BookId");
        """);

    if (!database.Authors.Any())
    {
        var authors = new[]
        {
            new Author { FullName = "Ursula K. Le Guin", Biography = "Author of imaginative and thoughtful fiction." },
            new Author { FullName = "James Baldwin", Biography = "Essayist and novelist exploring identity and society." },
            new Author { FullName = "Octavia E. Butler", Biography = "Award-winning science fiction author." },
            new Author { FullName = "Mary Oliver", Biography = "Poet known for her attention to the natural world." }
        };
        var categories = new[]
        {
            new Category { Name = "Fiction", Description = "Novels and short stories." },
            new Category { Name = "Essays", Description = "Personal, cultural, and critical writing." },
            new Category { Name = "Science Fiction", Description = "Speculative worlds and futures." },
            new Category { Name = "Poetry", Description = "Collected poems and verse." }
        };

        database.Authors.AddRange(authors);
        database.Categories.AddRange(categories);
        database.SaveChanges();
        database.Books.AddRange(
            new Book { Title = "The Left Hand of Darkness", AuthorId = authors[0].Id, CategoryId = categories[2].Id, Price = 16.00m, Stock = 12, Isbn = "9780441007318" },
            new Book { Title = "Giovanni's Room", AuthorId = authors[1].Id, CategoryId = categories[0].Id, Price = 14.50m, Stock = 8, Isbn = "9780345806567" },
            new Book { Title = "Kindred", AuthorId = authors[2].Id, CategoryId = categories[2].Id, Price = 15.00m, Stock = 10, Isbn = "9780807083697" },
            new Book { Title = "Devotions", AuthorId = authors[3].Id, CategoryId = categories[3].Id, Price = 18.00m, Stock = 6, Isbn = "9780399563249" });
        database.Customers.AddRange(
            new Customer { FullName = "Avery Morgan", Email = "avery@example.com", Phone = "555-0101" },
            new Customer { FullName = "Jordan Lee", Email = "jordan@example.com", Phone = "555-0102" });
        database.SaveChanges();
    }

    if (!database.Orders.Any() && database.Customers.Any() && database.Books.Any())
    {
        database.Orders.Add(new Order
        {
            CustomerId = database.Customers.OrderBy(customer => customer.Id).First().Id,
            BookId = database.Books.OrderBy(book => book.Id).First().Id,
            Quantity = 1
        });
        database.SaveChanges();
    }
}

app.Run();
