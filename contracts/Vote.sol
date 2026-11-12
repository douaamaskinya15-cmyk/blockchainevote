// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Vote {
    address public admin;

    struct Candidat {
        uint id;
        string nom;
        uint voteCount;
    }

    // Horodatage (Contraintes de temps)
    uint public dateDebut;
    uint public dateFin;

    // Données stockées sur la Blockchain
    Candidat[] public candidats;
    mapping(address => bool) public whitelist;
    mapping(address => bool) public hasVoted;

    // Événement pour notifier le Frontend en temps réel
    event VoteEmis(address indexed votant, uint candidatId);

    // Règle 1: Seul l'administrateur a le droit
    modifier onlyAdmin() {
        require(msg.sender == admin, "Action reservee a l'admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Règle 2: Définir la période du scrutin
    function definirPeriode(uint _dateDebut, uint _dateFin) external onlyAdmin {
        require(_dateDebut < _dateFin, "Date de debut doit etre avant la fin");
        dateDebut = _dateDebut;
        dateFin = _dateFin;
    }

    // Règle 3: Ajouter un candidat
    function ajouterCandidat(string memory _nom) external onlyAdmin {
        candidats.push(Candidat({
            id: candidats.length,
            nom: _nom,
            voteCount: 0
        }));
    }

    // Règle 4: Ajouter une adresse à la Whitelist (Éligibilité)
    function autoriserVotant(address _votant) external onlyAdmin {
        whitelist[_votant] = true;
    }

    // Règle 5: Émettre un vote avec toutes les vérifications
    function voter(uint _candidatId) external {
        // 1. Vérification du temps (Horodatage)
        require(dateDebut > 0 && dateFin > 0, "Periode de vote non definie");
        require(block.timestamp >= dateDebut, "Le vote n'a pas encore commence");
        require(block.timestamp <= dateFin, "Le vote est termine");

        // 2. Vérification de l'éligibilité (Whitelist)
        require(whitelist[msg.sender], "Portefeuille non autorise (Hors Whitelist)");

        // 3. Vérification du double vote
        require(!hasVoted[msg.sender], "Vous avez deja vote");

        // 4. Vérification de l'existence du candidat
        require(_candidatId < candidats.length, "Candidat inexistant");

        // Enregistrement définitif sur la Blockchain
        hasVoted[msg.sender] = true;
        candidats[_candidatId].voteCount++;

        // Déclenchement de l'événement
        emit VoteEmis(msg.sender, _candidatId);
    }

    // Fonctions utiles pour React (Frontend)
    function getNombreCandidats() external view returns (uint) {
        return candidats.length;
    }

    function getCandidat(uint _index) external view returns (uint, string memory, uint) {
        return (candidats[_index].id, candidats[_index].nom, candidats[_index].voteCount);
    }
}