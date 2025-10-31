import { notFound } from "next/navigation";
import Container from "@/components/Container/Container";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import UnifiedHeroProject from "@/components/UnifiedHero/UnifiedHeroProject";
import ProjectGallery from "@/components/ProjectGallery/ProjectGallery";
import { ProjectsController } from "@/lib/controllers/projects";

// --- Design System Configuration ---
const ACCENT = "#6495ED"; // Cornflower Blue

export default async function ProjectGalleryPage({ params }) {
  const { slug } = await params;

  // Get project details
  const project = await ProjectsController.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Get all project images for this project
  const projectImages = project.project_images || [];
  const galleryUrls = projectImages.map(img => {
    // Remove surrounding quotes if they exist
    const url = img.image_url ? img.image_url.replace(/^"|"$/g, '') : '';
    return url;
  }).filter(url => url && url.trim() !== '');


  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAFA" }}>
      {/* Hero Section */}
      <UnifiedHeroProject
        title={`Galerie Photos - ${project.title}`}
        description="Découvrez tous les moments capturés lors de la réalisation de ce projet."
        images={[project.image || "/projects/foundation1.jpg", "/projects/foundation2.jpg", "/projects/foundation3.jpg"]}
      />

      <Container className="p-20">


        {/* Gallery Section */}
        {galleryUrls.length > 0 ? (
          <section className="mb-16">
            <ProjectGallery
              images={galleryUrls}
              projectTitle={project.title}
              className="scroll-reveal"
            />
          </section>
        ) : (
          <section className="text-center py-16">
            <div className="bg-white rounded-lg shadow-md p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Aucune photo disponible</h3>
              <p className="text-gray-600">
                La galerie de ce projet sera bientôt enrichie de nouvelles photos.
              </p>
            </div>
          </section>
        )}

        {/* Back to Project Link */}
        <section className="text-center">
          <a
            href={`/projects/${slug}`}
            className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-md"
            style={{
              backgroundColor: ACCENT,
              color: "white",
              textDecoration: "none"
            }}
          >
            ← Retour au projet
          </a>
        </section>
      </Container>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const project = await ProjectsController.getProjectBySlug(slug);
    if (!project) {
      return {
        title: "Galerie non trouvée | Fondation Assalam",
        description: "La galerie demandée n'existe pas.",
      };
    }

    return {
      title: `Galerie Photos - ${project.title} | Fondation Assalam`,
      description: `Découvrez toutes les photos du projet ${project.title}. Chaque image raconte une histoire d'impact et de transformation.`,
    };
  } catch (error) {
    return {
      title: `Galerie Photos | Fondation Assalam`,
      description: "Découvrez les galeries photos de nos projets.",
    };
  }
}