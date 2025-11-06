
import React from 'react';

const AdminDashboard = () => {
  // Dummy data for students
  const students = [
    { id: 1, name: 'John Doe', usn: '1RV22CS001', cgpa: 8.5, courses: 5 },
    { id: 2, name: 'Jane Smith', usn: '1RV22CS002', cgpa: 9.1, courses: 6 },
    { id: 3, name: 'Peter Jones', usn: '1RV22CS003', cgpa: 7.8, courses: 4 },
    { id: 4, name: 'Mary Johnson', usn: '1RV22CS004', cgpa: 8.9, courses: 5 },
    { id: 5, name: 'Chris Lee', usn: '1RV22CS005', cgpa: 9.5, courses: 6 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{student.name}</h2>
            <p className="text-gray-600 mb-2">USN: {student.usn}</p>
            <p className="text-gray-600 mb-2">CGPA: {student.cgpa}</p>
            <p className="text-gray-600">Courses Completed: {student.courses}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
