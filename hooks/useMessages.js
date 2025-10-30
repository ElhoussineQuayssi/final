import useSWR from 'swr';
import { supabaseClient } from '../lib/supabaseClient';
import { supabaseFetcher } from '../lib/supabaseFetcher';

export function useMessages() {
  const key = ['messages'];
  const { data, error, isLoading, mutate } = useSWR(key, supabaseFetcher);

  const createMessage = async (messageData) => {
    const { error: createError } = await supabaseClient.from('messages').insert([messageData]);
    if (createError) {
      console.error('Failed to create message:', createError);
      throw new Error('Could not create message.');
    }
    mutate(); // Revalidate
  };

  const updateMessage = async (messageId, updatedData) => {
    const { error: updateError } = await supabaseClient.from('messages').update(updatedData).eq('id', messageId);
    if (updateError) {
      console.error('Failed to update message:', updateError);
      throw new Error('Could not update message.');
    }
    mutate(); // Revalidate
  };

  const deleteMessage = async (messageId) => {
    const { error: deleteError } = await supabaseClient.from('messages').delete().eq('id', messageId);
    if (deleteError) {
      console.error('Failed to delete message:', deleteError);
      throw new Error('Could not delete message.');
    }
    mutate(); // Revalidate
  };

  return {
    messages: data,
    isLoading,
    isError: error,
    mutate,
    createMessage,
    updateMessage,
    deleteMessage,
  };
}