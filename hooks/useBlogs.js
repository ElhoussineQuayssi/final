import useSWR from 'swr';
import { supabaseClient } from '../lib/supabaseClient';
import { supabaseFetcher } from '../lib/supabaseFetcher';

export function useBlogs() {
  const key = ['blog_posts'];
  const { data, error, isLoading, mutate } = useSWR(key, supabaseFetcher);

  const createBlog = async (blogData) => {
    const { error: createError } = await supabaseClient.from('blog_posts').insert([blogData]);
    if (createError) {
      console.error('Failed to create blog:', createError);
      throw new Error('Could not create blog.');
    }
    mutate(); // Revalidate
  };

  const updateBlog = async (blogId, updatedData) => {
    const { error: updateError } = await supabaseClient.from('blog_posts').update(updatedData).eq('id', blogId);
    if (updateError) {
      console.error('Failed to update blog:', updateError);
      throw new Error('Could not update blog.');
    }
    mutate(); // Revalidate
  };

  const deleteBlog = async (blogId) => {
    const { error: deleteError } = await supabaseClient.from('blog_posts').delete().eq('id', blogId);
    if (deleteError) {
      console.error('Failed to delete blog:', deleteError);
      throw new Error('Could not delete blog.');
    }
    mutate(); // Revalidate
  };

  return {
    blogs: data,
    isLoading,
    isError: error,
    mutate,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}