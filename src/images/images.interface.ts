export interface OutputImage {
  id: number;
  originalname: string;
  tags: string[];
}

export interface Image extends OutputImage {
  filename: string;
}

export interface ImageFile extends Image {
  destination: string;
}


