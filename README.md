# Paper & Pine Bookstore

A small full-stack bookstore project with a React client and an ASP.NET Core Web API. The API uses Entity Framework Core with SQLite and binds requests directly to model classes; there are no DTOs.

## Project structure

- `client/` - React + Vite inventory interface
- `server/` - ASP.NET Core 9 Web API
- `server/bookstore.db` - SQLite database created automatically when the API starts

## Database tables

- `Books` - title, author, category, price, stock, ISBN
- `Authors` - full name, biography
- `Categories` - name, description
- `Customers` - full name, email, phone
- `Orders` - customer, book, quantity, order date

## Client structure

- `client/src/App.jsx` coordinates the selected resource and CRUD events.
- `client/src/api/bookstoreApi.js` owns HTTP requests and converts form values to API models.
- `client/src/config/resources.js` describes resource names, fields, and table columns.
- `client/src/components/` contains the sidebar, records table, and reusable record form.
- `client/src/utils/formatRecordValue.js` formats relationship values for display.

Each table has list, details, create, update, and delete endpoints. Books belong to authors and categories. Customers can have many orders, and each order records a book and quantity. Referenced authors, categories, customers, and books cannot be deleted until their related records are removed.

| Resource | Endpoint |
| --- | --- |
| Books | `/api/books` |
| Authors | `/api/authors` |
| Categories | `/api/categories` |
| Customers | `/api/customers` |
| Orders | `/api/orders` |

Use `GET /api/{resource}`, `GET /api/{resource}/{id}`, `POST /api/{resource}`, `PUT /api/{resource}/{id}`, and `DELETE /api/{resource}/{id}`. POST and PUT accept the matching model as JSON.

## Run locally

Prerequisites: .NET 9 SDK and Node.js with npm.

Start the API in one terminal:

```powershell
cd bookstore\server
dotnet run
```

Start the React client in another terminal:

```powershell
cd bookstore\client
npm install
npm run dev
```

Open the Vite URL shown in the client terminal (normally `http://localhost:5173`). Vite forwards `/api` requests to the API at `http://localhost:5176`.

On first startup, the API creates the SQLite database and adds sample books, authors, categories, customers, and an order. To reset the sample data, stop the API, delete `server/bookstore.db`, and start it again.