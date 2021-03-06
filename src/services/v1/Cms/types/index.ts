import * as i from 'types';

export type BaseResponseBody = {
  id: number;
  created_at: string;
  updated_at: string;
}

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
  public_id?: string;
  created_at: Date;
  updated_at: Date;
}

export type Class = i.BaseResponseBody & {
  name: string;
  color: string;
  recruitment: number;
  icon: i.Image;
}

export type Race = i.BaseResponseBody & {
  name: string;
  icon: i.Image;
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
  image: i.Image;
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
  image: i.Image;
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
  meta: i.Meta;
  posts: i.Post[];
}

export type Aboutpage = Basepage & {
  meta: i.Meta;
  title: string;
  content: string;
}

export type Loginpage = Basepage & {
  meta: i.Meta;
  title: string;
  content: string;
  disclaimer: string;
}

export type NewsDetailpage = Basepage & {
  title: string;
  content: string;
  abstract: string;
  published: boolean;
  homepage?: i.Homepage;
  image: i.Image;
  tags?: i.Tag[];
}

export type Pages = i.Homepage | i.Aboutpage | i.Loginpage | i.NewsDetailpage;
