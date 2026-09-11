import { supabase } from './supabase.js';

/**
 * Fetch profile from Supabase profiles table
 */
export async function getProfile(userId) {
    if (!userId) return null;
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
            
        if (error) {
            console.warn("Notice: Error or no profile in Supabase:", error.message);
            return null;
        }
        return data;
    } catch (err) {
        console.warn("getProfile exception:", err);
        return null;
    }
}

/**
 * Create or update profile in Supabase profiles table
 */
export async function updateProfile(userId, profileData) {
    if (!userId) throw new Error("userId required to update profile");
    const payload = {
        ...profileData,
        id: userId,
        updated_at: new Date().toISOString()
    };
    try {
        const { data, error } = await supabase
            .from('profiles')
            .upsert(payload)
            .select()
            .maybeSingle();
            
        if (error) {
            console.warn("Supabase updateProfile notice:", error.message);
            return payload;
        }
        return data || payload;
    } catch (err) {
        console.warn("updateProfile exception:", err);
        return payload;
    }
}

/**
 * Upload avatar to Supabase Storage
 */
export async function uploadAvatar(userId, file) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    await updateProfile(userId, { avatar_url: data.publicUrl });
    
    await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
    });

    return data.publicUrl;
}

/**
 * Delete avatar from Supabase Storage
 */
export async function deleteAvatar(userId) {
    const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', userId).maybeSingle();
    if (profile && profile.avatar_url) {
        const urlParts = profile.avatar_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        await supabase.storage.from('avatars').remove([`${userId}/${fileName}`]);
        await updateProfile(userId, { avatar_url: null });
        await supabase.auth.updateUser({
            data: { avatar_url: null }
        });
    }
}
