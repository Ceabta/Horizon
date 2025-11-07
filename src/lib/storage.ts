import { supabase } from './supabase';

export const storageHelper = {
  async uploadPDF(file: File, osId: number): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
    try {
      const fileName = `os-${osId}-${Date.now()}.pdf`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('ordem-servico-pdfs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('ordem-servico-pdfs')
        .getPublicUrl(filePath);

      return { success: true, url: publicUrl, path: filePath };
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      return { success: false, error: error.message };
    }
  },

  async downloadPDF(filePath: string): Promise<{ success: boolean; blob?: Blob; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from('ordem-servico-pdfs')
        .download(filePath);

      if (error) throw error;

      return { success: true, blob: data };
    } catch (error: any) {
      console.error('Erro ao baixar PDF:', error);
      return { success: false, error: error.message };
    }
  },

  async deletePDF(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from('ordem-servico-pdfs')
        .remove([filePath]);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Erro ao deletar PDF:', error);
      return { success: false, error: error.message };
    }
  },

  extractPathFromUrl(url: string): string {
    const parts = url.split('/ordem-servico-pdfs/');
    return parts[1] || '';
  }
};