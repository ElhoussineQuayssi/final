import supabaseServer from '../supabaseServer';

export class MessagesController {
  static async getAllMessages(user, queryParams = {}) {
    // Check authorization
    const { data: adminData, error: roleError } = await supabaseServer
      .from('admins')
      .select('role')
      .eq('id', user.id)
      .single();

    if (roleError || !['super_admin', 'messages_manager'].includes(adminData?.role)) {
      throw new Error('Forbidden');
    }

    const { status, type, limit, offset = 0 } = queryParams;

    let query = supabaseServer
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data: messages, error, count } = await query;

    if (error) {
      throw new Error('Failed to fetch messages');
    }

    return { messages, total: count };
  }

  static async getMessageById(user, id) {
    // Check authorization
    const { data: adminData, error: roleError } = await supabaseServer
      .from('admins')
      .select('role')
      .eq('id', user.id)
      .single();

    if (roleError || !['super_admin', 'messages_manager'].includes(adminData?.role)) {
      throw new Error('Forbidden');
    }

    const { data: message, error } = await supabaseServer
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Message not found');
      }
      throw new Error('Failed to fetch message');
    }

    return message;
  }

  static async createMessage(messageData) {
    const { name, email, phone, subject, project, message, type } = messageData;

    // Split name into first and last name
    const nameParts = name ? name.trim().split(' ') : [];
    const first_name = nameParts[0] || '';
    const last_name = nameParts.slice(1).join(' ') || '';

    if (!first_name || !email || !message) {
      throw new Error('Name, email, and message are required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    const { data: newMessage, error } = await supabaseServer
      .from('messages')
      .insert({
        first_name,
        last_name,
        email,
        phone: phone || null,
        subject: subject || null,
        project: project || null,
        message,
        type: type || 'contact',
        status: 'unread',
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create message');
    }

    return newMessage;
  }

  static async updateMessage(user, id, updateData) {
    // Check authorization
    const { data: adminData, error: roleError } = await supabaseServer
      .from('admins')
      .select('role')
      .eq('id', user.id)
      .single();

    if (roleError || !['super_admin', 'messages_manager'].includes(adminData?.role)) {
      throw new Error('Forbidden');
    }

    const { status } = updateData;

    if (!status) {
      throw new Error('Status is required');
    }

    if (!['unread', 'read', 'replied'].includes(status)) {
      throw new Error('Invalid status');
    }

    const { data: message, error } = await supabaseServer
      .from('messages')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update message');
    }

    return message;
  }

  static async deleteMessage(user, id) {
    // Check authorization
    const { data: adminData, error: roleError } = await supabaseServer
      .from('admins')
      .select('role')
      .eq('id', user.id)
      .single();

    if (roleError || !['super_admin', 'messages_manager'].includes(adminData?.role)) {
      throw new Error('Forbidden');
    }

    const { error } = await supabaseServer
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error('Failed to delete message');
    }

    return { message: 'Message deleted successfully' };
  }
}