export const base64ImgEncoder = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to convert image to Base64."));

    reader.readAsDataURL(file);
  });
};

export const base64ImgDecoder = (data: any): string => {
  return String.fromCharCode(...data);
};