.PHONY: all setup env start deps db down

all: setup

setup: env start deps db
	@echo [INFO] Stack provisioning complete.
	@echo [INFO] Client: http://localhost:3000 ^| Server: http://localhost:8000 ^| DB Admin: http://localhost:8080

env:
	@echo [INFO] Provisioning environment files
	@if not exist "server\.env" copy "server\.env.example" "server\.env"
	@if not exist "client\.env" copy "client\.env.example" "client\.env"

start:
	@echo [INFO] Building and starting containers...
	docker compose up -d --build
	@echo [INFO] Awaiting MySQL initialization (15s)
	@timeout /t 15 /nobreak

deps:
	@echo [INFO] Installing dependencies and configuring application
	docker compose exec server composer install --no-interaction
	docker compose exec server php artisan key:generate
	docker compose exec server php artisan jwt:secret
	docker compose exec server php artisan config:clear

db:
	@echo [INFO] Executing database migrations
	docker compose exec server php artisan migrate:fresh --force

down:
	@echo [INFO] Tearing down containers
	docker compose down