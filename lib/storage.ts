
import { supabase } from '../lib/supabase';

export const storageService = {
    async uploadFile(bucket: 'portfolio' | 'assets' | 'project-videos', file: File) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    },

    async deleteFile(bucket: 'portfolio' | 'assets' | 'project-videos', url: string) {
        const fileName = url.split('/').pop();
        if (!fileName) return;

        const { error } = await supabase.storage
            .from(bucket)
            .remove([fileName]);

        if (error) throw error;
    }
};
