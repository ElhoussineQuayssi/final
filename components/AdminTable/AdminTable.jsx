const AdminTable = ({ columns, data, renderActions, loading }) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
    {loading ? (
      <div className="flex justify-center items-center p-12">
        <div
          className="animate-spin rounded-full h-8 w-8 border-4 border-transparent border-t-current"
          style={{ color: "#6495ED" }}
        />
        <p className="ml-4 text-lg" style={{ color: "#333333" }}>
          Chargement des articles...
        </p>
      </div>
    ) : (
      <table className="min-w-full divide-y divide-gray-200">
        <thead style={{ backgroundColor: "#B0E0E680" }}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider"
                style={{ color: "#333333" }}
              >
                {column.label}
              </th>
            ))}
            <th
              className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider"
              style={{ color: "#333333" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-6 py-8 text-center text-gray-500 italic"
              >
                Aucun article trouvé.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 transition duration-150"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    style={{ color: "#333333" }}
                  >
                    {column.render ? (
                      column.render(item[column.key], item)
                    ) : column.key === "title" ? (
                      <p className="font-semibold">{item[column.key]}</p>
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {renderActions(item)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    )}
  </div>
);

export default AdminTable;
