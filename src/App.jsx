import React, { useState, useEffect } from 'react';

export default function App() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Erreur de connexion:", error);
      }
    } else {
      alert("Yelzmek tsob l'extension MetaMask fel navigateur!");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', // Arrière-plan sombre moderne
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      margin: '-8px' // bech yna7i el marge par défaut mta3 l'écran
    }}>
      
      <div style={{
        background: '#ffffff',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        maxWidth: '450px',
        width: '90%'
      }}>
        
        {/* Logo w Titre */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '10px' 
          }}>🗳️</div>
          <h1 style={{ 
            margin: '0', 
            color: '#1e293b', 
            fontSize: '28px',
            fontWeight: '800'
          }}>BlockVote</h1>
          <p style={{ 
            color: '#64748b', 
            margin: '10px 0 0 0',
            fontSize: '15px'
          }}>Système de Vote Décentralisé (Proposition 2)</p>
        </div>

        {/* Espace Connexion */}
        <div style={{ marginTop: '20px' }}>
          {!account ? (
            <button
              onClick={connectWallet}
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '16px',
                backgroundColor: '#f6851b', // Couleur officielle mta3 MetaMask
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px -1px rgba(246, 133, 27, 0.3)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🦊 Connecter MetaMask
            </button>
          ) : (
            <div style={{
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '2px solid #e2e8f0'
            }}>
              <p style={{ margin: '0 0 10px 0', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                ✅ Portefeuille Connecté
              </p>
              <div style={{
                background: '#e2e8f0',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#334155',
                wordBreak: 'break-all',
                fontFamily: 'monospace'
              }}>
                {account}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}