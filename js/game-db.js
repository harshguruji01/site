import { supabase } from './supabase.js';
import { AuthManager } from './auth.js';

export async function saveGameScore(gameName, score, additionalData = {}) {
    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session) {
            console.log("User not logged in, score not saved to database.");
            return false;
        }

        const user = session.user;
        const email = user.email;

        const { data, error } = await supabase
            .from('game_scores')
            .insert([
                { 
                    user_id: user.id,
                    email: email,
                    game_name: gameName,
                    score: score,
                    additional_data: additionalData
                }
            ]);

        if (error) {
            console.error("Error saving game score:", error.message);
            return false;
        }

        console.log(`Successfully saved score ${score} for ${gameName} to database.`);
        return true;
    } catch (err) {
        console.error("Failed to save game score:", err);
        return false;
    }
}
