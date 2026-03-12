export const Loading = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '60vh', 
      width: '100%'
    }}>
     
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #22c9e6', 
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}></div>
      
      <p style={{ 
        marginTop: '15px', 
        color: '#ccc', 
        fontSize: '1.1rem',
        fontWeight: '500' 
      }}>
        Buscando dados...
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};