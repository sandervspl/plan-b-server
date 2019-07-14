export type Image = {
  id: number;
  name: string;
  hash: string;
  sha256: string;
  ext: string;
  mime: string;
  size: string;
  url: string;
  provider: string;
  public_id?: number;
  created_at: Date;
  updated_at: Date;
}

export type Meta = {
  id: number;
  title: string;
  description: string;
  aboutpage?: number;
  homepage: number;
  loginpage?: number;
  created_at: Date;
  updated_at: Date;
  image: Image;
}

export type Post = {
  id: number;
  title: string;
  content: string;
  abstract: string;
  published: boolean;
  homepage: number;
  created_at: Date;
  updated_at: Date;
  image: Image;
}

export type Tag = {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export type Basepage = {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export type Homepage = Basepage & {
  meta: Meta;
  posts: Post[];
}

export type Aboutpage = Basepage & {
  meta: Meta;
  title: string;
  content: string;
}

export type Loginpage = Basepage & {
  meta: Meta;
  title: string;
  content: string;
  disclaimer: string;
}

export type NewsDetailpage = Basepage & {
  title: string;
  content: string;
  abstract: string;
  published: boolean;
  homepage?: Homepage;
  image: Image;
  tags?: Tag[];
}

export type Pages = Homepage | Aboutpage | Loginpage | NewsDetailpage;
