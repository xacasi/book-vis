class UsersController < ApplicationController
	before_action :set_user, only: [:show, :edit, :update, :destroy, :booklist, :edit_profile, :update_profile]

	def index
		@users = User.all
	end

	def show
		read_books = @user.books.joins(:shelves).where("shelves.name = 'read'")
		@read_count = read_books.count
		@author_count = read_books.select(:author).distinct.count


		@read_books_date = read_books.joins(:book_dates).where("date_finished IS NOT NULL").order('date_finished DESC')
		@recently_read = @read_books_date.limit(10)
		seasonal_breakdown = read_books.joins(:book_dates).group_by_month(:date_finished).count
		seasonal_array = []
		seasonal_breakdown.each {|k,v| seasonal_array.push("date_finished": k,"read_count": v) }
		gon.seasonal = seasonal_array.to_json
		seasonal_breakdown_year = read_books.joins(:book_dates).group_by_year(:date_finished).count
		seasonal_array_year = []
		seasonal_breakdown_year.each {|k,v| seasonal_array_year.push("date_finished": k,"read_count": v) }
		gon.seasonal_year = seasonal_array_year.to_json

		@most_read_authors = @user.books.select("author, sum(read_count) as total_read_count").group("author")
			.having("sum(read_count) > 1")
			.order('total_read_count DESC')
			.limit(10)

		@most_read_books = @user.books.select("work_id, sum(read_count) as total_read_count")
			.group("work_id")
			.having("sum(read_count) > 1")
			.order('total_read_count DESC')
			.limit(10)
		@read_books = []
		@most_read_books.each do |book|
			work_title = Book.find_by(work_id: book.work_id)
			@read_books.push({"work_title": work_title.title, "total_read_count": book.total_read_count, "author": work_title.author})
		end

		@longest_books = @user.books.where("read_count > 0 AND num_pages > 0").order("num_pages DESC").limit(10)

		@formats_read = read_books.where.not(format: "")
			.select("format, sum(read_count) as total_read_count")
			.group("format")
			.order('total_read_count DESC')
			.limit(10)

		@publishing_breakdown = read_books.where.not(date_pub: nil)
			.select("date_part('year', date_pub) as year_pub, sum(read_count) as total_read_count")
			.group("year_pub")
			.order("year_pub").to_json
		gon.publishing_breakdown = @publishing_breakdown

		@taste = []
		@show_shelves = @user.shelves.where(show: true)
		@show_shelves.each do |shelf|
			dates = shelf.books.joins(:book_dates).group_by_year(:date_finished).count
			date_array = []
			dates.each {|k,v| @taste.push("shelf": shelf.name, "date_finished": k,"read_count": v) }
		end
		gon.taste = @taste.to_json

	end

	def booklist
		@books = @user.books.all
	end

	def edit

	end

	def update
		respond_to do |format|
			@user.avatar.attach(params[:avatar])
	      if @user.update(user_params)
	        format.html { redirect_to users_url notice: 'Account info updated.' }
	        format.json { render :index, status: :ok}
	      else
	        format.html { render :edit }
	        format.json { render json: @user.errors, status: :unprocessable_entity }
	      end
	    end
	end

	def edit_profile
	end

	def update_profile
		respond_to do |format|
		if @user.update(params[:user].permit(:id, shelves_attributes: [:id, :show]))
	        format.html { redirect_to user_path(@user), notice: 'Profile updated.' }
	        format.json { render :show, status: :ok}
	      else
	        format.html { render :edit_profile }
	        format.json { render json: @user.errors, status: :unprocessable_entity }
	      end
		end
	end

	def destroy
	    begin
	    	@user.destroy
	        redirect_to users_url notice: 'User was successfully destroyed.' 
       	rescue Exception => e
        	redirect_to users_url, notice: e 
    	end
  	end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit(:username, :last_name, :first_name, :avatar)
    end

end
