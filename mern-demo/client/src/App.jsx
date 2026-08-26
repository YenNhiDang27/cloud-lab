import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });

  const fetchStudents = async () => {
    const res = await fetch('http://localhost:5000/api/students');
    setStudents(await res.json());
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ studentId: '', name: '', email: '' });
    fetchStudents();
  };

  return (
    <div>
      <h1>Quản Lý Sinh Viên</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="MSSV" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} />
        <input placeholder="Họ tên" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <button type="submit">Thêm</button>
      </form>
      <ul>
        {students.map(s => <li key={s._id}>{s.studentId} - {s.name}</li>)}
      </ul>
    </div>
  );
}
export default App;