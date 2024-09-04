const BookInfo = ({book}) => {
  return (
    <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">
      <div className="my-4">
        <span className="text-xl mr-4 text-gray-500">Id</span>
        <span>{book._id}</span>
      </div>
      <div className="my-4">
        <span className="text-xl mr-4 text-gray-500">Title</span>
        <span>{book.title}</span>
      </div>
      <div className="my-4">
        <span className="text-xl mr-4 text-gray-500">Author</span>
        <span>{book.author}</span>
      </div>
      <div className="my-4">
        <span className="text-xl mr-4 text-gray-500">Publish Year</span>
        <span>{book.publishYear}</span>
      </div>
      <div className="my-4">
        <span className="text-xl mr-4 text-gray-500">Create Time</span>
        <span>{new Date(book.createdAt).toString()}</span>
      </div>
      <div className="my-4">
        <span className="text-xl mr-4 text-gray-500">Last Update Time</span>
        <span>{new Date(book.updatedAt).toString()}</span>
      </div>
    </div>
  );
};

export default BookInfo;
