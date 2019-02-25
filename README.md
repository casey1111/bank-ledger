## Bank Ledger

This repo is a combination of 3 applications:

1. REST API: Spring Boot application providing a RESTful API for a simplified banking ledger.
2. ReactJS client app: Web Application using ReactJS and Reactstrap which provides a web front-end for the REST api.
3. NodeJS console app: A console application, using NodeJS to be run from a terminal command line window, which provides a terminal front-end for the REST api.

#### Notes

- These applications have only been tested on Windows 10 and Google Chrome
- The ReactJS client app is bundled with the REST API
- The ReactJS build will install Node and Yarn in a subfolder during the first launch of the Maven spring-boot:run goal
- Account information is stored in a temporary memory cache which will be wiped after restarting REST API

#### Prerequisites

- Java 8 is installed
- Maven is installed

#### Running REST API

- Open a command-line window and navigate to project root
- Run command:   mvn spring-boot:run
- Console will display "Started LedgerApplication in xxx.xxx seconds (JVM running for 22.545)" when API is running.

#### Running Web Application

- Navigate to "http://localhost:8080" in a web browser

#### Running Console Application

- Ensure that REST API is running and listening on localhost:8080
- Open a new command window and navigate to project root
- Run command:  run-console.cmd
- Hit "Ctrl-C" to exit application

