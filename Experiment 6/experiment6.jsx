import React, { useState } from 'react';

function App() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({ title: '', author: '', year: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.year) {
      alert('Please fill in all fields');
      return;
    }

    if (editingIndex !== null) {
      const updatedBooks = [...books];
      updatedBooks[editingIndex] = formData;
      setBooks(updatedBooks);
      setEditingIndex(null);
    } else {
      setBooks(prev => [...prev, formData]);
    }

    setFormData({ title: '', author: '', year: '' });
  };

  const handleEdit = (index) => {
    setFormData(books[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this book?");
    if (!confirmed) return;
    setBooks(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setFormData({ title: '', author: '', year: '' });
    }
  };

  // Inline styles
  const styles = {
    app: {
      maxWidth: '700px',
      margin: '40px auto',
      padding: '20px',
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#fefefe',
      borderRadius: '10px',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    },
    heading: {
      textAlign: 'center',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginBottom: '20px',
      justifyContent: 'center',
    },
    input: {
      padding: '10px',
      fontSize: '1rem',
      flex: '1 1 30%',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px 15px',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#007bfc',
      color: 'white',
      cursor: 'pointer',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
    },
    th: {
      padding: '12px',
      borderBottom: '1px solid #ccc',
      backgroundColor: '#f4f4f4',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ccc',
    },
    actionButton: {
      marginRight: '5px',
      padding: '5px 10px',
      fontSize: '0.9rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      color: 'white',
    },
    editBtn: {
      backgroundColor: '#28a745',
    },
    deleteBtn: {
      backgroundColor: '#dc3545',
    }
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.heading}>📚 Library Management</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="title"
          type="text"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="author"
          type="text"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="year"
          type="number"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          {editingIndex !== null ? 'Update Book' : 'Add Book'}
        </button>
      </form>

      {books.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No books in library.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>📘 Title</th>
              <th style={styles.th}>✍️ Author</th>
              <th style={styles.th}>📅 Year</th>
              <th style={styles.th}>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, i) => (
              <tr key={i}>
                <td style={styles.td}>{book.title}</td>
                <td style={styles.td}>{book.author}</td>
                <td style={styles.td}>{book.year}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEdit(i)}
                    style={{ ...styles.actionButton, ...styles.editBtn }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    style={{ ...styles.actionButton, ...styles.deleteBtn }}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
