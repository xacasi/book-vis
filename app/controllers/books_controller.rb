class BooksController < ApplicationController

	def destroy
		@book = Book.find(params[:id])
	    begin
	      @book.destroy
	      redirect_back(fallback_location: root_path, notice: "Book deleted")
	      #redirect_to user_books_path(@user), notice: "Book deleted"
       	rescue Exception => e
       		redirect_back(fallback_location: root_path, notice: e)#"Book cannot be deleted."
    	end
  	end

end
