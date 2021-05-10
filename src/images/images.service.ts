import axios from "axios";
import fs from "fs-extra"
import FormData from "form-data";
import _ from "lodash";
import { Image, OutputImage, ImageFile } from "./images.interface";

const allowed_keys = ["id", "tags", "originalname", "filename"];

const output_keys = ["id", "tags", "originalname"];

let images: {[key: number]: Image} = {
};


export const findAll = async (): Promise<Image[]> => Object.values(images);

export const find = async (id: number): Promise<Image> => images[id];

export const findByTag = async (tag: string): Promise<OutputImage[]> => {
  return new Promise((resolve, reject) => {
    const matchingRecords: OutputImage[] = [];
    for(let id in images){
      const image = images[id];
      if(image.tags.includes(tag)){
        matchingRecords.push(_.pick(image, output_keys) as OutputImage);
      }
    }
    if (matchingRecords.length > 0) {
        return resolve(matchingRecords);
    } else {
        return reject("No images saved under this user, contain the specified tag (perhaps extraneous '/'");
    }
  })
}


export const create = async (newImage: ImageFile): Promise<OutputImage> => {
  const id = new Date().valueOf();
  
  const everypixel_tags = await getTags(newImage.destination + newImage.filename);
  if(newImage.tags){
    newImage.tags = [...newImage.tags, ...everypixel_tags] 
  } else {
    newImage.tags = everypixel_tags;
  }
  
  const filtered = newImage as Image;

  images[id] = {
    ...filtered,
    id,
  };

  return _.pick(images[id], output_keys) as OutputImage;
};

export const update = async (
  id: number,
  imageUpdate: ImageFile
): Promise<OutputImage | null> => {
  const image = await find(id);
  
  if (!image) {
    return null;
  }
  
  const everypixel_tags = await getTags(imageUpdate.destination + imageUpdate.filename);
  if(imageUpdate.tags){
    imageUpdate.tags = [...imageUpdate.tags, ...everypixel_tags] 
  } else {
    imageUpdate.tags = everypixel_tags;
  }
  
  const filtered = imageUpdate as Image;
    
  images[id] = { ...filtered, id };
  
  return _.pick(images[id], output_keys) as OutputImage;
};

export const remove = async (id: number): Promise<null | void> => {
  const image = await find(id);

  if (!image) {
    return null;
  }

  delete images[id];
};

const getTags = async (filePath: string): Promise<string[]> => {
  const url: string = "https://api.everypixel.com/v1/keywords?num_keywords=4";
  const image: fs.ReadStream = fs.createReadStream(filePath);
  const bodyFormData = new FormData()
  bodyFormData.append("data", image); 
  
  const clientID = process.env.CLIENT_ID || "";
  const clientSecret = process.env.CLIENT_SECRET || "";
  const config = {
      auth: {
          username: clientID,
          password: clientSecret
      },
      headers: {
          "Content-Type": "multipart/form-data; boundary=" + bodyFormData.getBoundary()
      }
  }
  return new Promise((resolve, reject) => {
      return axios.post(url, bodyFormData, config).then((response: any) => {
          resolve(response.data.keywords.map((data: any) => { return data.keyword }));
      }).catch((err: any) => {
          reject(err.message);
      })
  })
}