import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    const res = await fetch('http://localhost:5000/api/students');
    setStudents(await res.json());
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:5000/api/students/${editingId}`
      : 'http://localhost:5000/api/students';
    const res = await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.error || 'Không thể thêm sinh viên');
      return;
    }

    setForm({ studentId: '', name: '', email: '' });
    setEditingId(null);
    fetchStudents();
  };

  const handleEdit = (student) => {
    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });
    setEditingId(student._id);
  };

  const cancelEdit = () => {
    setForm({ studentId: '', name: '', email: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sinh viên này không?')) return;

    const res = await fetch(`http://localhost:5000/api/students/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      alert('Không thể xóa sinh viên');
      return;
    }

    setStudents(students.filter(student => student._id !== id));
  };

  return (
    <div>
      <h1>Quản Lý Sinh Viên</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="MSSV" value={form.studentId} onChange={e => setForm(current => ({ ...current, studentId: e.target.value }))} />
        <input placeholder="Họ tên" value={form.name} onChange={e => setForm(current => ({ ...current, name: e.target.value }))} />
        <input placeholder="Email" value={form.email} onChange={e => setForm(current => ({ ...current, email: e.target.value }))} />
        <button type="submit">{editingId ? 'Cập nhật' : 'Thêm'}</button>
        {editingId && (
          <button type="button" onClick={cancelEdit}>Hủy</button>
        )}
      </form>
      <table>
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td>{s.studentId}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>
                <button type="button" onClick={() => handleEdit(s)}>
                  Sửa
                </button>
                <button type="button" onClick={() => handleDelete(s._id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default App;