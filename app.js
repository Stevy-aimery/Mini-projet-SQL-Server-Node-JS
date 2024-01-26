const express = require("express");
const sql = require("mssql/msnodesqlv8");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//----------- Chaine de connexion -------- //
const config = {
  server: "STEVY_KABA\\SQLEXPRESS",
  database: "USINE",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

sql
  .connect(config)
  .then(() => {
    console.log("Connected to SQL Server");
  })
  .catch((err) => {
    console.error("Error connecting to SQL Server:", err);
  });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//----------- CLIENTE -------- //
// Route pour ajouter un Client
app.post("/addClient", (req, res) => {
  const { clientName, clientAdr, clientVille } = req.body;

  if (!clientName || !clientAdr || !clientVille) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  const query =
    "INSERT INTO Cliente(NomCli, AdrCli, VilleCli) VALUES (@clientName, @clientAdr, @clientVille)";
  const request = new sql.Request();
  request.input("clientName", sql.VarChar, clientName);
  request.input("clientAdr", sql.VarChar, clientAdr);
  request.input("clientVille", sql.VarChar, clientVille);

  request
    .query(query)
    .then((result) => {
      res.json({ message: "Client ajouté avec succès" });
    })
    .catch((err) => {
      console.error("Erreur lors de l'ajout du Client:", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

// Route pour récupérer tous les Clients
app.get("/getclients", (req, res) => {
  const query = "SELECT * FROM Cliente";
  const request = new sql.Request();

  request
    .query(query)
    .then((results) => {
      res.json(results.recordset);
    })
    .catch((err) => {
      console.error("Erreur lors de la récupération des Clients:", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

// Route pour supprimer un Client
app.delete("/deleteclient/:IDCli", (req, res) => {
  const clientId = req.params.IDCli;

  const query = "DELETE FROM Cliente WHERE IDCli = @clientId";
  const request = new sql.Request();
  request.input("clientId", sql.Int, clientId);

  request
    .query(query)
    .then((result) => {
      res.json({ message: "Client supprimé avec succès" });
    })
    .catch((err) => {
      console.error("Erreur lors de la suppression du Client:", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

// Route pour éditer un Client
app.put("/editclient/:IDCli", (req, res) => {
  const clientId = req.params.IDCli;
  const { clientName, clientAdr, clientVille } = req.body;

  if (!clientName || !clientAdr || !clientVille) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  const query =
    "UPDATE Cliente SET NomCli = @clientName , AdrCli = @clientAdr, VilleCli = @clientVille  WHERE IDCli = @clientId";
  const request = new sql.Request();
  request.input("clientName", sql.VarChar, clientName);
  request.input("clientAdr", sql.VarChar, clientAdr);
  request.input("clientVille", sql.VarChar, clientVille);
  request.input("clientId", sql.Int, clientId);

  request
    .query(query)
    .then((result) => {
      res.json({ message: "Client modifié avec succès" });
    })
    .catch((err) => {
      console.error("Erreur lors de la modification du Client:", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

//----------- CATEGORIE & PIECE -------- //

// Route pour ajouter une catégorie
app.post("/addCategorie", (req, res) => {
  const { categorieLib, categorieTarif } = req.body;

  if (!categorieLib || !categorieTarif) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  const query =
    "INSERT INTO Categorie(libCat, TarifMO) VALUES (@categorieLib, @categorieTarif)";
  const request = new sql.Request();
  request.input("categorieLib", sql.VarChar, categorieLib);
  request.input("categorieTarif", sql.Decimal, categorieTarif);

  request
    .query(query)
    .then((result) => {
      res.json({ message: "Catégorie ajoutée avec succès" });
    })
    .catch((err) => {
      console.error("Erreur lors de l'ajout de la catégorie:", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

// Route pour ajouter une pièce
app.post("/addPiece", (req, res) => {
  const { pieceDesc, piecePrix } = req.body;

  if (!pieceDesc || !piecePrix) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  const query =
    "INSERT INTO Piece(DescPiece, PUHT) VALUES (@pieceDesc, @piecePrix)";
  const request = new sql.Request();
  request.input("pieceDesc", sql.VarChar, pieceDesc);
  request.input("piecePrix", sql.Decimal, piecePrix);

  request
    .query(query)
    .then((result) => {
      res.json({ message: "Pièce ajoutée avec succès" });
    })
    .catch((err) => {
      console.error("Erreur lors de l'ajout de la pièce:", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

// Route pour récupérer toutes les catégories
app.get("/getCategories", (req, res) => {
  const query = "SELECT * FROM Categorie";
  const request = new sql.Request();

  request
    .query(query)
    .then((results) => {
      res.json(results.recordset);
    })
    .catch((err) => {
      console.error("Erreur lors de la récupération des catégories:", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

// Route pour récupérer toutes les pièces
app.get("/getPieces", (req, res) => {
  const query = "SELECT * FROM Piece";
  const request = new sql.Request();

  request
    .query(query)
    .then((results) => {
      res.json(results.recordset);
    })
    .catch((err) => {
      console.error("Erreur lors de la récupération des pièces:", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

// Route pour supprimer une catégorie
app.delete("/deleteCategory/:IDCat", (req, res) => {
  const categoryId = req.params.IDCat;

  const query = "DELETE FROM Categorie WHERE IDCat = @categoryId";
  const request = new sql.Request();
  request.input("categoryId", sql.Int, categoryId);

  request
    .query(query)
    .then((result) => {
      res.json({ message: "Catégorie supprimée avec succès" });
    })
    .catch((err) => {
      console.error("Erreur lors de la suppression de la catégorie:", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

// Route pour supprimer une Piece détachées
app.delete("/deletePiece/:IDPiece", (req, res) => {
  const pieceId = req.params.IDPiece;

  const query = "DELETE FROM Piece WHERE IDPiece = @pieceId";
  const request = new sql.Request();
  request.input("pieceId", sql.Int, pieceId);

  request
    .query(query)
    .then((result) => {
      res.json({ message: "Pièce supprimée avec succès" });
    })
    .catch((err) => {
      console.error("Erreur lors de la suppression de la Pièce:", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

//----------- ODRE DE RAPARATION -------- //

// Route pour ajouter un ordre de réparation
app.post("/addOrder", (req, res) => {
  const { diagnosticPanne, nbHeuresMO, IDApp } = req.body;

  if (!diagnosticPanne || !nbHeuresMO || !IDApp) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  const query =
    "INSERT INTO Ordrereparation(DiagnosticPanne, NbHeuresMO, IDApp) VALUES (@diagnosticPanne, @nbHeuresMO, @IDApp)";
  const request = new sql.Request();
  request.input("diagnosticPanne", sql.VarChar, diagnosticPanne);
  request.input("nbHeuresMO", sql.Decimal, nbHeuresMO);
  request.input("IDApp", sql.Int, IDApp);

  request
    .query(query)
    .then((result) => {
      res.json({ message: "Ordre de réparation ajouté avec succès" });
    })
    .catch((err) => {
      console.error("Erreur lors de l'ajout de l'ordre de réparation:", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

// Route pour récupérer tous les ordres de réparation
app.get("/getOrders", (req, res) => {
  const query = "SELECT * FROM Ordrereparation";
  const request = new sql.Request();

  request
    .query(query)
    .then((results) => {
      res.json(results.recordset);
    })
    .catch((err) => {
      console.error(
        "Erreur lors de la récupération des ordres de réparation:",
        err
      );
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

// Route pour récupérer tous les les noms des cclient via ID d'appareil
app.get("/getNomsAppIDs", (req, res) => {
  const query =
    "select NomCli from Cliente where IDCli in (SELECT IDCli FROM Appareil);";
  // const query = "SELECT IDApp FROM Appareil";
  const request = new sql.Request();

  request
    .query(query)
    .then((results) => {
      const NomCli = results.recordset.map((result) => result.NomCli);
      res.json(NomCli);
    })
    .catch((err) => {
      console.error("Erreur lors de la récupération des ID d'appareil:", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

//----------- RECHERCHER CLIENT -------- //
// Route pour rechercher les clients par nom
app.get("/searchclients/:searchTerm", (req, res) => {
  const searchTerm = req.params.searchTerm.toLowerCase();
  const query =
    "SELECT * FROM Cliente WHERE LOWER(NomCli) LIKE '%' + @searchTerm + '%'";
  const request = new sql.Request();
  request.input("searchTerm", sql.VarChar, searchTerm);

  request
    .query(query)
    .then((results) => {
      res.json(results.recordset);
    })
    .catch((err) => {
      console.error("Erreur lors de la recherche des clients:", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

// ----------PUHT SUPERIEUR à UNE VALEUR DE SEUIL DONNé -------------//
// Route pour récupérer les pièces avec un PUHT supérieur à la valeur saisie
app.get("/piecesuperpuht/:puhtThreshold", (req, res) => {
  const puhtThreshold = req.params.puhtThreshold;
  const query = "SELECT * FROM Piece WHERE PUHT > @puhtThreshold";
  const request = new sql.Request();
  request.input("puhtThreshold", sql.Decimal, puhtThreshold);

  request
    .query(query)
    .then((results) => {
      res.json(results.recordset);
    })
    .catch((err) => {
      console.error("Erreur lors de la récupération des pièces:", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

// ----- ORDRE DE REPARATION Quantité = 0 --------//

// Route pour récupérer les ordres de réparation sans pièces à changer
app.get("/getOrdresSansPieces", (req, res) => {
  const query =
    "SELECT * FROM Ordrereparation WHERE IDOrdre IN (SELECT IDOrdre FROM Piecesachanger where Quantite = 0)";
  // SELECT * FROM Ordrereparation WHERE IDOrdre IN (SELECT IDOrdre FROM Piecesachanger where Quantite = 0)

  const request = new sql.Request();

  request
    .query(query)
    .then((results) => {
      res.json(results.recordset);
    })
    .catch((err) => {
      console.error(
        "Erreur lors de la récupération des ordres de réparation sans pièces à changer:",
        err
      );
      res.status(500).json({ error: "Erreur interne du serveur" });
    });
});

// --------------- FACTURE ----------------------//


// ...
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
