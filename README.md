# README

Bookvis is a Ruby on Rails application that generates a data visualization of all your logged books in goodreads. 

### How It Works

  - Authorize Goodreads: When you log in, the app sends an oauth request to the goodreads api for authorizing requests to the site. It gets your goodreads user info and registers you as a user to the bookvis database.
  - Generate Data Visualization: When you click the generate report button found in your profile, the app crawls for information on all books found in all your shelves, saves it to the app's database, then generates charts based on the data. 

### Tech

Bookvis uses a number of open source projects to work properly:

* [Ruby on Rails] - MVC web framework for Ruby
* [PostgreSQL] - database
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [d3.js] - library for data visualization
* [popper.js] - for tooltips
* [jQuery] - javascript library

### Installation

Bookvis requires [Ruby on Rails] v6.0.2.2+  and Ruby v2.6.3 to run.
* Goodreads developer key  
Generate your developer key and secret in [Goodreads](https://www.goodreads.com/api/keys) and fill in the callback url details with http://localhost:3000/home/redirect. Create a .rb file in config/initializers with the following information:
```sh
ENV["GOODREADS_KEY"] =  "Your Goodreads Key"
ENV["GOODREADS_SECRET"] = "Your Goodreads Secret"
```

* Deployment instructions

Install the gems.

```sh
$ cd bookvis
$ bundle install
```
* Database setup

Bookvis uses PostgreSQL v10.12. 
Switch to postgres user and create a role, then update  config/database.yml with your database username and password. 
```sh
su - postgres
create role bookvis with createdb login password 'password1';
```

* Run the server.
```sh
rails s
```



### Todos

 - Add pages option to charts
 - Include option to filter all charts by date

License
----

MIT


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [Ruby on Rails]: <https://rubyonrails.org/>
   [popper.js]: <https://popper.js.org/>
   [d3.js]: <https://d3js.org/>
   [PostgreSQL]: <https://www.postgresql.org/>