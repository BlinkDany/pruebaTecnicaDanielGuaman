export interface IUsuario {
  gender: string;
  name: IName;
  location: ILocation;
  email: string;
  login: ILogin;
  dob: IDob;
  registered: IDob;
  phone: string;
  cell: string;
  id: IId;
  picture: IPicture;
  nat: string;
}

export type IName = {
  title: string;
  first: string;
  last: string;
};

export type IStreet = {
  number: number;
  name: string;
};

export type ICoordinates = {
  latitude: string;
  longitude: string;
};

export type ITimezone = {
  offset: string;
  description: string;
};

export type ILocation = {
  street: IStreet;
  city: string;
  state: string;
  country: string;
  postcode: string | number;
  coordinates: ICoordinates;
  timezone: ITimezone;
};

export type ILogin = {
  uuid: string;
  username: string;
  password: string;
  salt: string;
  md5: string;
  sha1: string;
  sha256: string;
};

export type IDob = {
  date: string;
  age: number;
};

export type IId = {
  name: string;
  value: string | null;
};

export type IPicture = {
  large: string;
  medium: string;
  thumbnail: string;
};

export type IInfo = {
  seed: string;
  results: number;
  page: number;
  version: string;
};

export interface IUsuarioListado {
  results: IUsuario[];
  info: IInfo;
}

export type IUsuarioParams = {
  page: number;
};
