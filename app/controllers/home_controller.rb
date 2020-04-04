require 'oauth'
require 'typhoeus'
require 'oauth/request_proxy/typhoeus_request'
require 'nokogiri'

class HomeController < ApplicationController

	def index
		@@client = OAuth::Consumer.new(ENV["GOODREADS_KEY"], ENV["GOODREADS_SECRET"], :site => 'https://www.goodreads.com')
		@@request_token = @@client.get_request_token
		params[:url] = @@request_token.authorize_url
	end

	def redirect
		@@access_token = @@request_token.get_access_token

		oauth_params = {:consumer => @@client, :token => @@access_token}
		req = Typhoeus::Request.new('https://www.goodreads.com/api/auth_user')
		oauth_helper = OAuth::Client::Helper.new(req, oauth_params.merge(:request_uri => 'https://www.goodreads.com/api/auth_user'))
		req.options[:headers].merge!({"Authorization" => oauth_helper.header}) # Signs the request
		req.run
		response = req.response
		@xml = Nokogiri::XML(response.body)
		goodreads_user_id = @xml.at_css("user")['id']

		@user = User.find_by(goodreads_user_id: goodreads_user_id)
		if @user.nil?
			display_name = @xml.at_css("name").text
			@user = User.create(goodreads_user_id: goodreads_user_id, display_name: display_name, 
				access_token: @@access_token.token, access_token_secret: @@access_token.secret)
		else
			@user.update(access_token:@@access_token.token, access_token_secret: @@access_token.secret)
		end

		sign_in(@user, scope: :user)
		redirect_to current_user

	end



	def about
	end

	private


	def user_params
		params.require(:user).permit(:goodreads_user_id, :display_name, :access_token, :access_token_secret)
	end

end
