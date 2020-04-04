class ShelvesController < ApplicationController

	def update

		current_user.shelves.destroy_all
		#get shelves
		url = 'https://www.goodreads.com/shelf/list.xml?key=' +ENV["GOODREADS_KEY"] + '&user_id=' + current_user.goodreads_user_id.to_s
		req = Typhoeus::Request.new(url)
		req.run
		response = req.response
		@xml = Nokogiri::XML(response.body)
		@xml.css("user_shelf").each do |shelf| 
			shelf_name = shelf.css('name').text
			current_user.shelves.create(name: shelf_name)
		end

		current_user.books.destroy_all
		
		client = OAuth::Consumer.new(ENV["GOODREADS_KEY"], ENV["GOODREADS_SECRET"], :site => 'https://www.goodreads.com')
		access_token = OAuth::Token.new(current_user.access_token, current_user.access_token_secret)
		oauth_params = {:consumer => client, :token => access_token}

		#get books from shelves
		req = Typhoeus::Request.new('https://www.goodreads.com/review/list', params: {id: current_user.goodreads_user_id, per_page: 100})
		oauth_helper = OAuth::Client::Helper.new(req, oauth_params.merge(:request_uri => 'https://www.goodreads.com/review/list'))
		req.options[:headers].merge!({"Authorization" => oauth_helper.header})
		req.run
		response = req.response
		@html = Nokogiri::HTML(response.body)
		pages = Integer(@html.css("div#reviewPagination a")[-2].text)

		#now make a request per page then add the books in the database
		hydra = Typhoeus::Hydra.new
		for i in 1..pages
			req =Typhoeus::Request.new('https://www.goodreads.com/review/list', params: {id: current_user.goodreads_user_id, per_page: 100, page: i})
			oauth_helper = OAuth::Client::Helper.new(req, oauth_params.merge(:request_uri => 'https://www.goodreads.com/review/list'))
			req.options[:headers].merge!({"Authorization" => oauth_helper.header})
			req.on_complete do |response|
				html_books = Nokogiri::HTML(response.body)
				#per review
				html_books.css("tr.bookalike.review").each do |review|
					goodreads_id = Integer(review.css("div.stars")[0]["data-resource-id"])
					existing = current_user.books.exists?(goodreads_id: goodreads_id)

					if existing 

					else
						title = review.css("td.field.title a")[0]["title"]
						author = review.css("td.field.author a").text.strip
						rating = review.css("div.stars")[0]["data-rating"]
						bookformat = review.css("td.field.format div.value").text.strip.chomp("[edit]").strip
						read_count = parse_to_int(review.css("td.field.read_count div.value").text.strip)
						num_pages = parse_to_int(review.css("td.field.num_pages div.value").text.strip[0..-3].strip)

						shelves = []
						review.css("td.field.shelves span a").each do |shelf|
							found_shelf = current_user.shelves.find_by(name: shelf.text)
							shelves.push(found_shelf) #separate shelves
						end
						date_started = []
						date_finished = []
						review.css("td.field.date_started span").each do |started|
							date_started.push(parse_to_date(started.text))
						end
						review.css("td.field.date_read span").each do |finished|
							date_finished.push(parse_to_date(finished.text))
						end
						
						date_pub = review.css("td.field.date_pub div.value").text.strip
						if (date_pub == "unknown")
							date_pub = review.css("td.field.date_pub_edition div.value").text.strip
						end
						date_pub = parse_to_date(date_pub)

						#api call to get work id
						book_to_work_id_req =Typhoeus.get('https://www.goodreads.com/book/id_to_work_id/' + goodreads_id.to_s + '?key=' + ENV["GOODREADS_KEY"])
						book_to_work_id = Nokogiri::XML(book_to_work_id_req.body) 
						work_id = book_to_work_id.css("item").text

						#create book
						puts "Exists? " + existing.to_s
						book = current_user.books.create(title: title, author: author, goodreads_id: goodreads_id, work_id: Integer(work_id), 
							rating: rating, format: bookformat, read_count: read_count, num_pages: num_pages, date_pub: date_pub) 
						#join books to shelves
						book.shelves << shelves
						#add the dates read
						for i in 0..(date_finished.length - 1)
							if !(date_started[i].nil? && date_finished[i].nil?)
								BookDate.create(book_id: book.id, date_started: date_started[i], date_finished: date_finished[i])
							end
						end
					end

				end
				
			end
			hydra.queue(req)
			hydra.run
			
		end

		redirect_to current_user
	end

	private def parse_to_int(int_string)
		begin
			parsed = Integer(int_string.delete(","))
		rescue Exception => e
			parsed = nil
		end

		return parsed
	end

	private def parse_to_date(date_string)
		if (date_string == "not set" || date_string == "unknown")
			date_parsed = nil
		else
			begin
				date_parsed = Date.parse(date_string)
			rescue Exception => e
				begin
					date_parsed = Date.strptime(date_string, "%Y")
				rescue
					puts 'error with ' + date_string
				end
			end
		end

		return date_parsed
	end


end
