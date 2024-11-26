// Utility functions for converting files to text and back

class FileConverter {
    /**
     * Convert a file to a base64 encoded text string
     * @param {File|Blob} file - The file to convert
     * @returns {Promise<string>} Base64 encoded string representation of the file
     */
    static async fileToText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                // Remove the data URL prefix (e.g., "data:image/png;base64,")
                const base64String = event.target.result.split(',')[1];
                resolve(base64String);
            };
            
            reader.onerror = (error) => {
                reject(error);
            };
            
            // Read the file as a base64 data URL
            reader.readAsDataURL(file);
        });
    }
  
    /**
     * Convert a base64 encoded text string back to a file
     * @param {string} base64String - Base64 encoded string of the file
     * @param {string} fileName - Original filename to preserve
     * @param {string} mimeType - MIME type of the original file
     * @returns {File} Reconstructed file object
     */
    static textToFile(base64String, fileName, mimeType) {
      // Decode the base64 string
      const byteCharacters = atob(base64String);
      
      // Convert to byte array
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      // Create a blob from the byte array
      const blob = new Blob([byteArray], { type: mimeType });
      
      // Create a File object
      return new File([blob], fileName, { type: mimeType });
    }
  
    /**
     * Convenience method to handle full conversion process
     * @param {File|Blob} file - The file to convert
     * @returns {Promise<{base64: string, originalFile: File}>} Conversion result
     */
    static async convertFileToTransmittable(file) {
        const base64String = await this.fileToText(file);
        
        return {
            base64: base64String,
            originalFile: file,
            fileName: file.name,
            mimeType: file.type
        };
    }
  
    /**
     * Reconstruct file from transmission data
     * @param {Object} transmissionData - Data returned from convertFileToTransmittable
     * @returns {File} Reconstructed file
     */
    static reconstructFile(transmissionData) {
        return this.textToFile(
            transmissionData.base64, 
            transmissionData.fileName, 
            transmissionData.mimeType
        );
    }

    /**
     * Download a file directly in the browser
     * @param {File|Blob} file - The file to download
     * @param {string} [customFileName] - Optional custom filename (uses original if not provided)
     */
    static downloadFile(file, customFileName) {
        // Create a temporary URL for the file
        const url = window.URL.createObjectURL(file);
        
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = url;
        link.download = customFileName || file.name;
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    /**
     * Full example method showing file conversion and download
     * @param {File} file - The file to convert and download
     */
    static async convertAndDownload(file) {
        try {
            // Convert file to transmittable format
            const transmittableFile = await this.convertFileToTransmittable(file);
            
            // Reconstruct the file
            const reconstructedFile = this.reconstructFile(transmittableFile);
            
            // Download the reconstructed file
            this.downloadFile(reconstructedFile);
        } catch (error) {
            console.error('File conversion or download error:', error);
        }
    }
}
  
// Example usage:
function setupFileDownload() {
    const fileInput = document.getElementById('fileInput');
    
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
      
        if (file) {
            FileConverter.convertAndDownload(file);
        }
    });
}