export const base64ImgEncoder = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Nie przekazano żadnego pliku ani obiektu Blob."));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Błąd podczas konwersji na Base64."));
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export const base64ImgDecoder = (base64String: string, fileName: string): File => {
  const parts = base64String.split(",");
  const header = parts[0];
  const data = parts[1];

  const mimeMatch = header.match(/:(.*?);/);
  
  if (!mimeMatch) {
    throw new Error("Nieprawidłowy format Base64.");
  }

  const mimeType = mimeMatch[1];
  const binaryString = atob(data);
  const length = binaryString.length;
  const uint8Array = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return new File([uint8Array], fileName, { type: mimeType });
};
