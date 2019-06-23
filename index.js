const express = require('express');
const app = express();
const port = 3000;
//import du fichier de configuration de mysql
const connection = require('./conf');
// Installation + import body-parser pour récupérer les données envoyées depuis le client en JSON et les stocker dans le body
//A placer IMPERATIVEMENT avant la 1ère route
const bodyParser = require('body-parser');
//support JSON-encoded bodies
app.use(bodyParser.json());
//support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

//Interrogation du serveur (écoute de l'url) pour Récupération et Renvoi au client de L'ENSEMBLE des données de la BDD travels
app.get("/travels/", (req, res) => {

  //Requête pour savoir si erreur, le descriptif  sera stockée dans la variable err, pour envoyer message au client et l'avertir. Si tout s'est bien passé, le résultat de la requête SQL sera stocké dans la variable results.
  connection.query("SELECT * from countries", (err, results) => {
    if (err) {
      //Si erreur survenue, on informe l'utilisateur de l'erreur
      res.status(500).send("Error when recovering travels");
    } else {
      //Si tout s'est bien passé, on envoie le résultat SQL en tant que Json.
    res.json(results);
    }
  });
});
//-----Récupération que des 'name' et 'comment'-----

app.get("/countries/name/comment", (req, res) => {
  connection.query("SELECT name, comment from countries", (err, results) => {
    if (err) {
      res.status(500).send("Error when recovering name");
    } else {
      res.json(results);
    }
  });
});

//----- Filtre pour récupérer dans 'comment'les lettres 'thin'-----

app.get("/countries/comment", (req, res) => {
  connection.query("SELECT comment from countries WHERE comment LIKE '%th%'", (err, results) => {
    if (err) {
      res.status(500).send("Error search, try again please !");
    } else {
      res.json(results);
    }
  });
});

//-----Filtre pour nom commençant par "S"-----
app.get("/countries/name", (req,res) => {
  connection.query("SELECT * from countries WHERE name LIKE 'S%'", (err, results) => {
    if (err) {
      res.status(500).send("Error search, please try again !");
    } else {
      res.json(results);
    }
  });
});

//-----Filtre pour récupérer date > à 2015 -----

app.get("/travels/countries", (req, res) => {
  connection.query("SELECT * from countries WHERE year > '2015'", (err, results) => {
    if (err) {
      res.status(500).send("Error search, try again please !");
    } else {
      res.json(results);
    }
  });
});

//Récupération de données ordonnées (ascendant) avec la méthode params (la route correspond à la requête envoyée)

app.get("/search/:order", (req, res) => {
  const name = req.params.order; 

  connection.query("SELECT * from countries ORDER BY name", (err, results) => {
    if (err) {
      res.status(500).send("Error search, try again please !");
    } else {
      res.sendStatus(200);
    }
  });
});

//----METHODE POST : envoyer des données d'un client à un serveur----

app.post("/countries", (req, res) => {
  // Données stockées dans req.body
  const formData = req.body;
  //Sauvegarde des données
  connection.query("INSERT INTO countries SET ?", formData, (err, results) => {
    //Envoi d'une réponse au client
    if (err) {
      //Si une erreur est intervenue on informe l'utillisateur de l'erreur
      console.log(err);
      res.status(500).send("Error when backing up countries");
    } else {
      //si tout s'est bien passé, on envoie un statut "ok"
      res.sendStatus(200);
    }
  });
});

//Méthode PUT pour réceptionner l'envoi des données, dans le but de les modifier dans la BDD

app.put("/countries/:id", (req, res) => {
  const idCountries = req.params.id;
  const formData = req.body;
  connection.query("UPDATE countries SET ? WHERE id = ?", [formData, idCountries], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Error when change id");
    } else {
      res.sendStatus(200);
    }
  });
});

app.put("/countries/toggle/:id", (req,res) => {
  const idCountries = req.params.id;
  const formData = req.body;
  connection.query("UPDATE countries SET visited = ? WHERE id = ?", [formData, idCountries], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Error when change visited");
    } else {
      res.sendStatus(200);
    }
  });
});

//----- METHODE DELETE : réceptionner une suppression depuis une requête client ( exemple une entité)-----

app.delete("/countries/:id", (req, res) => {
  const idCountries = req.params.id;
  connection.query("DELETE FROM countries WHERE id = ?", [idCountries], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Error delete");
    } else {
      res.sendStatus(200);
    }
  });
});

//DELETE : Suppression de toutes les entités dont le booléen est false----

app.delete("/countries/toggle/:visited", (req, res) => {
  const idCountries = req.params.id;
  connection.query("DELETE FROM countries WHERE visited = false", [idCountries], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Error delete");
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(port, err => {
  if (err) {
    throw new Error("Something bad happened ...");
  }
  console.log(`Serveur is listening on ${port}`);
});
