import express, { Request, Response } from "express";
import multer from "multer";
import * as ImageService from "./images.service";
import { Image, OutputImage, ImageFile } from "./images.interface";

const upload = multer({ 
  dest: "uploads/",
  limits: { 
    fileSize: 1000000, 
  },
  fileFilter: function fileFilter(req: any, file: any, cb: any): any {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)){
      cb(new Error("Please upload an image."));
    }
    cb(undefined, true)
  }
});

export const imagesRouter = express.Router();

imagesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const images: Image[] = await ImageService.findAll();

    res.status(200).send(images);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// GET images/:id
imagesRouter.get("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const image: Image = await ImageService.find(id);

    if (image) {
      return res.status(200).send(image);
    }

    res.status(404).json({error: "image not found"});
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// GET images/tag/:tag
imagesRouter.get("/tag/:tag", async (req: Request, res: Response) => {
  const tag: string = req.params.tag || "";
  try {
    const images: OutputImage[] = await ImageService.findByTag(tag);

    if (images.length > 0) {
      return res.status(200).send(images);
    }

    res.status(200).json({error: "no images found with that tag"});
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// POST images
imagesRouter.post("/", upload.single("image"), async (req: Request, res: Response) => {
  try {
    if(req.body.tags){
      req.body.tags = req.body.tags.split(",");
    }
    const image: ImageFile = {...req.body, ...req.file};

    const newImage = await ImageService.create(image);

    res.status(201).json(newImage);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
});

// PUT images/:id
imagesRouter.put("/:id", upload.single("image"), async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  
  if(req.body.tags){
    req.body.tags = req.body.tags.split(",");
  }
  
  try {
    const imageUpdate: ImageFile = {...req.body, ...req.file};

    const existingImage: Image = await ImageService.find(id);
    
    if (existingImage) {
      const updatedImage = await ImageService.update(id, imageUpdate);
      return res.status(200).json(updatedImage);
    }

    const newImage = await ImageService.create(imageUpdate);

    res.status(201).json(newImage);
  } catch (e) {
    res.status(500).json({error: e.message});
  }
});

// DELETE images/:id
imagesRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await ImageService.remove(id);

    res.status(200).json({image: "deleted"});
  } catch (e) {
    res.status(500).json({error: e.message});
  }
});