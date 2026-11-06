import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();

  const fiction = await prisma.genre.create({
    data: { name: 'Fiction', description: 'Imaginative storytelling and novels.' },
  });

  const technology = await prisma.genre.create({
    data: { name: 'Technology', description: 'Books on software, engineering, and IT.' },
  });

  const history = await prisma.genre.create({
    data: { name: 'History', description: 'Non-fiction historical records and analyses.' },
  });

  const science = await prisma.genre.create({
    data: { name: 'Science', description: 'Scientific discoveries, physics, and nature.' },
  });

  const booksData = [
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', publishedYear: 1960, isbn: '978-0043350030', genreId: fiction.id },
    { title: '1984', author: 'George Orwell', publishedYear: 1949, isbn: '978-0451524935', genreId: fiction.id },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publishedYear: 1925, isbn: '978-0743273565', genreId: fiction.id },
    { title: 'Pride and Prejudice', author: 'Jane Austen', publishedYear: 1813, isbn: '978-0141439518', genreId: fiction.id },
    { title: 'Clean Code', author: 'Robert C. Martin', publishedYear: 2008, isbn: '978-0132350884', genreId: technology.id },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', publishedYear: 1999, isbn: '978-0201616224', genreId: technology.id },
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', publishedYear: 2017, isbn: '978-1449373328', genreId: technology.id },
    { title: 'Refactoring', author: 'Martin Fowler', publishedYear: 2018, isbn: '978-0134757599', genreId: technology.id },
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', publishedYear: 2014, isbn: '978-0062316097', genreId: history.id },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', publishedYear: 1997, isbn: '978-0393317558', genreId: history.id },
    { title: 'A Short History of Nearly Everything', author: 'Bill Bryson', publishedYear: 2003, isbn: '978-0385660044', genreId: history.id },
    { title: 'The Silk Roads', author: 'Peter Frankopan', publishedYear: 2015, isbn: '978-1408839997', genreId: history.id },
    { title: 'A Brief History of Time', author: 'Stephen Hawking', publishedYear: 1988, isbn: '978-0553380163', genreId: science.id },
    { title: 'Cosmos', author: 'Carl Sagan', publishedYear: 1980, isbn: '978-0345539434', genreId: science.id },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', publishedYear: 1976, isbn: '978-0199291151', genreId: science.id },
    { title: 'Astrophysics for People in a Hurry', author: 'Neil deGrasse Tyson', publishedYear: 2017, isbn: '978-0393609393', genreId: science.id },
  ];

  for (const book of booksData) {
    await prisma.book.create({ data: book });
  }

  console.log(`✅ Seeding complete! Successfully added 4 genres and ${booksData.length} books.`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
