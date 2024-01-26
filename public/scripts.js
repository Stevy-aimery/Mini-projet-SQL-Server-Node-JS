document.addEventListener("DOMContentLoaded", () => {
  //------ Formulaires et Tableaux pour Cliente -----------//
  const btnAjouter = document.getElementById("btnAjouter");
  btnAjouter.addEventListener("click", () => addClient());

  // Fonction pour vider les champs du formulaire client
  const effacerChampsForms = () => {
    const clientName = document.getElementById("clientName");
    const clientAdr = document.getElementById("clientAdr");
    const clientVille = document.getElementById("clientVille");

    clientName.value = "";
    clientAdr.value = "";
    clientVille.value = "";
  };

  // Fonction pour ajouter un client
  function addClient() {
    const clientName = document.getElementById("clientName").value;
    const clientAdr = document.getElementById("clientAdr").value;
    const clientVille = document.getElementById("clientVille").value;

    // Verifie que les champs ne sont pas vides
    if (!clientName || !clientAdr || !clientVille) {
      // Vérification également pour le champ "Ville"
      alert("Tous les champs sont obligatoires");
      return;
    }

    // Envoie des données au serveur via fetch
    fetch("/addClient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientName, clientAdr, clientVille }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        // Rafraîchissez le tableau après avoir ajouté le client
        fetchclients();
        // effacer les champs du formulaire apres l'envoi des data
        effacerChampsForms();
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du client:", error);
        alert("Une erreur est survenue lors de l'ajout du client");
      });
  }
  // Fonction pour afficher les clients dans le tableau
  function displayClients(clients) {
    const tableBody = document.getElementById("clientTableBody");
    tableBody.innerHTML = "";

    clients.forEach((client) => {
      const row = tableBody.insertRow();
      row.id = `clientRow_${client.IDCli}`;
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);

      cell1.textContent = client.NomCli;
      cell2.textContent = client.AdrCli;
      cell3.textContent = client.VilleCli;

      // Boutons pour la modification et la suppression
      const editButton = document.createElement("button");
      editButton.textContent = "Modifier";
      editButton.className = "btn btn-warning btn-sm text-center";
      editButton.addEventListener("click", () => editclient(client.IDCli));

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Supprimer";
      deleteButton.className = "btn btn-danger btn-sm ms-3 text-center";
      deleteButton.addEventListener("click", () => deleteclient(client.IDCli));

      cell4.appendChild(editButton);
      cell4.appendChild(deleteButton);
    });
  }

  // Fonction pour récupérer les clients depuis le serveur
  function fetchclients() {
    fetch("/getclients")
      .then((response) => response.json())
      .then(displayClients)
      .catch((error) =>
        console.error("Erreur lors de la récupération des clients:", error)
      );
  }

  // Appel initial pour récupérer et afficher les clients
  fetchclients();

  // Fonction pour éditer un client
  function editclient(clientId) {
    const clientRow = document.getElementById(`clientRow_${clientId}`);
    if (!clientRow) {
      console.error("Ligne de du client introuvable");
      return;
    }
    const clientName = clientRow.cells[0]?.textContent;
    const clientAdr = clientRow.cells[1]?.textContent;
    const clientVille = clientRow.cells[2]?.textContent;

    // Remplir le formulaire de la fenêtre modale avec les informations actuelles du client
    document.getElementById("editclientName").value = clientName;
    document.getElementById("editclientAdr").value = clientAdr;
    document.getElementById("editclientVille").value = clientVille;

    // Ouvrir la fenêtre modale
    const modal = new bootstrap.Modal(
      document.getElementById("editclientModal")
    );
    modal.show();

    const fermerbtn = document.getElementById("fermer");
    fermerbtn.addEventListener("click", () => {
      modal.hide();
    });

    // Logique pour sauvegarder les modifications
    document.getElementById("saveEditButton").onclick = () => {
      const newclientName = document.getElementById("editclientName").value;
      const newclientAdr = document.getElementById("editclientAdr").value;
      const newclientVille = document.getElementById("editclientVille").value;

      // Utilisez fetch pour envoyer les données de mise à jour au serveur
      fetch(`/editclient/${clientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName: newclientName,
          clientAdr: newclientAdr,
          clientVille: newclientVille,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          // Rafraîchissez le tableau après avoir modifié le client
          fetchclients();
          // Fermer la fenêtre modale
          modal.hide();
        })
        .catch((error) => {
          console.error("Erreur lors de la modification du client:", error);
          alert("Une erreur est survenue lors de la modification du client");
        });
    };
  }

  // Fonction pour supprimer un client
  function deleteclient(clientId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client?")) {
      // Utilisation de fetch pour envoyer une requête de suppression au serveur
      fetch(`/deleteclient/${clientId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          // Rafraîchissez le tableau après avoir supprimé le client
          fetchclients();
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression du client:", error);
          alert("Une erreur est survenue lors de la suppression du client");
        });
    }
  }

  //-------- Formulaires et Tableaux pour Catégories et Pièces -------------//

  const btnAjouterCategorie = document.getElementById("btnAjouterCategorie");
  const categorieTableBody = document.getElementById("categorieTableBody");

  const btnAjouterPiece = document.getElementById("btnAjouterPiece");
  const pieceTableBody = document.getElementById("pieceTableBody");

  // Logique pour ajouter une catégorie
  btnAjouterCategorie.addEventListener("click", () => {
    const categorieLib = document.getElementById("categorieLib").value;
    const categorieTarif = document.getElementById("categorieTarif").value;

    if (!categorieLib || !categorieTarif) {
      alert("Tous les champs sont obligatoires");
      return;
    }

    fetch("/addCategorie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categorieLib, categorieTarif }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        fetchCategories(); // Rafraîchir le tableau des catégories
        clearCategorieFields();
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout de la catégorie:", error);
        alert("Une erreur est survenue lors de l'ajout de la catégorie");
      });
  });

  // Logique pour ajouter une pièce détachée
  btnAjouterPiece.addEventListener("click", () => {
    const pieceDesc = document.getElementById("pieceDesc").value;
    const piecePrix = document.getElementById("piecePrix").value;

    if (!pieceDesc || !piecePrix) {
      alert("Tous les champs sont obligatoires");
      return;
    }

    fetch("/addPiece", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pieceDesc, piecePrix }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        fetchPieces(); // Rafraîchir le tableau des pièces détachées
        clearPieceFields();
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout de la pièce détachée:", error);
        alert("Une erreur est survenue lors de l'ajout de la pièce détachée");
      });
  });

  // Fonctions pour vider les champs des formulaires
  const clearCategorieFields = () => {
    document.getElementById("categorieLib").value = "";
    document.getElementById("categorieTarif").value = "";
  };

  const clearPieceFields = () => {
    document.getElementById("pieceDesc").value = "";
    document.getElementById("piecePrix").value = "";
  };

  // Fonction pour afficher les catégories dans le tableau
  function displayCategories(categories) {
    categorieTableBody.innerHTML = "";

    categories.forEach((categorie) => {
      const row = categorieTableBody.insertRow();
      row.id = `categorieRow_${categorie.IDCat}`;
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);

      cell1.textContent = categorie.libCat;
      cell2.textContent = categorie.TarifMO;

      // Boutons pour la modification et la suppression
      const editButton = document.createElement("button");
      editButton.textContent = "Modifier";
      editButton.className = "btn btn-warning btn-sm text-center";
      editButton.addEventListener("click", () =>
        editCategorie(categorie.IDCat)
      );

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Supprimer";
      deleteButton.className = "btn btn-danger btn-sm ms-3 text-center";
      deleteButton.addEventListener("click", () =>
        deleteCategorie(categorie.IDCat)
      );

      cell3.appendChild(editButton);
      cell3.appendChild(deleteButton);
    });
  }

  // Logique pour récupérer les catégories depuis le serveur
  function fetchCategories() {
    fetch("/getCategories")
      .then((response) => response.json())
      .then(displayCategories)
      .catch((error) =>
        console.error("Erreur lors de la récupération des catégories:", error)
      );
  }

  // Appel initial pour récupérer et afficher les catégories
  fetchCategories();

  // Fonction pour éditer une catégorie
  function editCategorie(categorieId) {
    // ... (logique similaire à editClient, adaptée pour les catégories)
  }

  // Fonction pour supprimer une catégorie
  function deleteCategorie(categorieId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette Categorie ?")) {
      // Utilisation de fetch pour envoyer une requête de suppression au serveur
      fetch(`/deleteCategory/${categorieId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          // Rafraîchissez le tableau après avoir supprimé la categorie
          fetchCategories();
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la suppression de la Categorie:",
            error
          );
          alert(
            "Une erreur est survenue lors de la suppression de la Categorie"
          );
        });
    }
  }

  // Fonction pour afficher les pièces dans le tableau
  function displayPieces(pieces) {
    pieceTableBody.innerHTML = "";

    pieces.forEach((piece) => {
      const row = pieceTableBody.insertRow();
      row.id = `pieceRow_${piece.IDPiece}`;
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);

      cell1.textContent = piece.DescPiece;
      cell2.textContent = piece.PUHT;

      // Boutons pour la modification et la suppression
      const editButton = document.createElement("button");
      editButton.textContent = "Modifier";
      editButton.className = "btn btn-warning btn-sm text-center";
      editButton.addEventListener("click", () => editPiece(piece.IDPiece));

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Supprimer";
      deleteButton.className = "btn btn-danger btn-sm ms-3 text-center";
      deleteButton.addEventListener("click", () => deletePiece(piece.IDPiece));

      cell3.appendChild(editButton);
      cell3.appendChild(deleteButton);
    });
  }

  // Logique pour récupérer les pièces depuis le serveur
  function fetchPieces() {
    fetch("/getPieces")
      .then((response) => response.json())
      .then(displayPieces)
      .catch((error) =>
        console.error("Erreur lors de la récupération des pièces:", error)
      );
  }

  // Appel initial pour récupérer et afficher les pièces
  fetchPieces();

  // Fonction pour éditer une pièce détachée
  function editPiece(pieceId) {}

  // Fonction pour supprimer une pièce détachée
  function deletePiece(pieceId) {
    if (confirm("Êtes-vous sûr de vouloir cette Pièce?")) {
      // Utilisation de fetch pour envoyer une requête de suppression au serveur
      fetch(`/deletePiece/${pieceId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          // Rafraîchissez le tableau après avoir supprimé la Pièce
          fetchPieces();
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression de la Pièce:", error);
          alert("Une erreur est survenue lors de la suppression de la Pièce");
        });
    }
  }

  //-------- Ordre de reparation -------------//
  const btnAjouterOrder = document.getElementById("btnAjouterOrder");
  btnAjouterOrder.addEventListener("click", () => addOrder());

  // Fonctions pour vider les champs du formulaires ordre de repation
  const clearOrdreRapationFields = () => {
    document.getElementById("diagnosticPanne").value = "";
    document.getElementById("nbHeuresMO").value = "";
    document.getElementById("NomClient").value = "";
  };
  clearOrdreRapationFields();

  // Fonction pour ajouter un ordre de réparation
  function addOrder() {
    const diagnosticPanne = document.getElementById("diagnosticPanne").value;
    const nbHeuresMO = document.getElementById("nbHeuresMO").value;
    const IDApp = document.getElementById("NomClient").value;

    if (!diagnosticPanne || !nbHeuresMO || !IDApp) {
      alert("Tous les champs sont obligatoires");
      return;
    }

    fetch("/addOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ diagnosticPanne, nbHeuresMO, IDApp }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        fetchOrders();
        clearOrdreRapationFields();
      })
      .catch((error) => {
        console.error(
          "Erreur lors de l'ajout de l'ordre de réparation:",
          error
        );
        alert(
          "Une erreur est survenue lors de l'ajout de l'ordre de réparation"
        );
      });
  }
  // Fonction pour afficher les ordres de réparation dans le tableau
  function displayOrders(orders) {
    const tableBody = document.getElementById("orderTableBody");
    tableBody.innerHTML = "";

    orders.forEach((order) => {
      const row = tableBody.insertRow();
      row.id = `orderRow_${order.IDOrdre}`;
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);

      cell1.textContent = order.DiagnosticPanne;
      cell2.textContent = order.NbHeuresMO;
      cell3.textContent = order.IDApp;

      // Boutons pour la modification et la suppression
      const editButton = document.createElement("button");
      editButton.textContent = "Modifier";
      editButton.className = "btn btn-warning btn-sm me-2";
      editButton.addEventListener("click", () => editOrder(order.IDOrdre));

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Supprimer";
      deleteButton.className = "btn btn-danger btn-sm";
      deleteButton.addEventListener("click", () => deleteOrder(order.IDOrdre));

      cell4.appendChild(editButton);
      cell4.appendChild(deleteButton);
    });
  }

  function fetchOrders() {
    fetch("/getOrders")
      .then((response) => response.json())
      .then(displayOrders)
      .catch((error) =>
        console.error(
          "Erreur lors de la récupération des ordres de réparation:",
          error
        )
      );
  }
  fetchOrders();

  // recuperer les Nom des client pour chaque IDApp du server
  function fetchAppIDs() {
    fetch("/getNomsAppIDs")
      .then((response) => response.json())
      .then((NomCli) => {
        const IDAppSelect = document.getElementById("NomClient");
        IDAppSelect.innerHTML = "";
        // <option selected>Open this select menu</option>
        NomCli.forEach((Nom) => {
          const option = document.createElement("option");
          option.value = Nom;
          option.textContent = Nom;
          IDAppSelect.appendChild(option);
        });
      })
      .catch((error) =>
        console.error(
          "Erreur lors de la récupération des ID d'appareil:",
          error
        )
      );
  }
  fetchAppIDs();

  //----------- Rechercher client ---------------//
  const searchClientInput = document.getElementById("rechererClient");
  searchClientInput.addEventListener("input", () => searchClients());

  function searchClients() {
    const searchTerm = searchClientInput.value.toLowerCase();

    // Effectuer une requête fetch pour récupérer les clients filtrés côté serveur
    fetch(`/searchclients/${searchTerm}`)
      .then((response) => response.json())
      .then(displaySearchResults)
      .catch((error) =>
        console.error("Erreur lors de la recherche des clients:", error)
      );
  }

  function displaySearchResults(clients) {
    const tableBody2 = document.getElementById("clientTableBody2");
    tableBody2.innerHTML = "";

    clients.forEach((client) => {
      const row = tableBody2.insertRow();
      row.id = `clientRow_${client.IDCli}`;
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);

      cell1.textContent = client.NomCli;
      cell2.textContent = client.AdrCli;
      cell3.textContent = client.VilleCli;

      // Boutons pour la modification et la suppression
      const editButton = document.createElement("button");
      editButton.textContent = "Modifier";
      editButton.className = "btn btn-warning btn-sm text-center";
      editButton.addEventListener("click", () => editClient(client.IDCli));

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Supprimer";
      deleteButton.className = "btn btn-danger btn-sm ms-3 text-center";
      deleteButton.addEventListener("click", () => deleteClient(client.IDCli));

      cell4.appendChild(editButton);
      cell4.appendChild(deleteButton);
    });
  }

  //---------- Les pièces dont le prix hors taxes est supérieur à un prix donné ----------//

  const btnAfficherPieceSuperPUHT = document.getElementById(
    "btnAfficherPieceSuperPUHT"
  );
  btnAfficherPieceSuperPUHT.addEventListener("click", () =>
    filterPiecesByPUHT()
  );

  function filterPiecesByPUHT() {
    const puhtThreshold = parseFloat(
      document.getElementById("puhtThreshold").value
    );

    // Effectuer une requête fetch pour récupérer les pièces dont le PUHT est supérieur à la valeur saisie
    fetch(`/piecesuperpuht/${puhtThreshold}`)
      .then((response) => response.json())
      .then(displaySuperPUHTPieces)
      .catch((error) =>
        console.error("Erreur lors de la récupération des pièces:", error)
      );
  }

  function displaySuperPUHTPieces(pieces) {
    const tableBody = document.getElementById("pieceSuperPUHTTableBody");
    tableBody.innerHTML = "";

    pieces.forEach((piece) => {
      const row = tableBody.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);

      cell1.textContent = piece.DescPiece;
      cell2.textContent = piece.PUHT;
    });
  }

  //----- ORDRE DE REPARATION Quantité = 0 --------//
  const btnAfficherOrdresSansPieces = document.getElementById(
    "btnAfficherOrdresSansPieces"
  );
  btnAfficherOrdresSansPieces.addEventListener("click", () =>
    fetchOrdresSansPieces()
  );

  // Fonction pour récupérer les ordres de réparation sans pièces à changer depuis le serveur
  function fetchOrdresSansPieces() {
    fetch("/getOrdresSansPieces")
      .then((response) => response.json())
      .then(displayOrdresSansPieces)
      .catch((error) =>
        console.error(
          "Erreur lors de la récupération des ordres de réparation sans pièces à changer:",
          error
        )
      );
  }

  // Fonction pour afficher les ordres de réparation sans pièces à changer dans le tableau
  function displayOrdresSansPieces(ordres) {
    const tableBody = document.getElementById("orderTableBody2");
    tableBody.innerHTML = "";

    ordres.forEach((ordre) => {
      const row = tableBody.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);

      cell1.textContent = ordre.DiagnosticPanne;
      cell2.textContent = ordre.NbHeuresMO;
      cell3.textContent = ordre.IDApp;

      // Boutons pour la modification et la suppression
      const editButton = document.createElement("button");
      editButton.textContent = "Modifier";
      editButton.className = "btn btn-warning btn-sm text-center";
      editButton.addEventListener("click", () => editOrdre(ordre.IDOrdre));

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Supprimer";
      deleteButton.className = "btn btn-danger btn-sm ms-3 text-center";
      deleteButton.addEventListener("click", () => deleteOrdre(ordre.IDOrdre));

      cell4.appendChild(editButton);
      cell4.appendChild(deleteButton);
    });
  }

  // --------------- FACTURE ----------------------//
  // FIN
});
