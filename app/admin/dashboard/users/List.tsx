interface User {
  created_at: string;
  full_name: string;
  email: string;
  password: string;
}

interface ListProps {
  users: User[];
}

const List: React.FC<ListProps> = ({ users }) => {
  return (
    <div className="overflow-x-auto p-4 w-full">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-6 text-left text-gray-700 uppercase tracking-wider border-b">Fecha de Creación</th>
            <th className="py-3 px-6 text-left text-gray-700 uppercase tracking-wider border-b">Nombre Completo</th>
            <th className="py-3 px-6 text-left text-gray-700 uppercase tracking-wider border-b">Email</th>
            <th className="py-3 px-6 text-left text-gray-700 uppercase tracking-wider border-b">Contraseña</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-6 border-b">{new Date(user.created_at).toLocaleDateString()}</td>
              <td className="py-4 px-6 border-b">{user.full_name}</td>
              <td className="py-4 px-6 border-b">{user.email}</td>
              <td className="py-4 px-6 border-b">{user.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default List;