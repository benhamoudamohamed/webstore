import { Category } from "./category";

export interface Product {
  id: string;
  productCode: string;
  name: string;
  price: number;
  isFavorite: boolean;
  isAvailable: boolean;
  file?: File;
  fileName: string;
  fileURL: string;
  //created: Date;
  created: string;
  category: Category;
}
