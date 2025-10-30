import { Plus, Trash2, Save, Image, Upload } from "lucide-react";

export default function SidebarBlocks({
  projectData,
  newCategory,
  setNewCategory,
  addCategory,
  removeCategory,
  newGoal,
  setNewGoal,
  addGoal,
  removeGoal,
  formState,
  submitButtonText,
  onSubmit,
  addImage,
  removeImage,
}) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Domaines d'Action et Catégories
        </h3>{" "}
        {/* Enhanced Content */}
        <div className="mb-3">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nouveau domaine d'intervention (Ex: Éducation)" // Enhanced Content
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addCategory())
              }
            />
            <button
              type="button"
              onClick={addCategory}
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              title="Ajouter un domaine" // Enhanced Content
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {projectData.categories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {category}
              <button
                type="button"
                onClick={() => removeCategory(category)}
                className="text-blue-600 hover:text-blue-800"
                title="Retirer ce domaine" // Enhanced Content
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Objectifs et Résultats Souhaités
        </h3>{" "}
        {/* Enhanced Content */}
        <div className="mb-3">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nouveau résultat attendu" // Enhanced Content
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addGoal())
              }
            />
            <button
              type="button"
              onClick={addGoal}
              className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              title="Ajouter un objectif" // Enhanced Content
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {projectData.goals.map((goal, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-green-50 p-2 rounded"
            >
              <span className="text-sm text-green-800">{goal}</span>
              <button
                type="button"
                onClick={() => removeGoal(index)}
                className="text-green-600 hover:text-green-800"
                title="Supprimer ce résultat" // Enhanced Content
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Images */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Image className="h-5 w-5" />
          Galerie d'Images (Témoignages Visuels) {/* Enhanced Content */}
        </h3>
        <div className="mb-3">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="URL de la photo d'impact" // Enhanced Content
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const url = e.target.value.trim();
                  if (url && addImage) {
                    addImage(url);
                    e.target.value = "";
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.querySelector(
                  'input[placeholder="URL de la photo d\'impact"]',
                ); // Corrected selector to match new placeholder
                const url = input?.value.trim();
                if (url && addImage) {
                  addImage(url);
                  if (input) input.value = "";
                }
              }}
              className="px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center gap-1"
              title="Ajouter la photo" // Enhanced Content
            >
              <Upload className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {projectData.gallery.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image || "/placeholder.svg?height=100&width=100"}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removeImage && removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Retirer cette photo" // Enhanced Content
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        {projectData.gallery.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            Aucune photo d'impact dans la galerie.
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="bg-white rounded-lg shadow p-6">
        <button
          type="submit"
          disabled={formState.status === "submitting"}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          {formState.status === "submitting"
            ? "Enregistrement de notre œuvre..."
            : submitButtonText}{" "}
          {/* Enhanced Content */}
        </button>
      </div>
    </div>
  );
}
