import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  const fiction = await prisma.genre.create({
    data: { name: 'Fiction' },
  });

  const technology = await prisma.genre.create({
    data: { name: 'Technology' },
  });

  const history = await prisma.genre.create({
    data: { name: 'History' },
  });

  const science = await prisma.genre.create({
    data: { name: 'Science' },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@library.com',
      name: 'Head Librarian',
      role: 'LIBRARIAN',
    },
  });

  const patron = await prisma.user.create({
    data: {
      email: 'patron@library.com',
      name: 'John Reader',
      role: 'PATRON',
    },
  });

  const books = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publishedYear: 1925, genreId: fiction.id },
    { title: '1984', author: 'George Orwell', publishedYear: 1949, genreId: fiction.id },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', publishedYear: 1960, genreId: fiction.id },
    { title: 'Pride and Prejudice', author: 'Jane Austen', publishedYear: 1813, genreId: fiction.id },
    { title: 'Clean Code', author: 'Robert C. Martin', publishedYear: 2008, genreId: technology.id },
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', publishedYear: 1999, genreId: technology.id },
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', publishedYear: 2017, genreId: technology.id },
    { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', publishedYear: 2008, genreId: technology.id },
    { title: 'Sapiens', author: 'Yuval Noah Harari', publishedYear: 2011, genreId: history.id },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', publishedYear: 1997, genreId: history.id },
    { title: 'A Brief History of Time', author: 'Stephen Hawking', publishedYear: 1988, genreId: science.id },
    { title: 'Cosmos', author: 'Carl Sagan', publishedYear: 1980, genreId: science.id },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', publishedYear: 1976, genreId: science.id },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', publishedYear: 1937, genreId: fiction.id },
    { title: 'Fahrenheit 451', author: 'Ray Bradbury', publishedYear: 1953, genreId: fiction.id },
    { title: 'Dune', author: 'Frank Herbert', publishedYear: 1965, genreId: fiction.id },
  ];

  for (const bookData of books) {
    const book = await prisma.book.create({ data: bookData });
    
    await prisma.review.create({
      data: {
        rating: 5,
        comment: 'An absolute masterpiece.',
        bookId: book.id,
        userId: patron.id,
      },
    });
  }

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });