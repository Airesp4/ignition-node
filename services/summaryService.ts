import * as path from 'path';
import { UploadedFile } from 'express-fileupload';
import { readFile } from './fileService.ts';
import { generateContentFromGemini } from './geminiService.ts';


export async function summarizeFile(file: UploadedFile): Promise<string> {
    validateFile(file);
    const text = await readFile(file);
    if (!text || text.trim().length === 0) {
        throw new Error('File contains no readable text');
    }
    return generateContentFromGemini('resuma: '+ text);
}

export function validateFile(file: UploadedFile): void {
    const extension = path.extname(file.name).toLowerCase();
    const MAX_FILE_SIZE = 1024 * 1024; // 1MB

    if(!file.data || file.data.length === 0){
        throw new Error('File content is null');
    }

    if (extension !== '.docx' && extension !== '.txt') {
        throw new Error('Invalid File Extension, only allowed .docx or .txt');
    }

    if (file.data.length > MAX_FILE_SIZE) {
        throw new Error('Invalid File, size is larger than 1MB');
    }
}
