import { IUsuarioParams } from "../../ts/IUsuario";

export const usuarioKeys = {
  todos: () => ["usuarios"] as const,
  usuarios: () => [...usuarioKeys.todos(), "usuarios"] as const,
  usuariosParams: (params: IUsuarioParams) =>
    [...usuarioKeys.usuarios(), params] as const,
};
