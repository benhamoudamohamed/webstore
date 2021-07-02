import { Product } from "./product";

export interface Category {
  id: string;
  name: string;
  file?: File;
  fileName: string;
  fileURL: string;
  //created: Date;
  created: string;
  products: Product[];
}
