import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hcp_name: '', interaction_type: 'Meeting', date: '2026-04-21', 
    attendees: '', topics: '', sentiment: 'Neutral', outcomes: '', follow_up: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChat = async () => {
    if (!chatInput) return;
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/process-interaction', { text: chatInput });
      if (res.data.data) {
        setFormData((prev) => ({ ...prev, ...res.data.data })); 
      }
      setChatInput('');
    } catch (err) {
      alert("Backend Error! Check terminal for Invalid API Key.");
    } finally {
      setLoading(false);
    }
  };

  const saveToDatabase = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/save-hcp-data', formData);
      if (res.data.status === "success") alert("Data successfully saved in database.json!");
    } catch (err) {
      alert("Save failed!");
    }
  };

  return (
    <div style={styles.container}>
      {/* LEFT FORM */}
      <div style={styles.formPanel}>
        <h2 style={styles.header}>Log HCP Interaction <span style={styles.badge}>v2.0</span></h2>
        <div style={styles.grid}>
          <div><label style={styles.label}>HCP Name</label><input name="hcp_name" style={styles.input} value={formData.hcp_name} onChange={handleChange} /></div>
          <div><label style={styles.label}>Type</label><select name="interaction_type" style={styles.input} value={formData.interaction_type} onChange={handleChange}><option>Meeting</option><option>Call</option><option>Email</option></select></div>
          <div><label style={styles.label}>Date</label><input name="date" type="date" style={styles.input} value={formData.date} onChange={handleChange} /></div>
          <div>
            <label style={styles.label}>Sentiment</label>
            <div style={styles.radioGroup}>
              {['Positive', 'Neutral', 'Negative'].map(s => (
                <label key={s}><input type="radio" name="sentiment" value={s} checked={formData.sentiment === s} onChange={handleChange} /> {s}</label>
              ))}
            </div>
          </div>
        </div>
        <div style={{marginTop: '20px'}}>
          <label style={styles.label}>Topics Discussed</label><textarea name="topics" style={styles.textarea} value={formData.topics} onChange={handleChange}></textarea>
          <label style={styles.label}>Outcomes</label><textarea name="outcomes" style={styles.textarea} value={formData.outcomes} onChange={handleChange}></textarea>
        </div>
        <button style={styles.saveBtn} onClick={saveToDatabase}>Save to CRM Database</button>
      </div>

      {/* RIGHT CHAT */}
      <div style={styles.chatPanel}>
        <div style={styles.chatHeader}>AI Assistant Agent</div>
        <div style={styles.chatBody}>
          <p>Describe your interaction below:</p>
          <i style={styles.example}>"Met Dr. Sharma, discussed herbal powders, he was very impressed."</i>
          {loading && <div style={{color: '#2563eb'}}>✨ Analyzing...</div>}
          {formData.hcp_name && !loading && <div style={styles.successBox}>✓ Form updated for {formData.hcp_name}</div>}
        </div>
        <div style={styles.chatInputArea}>
          <input style={styles.input} placeholder="Describe meeting..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChat()} />
          <button onClick={handleChat} style={styles.logBtn}>{loading ? "..." : "Log via AI"}</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: '100vh', backgroundColor: '#f8fafc', padding: '20px', gap: '20px', fontFamily: 'Arial' },
  formPanel: { flex: 2, backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflowY: 'auto' },
  chatPanel: { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  header: { color: '#1e3a8a', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' },
  badge: { fontSize: '12px', background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '10px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' },
  label: { fontSize: '13px', fontWeight: 'bold', color: '#475569', display: 'block', marginTop: '10px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '5px', boxSizing: 'border-box' },
  textarea: { width: '100%', height: '70px', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '5px', boxSizing: 'border-box' },
  radioGroup: { display: 'flex', gap: '10px', marginTop: '10px', fontSize: '13px' },
  saveBtn: { width: '100%', padding: '15px', marginTop: '20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  chatHeader: { padding: '15px', background: '#1e3a8a', color: 'white', fontWeight: 'bold', borderRadius: '12px 12px 0 0' },
  chatBody: { flex: 1, padding: '20px', fontSize: '14px', color: '#64748b' },
  chatInputArea: { padding: '15px', borderTop: '1px solid #f1f5f9' },
  logBtn: { width: '100%', padding: '10px', marginTop: '5px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  example: { display: 'block', background: '#f1f5f9', padding: '10px', margin: '10px 0', borderRadius: '6px' },
  successBox: { marginTop: '10px', color: '#059669', background: '#ecfdf5', padding: '10px', borderRadius: '6px', border: '1px solid #10b981' }
};

export default App;