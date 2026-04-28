import { IUsuarioListado } from "../ts/IUsuario";
import { get } from "./config";

export const usuariosAPI = {
  listado: async (page: number) => {
    const resultado = await get<IUsuarioListado>(
      `/api/?results=30&seed=sip&page=${page}`,
      {}
    );

    return resultado.data;
  },
};
