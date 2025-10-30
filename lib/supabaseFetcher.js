import { supabaseClient } from './supabaseClient';

export async function supabaseFetcher(table) {
  const { data, error } = await supabaseClient
    .from(table)
    .select(`
      id,
      slug,
      title,
      excerpt,
      image,
      categories,
      start_date,
      location,
      people_helped,
      status,
      content,
      goals,
      created_at,
      updated_at,
      project_images (
        id,
        image_url,
        alt_text
      )
    `)
    .order('created_at', { ascending: false });
  if (error) {
    throw error;
  }
  return data;
}