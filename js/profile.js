import { supabase } from './supabase.js';

export async function getProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
    return data;
}

export async function updateProfile(userId, profileData) {
    const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select()
        .single();
        
    if (error) throw error;
    return data;
}

export async function uploadAvatar(userId, file) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    // Update profile
    await updateProfile(userId, { id: userId, avatar_url: data.publicUrl });
    
    // Update Auth Metadata
    await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
    });

    return data.publicUrl;
}

export async function deleteAvatar(userId) {
    // Note: We might need to fetch the existing profile to get the exact extension if it's not .webp
    // For simplicity, we just delete the file from storage and nullify it in DB
    const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', userId).single();
    if(profile && profile.avatar_url) {
        const urlParts = profile.avatar_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        await supabase.storage.from('avatars').remove([`${userId}/${fileName}`]);
        await updateProfile(userId, { id: userId, avatar_url: null });
        await supabase.auth.updateUser({
            data: { avatar_url: null }
        });
    }
}
