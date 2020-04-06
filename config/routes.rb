Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'users/sessions' }
  resources :users, :only => [:index, :show, :destroy, :edit, :update]
  resources :books, :only => [:update, :destroy]

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get 'shelves/update'
  get 'users/booklist/:id', to: 'users#booklist', as: 'user_books'
  get 'users/edit_profile/:id', to:'users#edit_profile', as: 'user_edit_profile'
  patch 'users/update_profile/:id', to: 'users#update_profile', as: 'user_update_profile'

  get 'home/redirect'
  root 'home#index'
end
