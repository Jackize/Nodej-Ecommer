# Nodej-Ecommer
## Running with Docker Compose

To run the application using Docker Compose, follow these steps:

1. Ensure you have Docker and Docker Compose installed on your machine.
2. Navigate to the project directory:
    ```sh
    cd /D:/Project/Nodej-Ecommer
    ```
3. Build and start the containers:
    ```sh
    docker-compose up --build
    ```
4. Open your browser and go to `http://localhost:8081` login with `admin` and `pass` to check the admin panel.

5. Open your browser and go to `http://localhost:3001` to check the website.

To stop the containers, press `Ctrl+C` in the terminal where Docker Compose is running, then run:
```sh
docker-compose down
```